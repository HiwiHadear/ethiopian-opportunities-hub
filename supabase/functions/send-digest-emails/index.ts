import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DigestRequest {
  frequency: 'daily' | 'weekly';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { frequency }: DigestRequest = await req.json();
    console.log(`Processing ${frequency} digest emails`);

    // Get users who want this frequency of digest
    const { data: preferences, error: prefsError } = await supabaseClient
      .from('notification_preferences')
      .select(`
        *,
        profiles!inner(id, email, full_name)
      `)
      .eq('digest_frequency', frequency);

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
      throw prefsError;
    }

    if (!preferences || preferences.length === 0) {
      console.log(`No users subscribed to ${frequency} digest`);
      return new Response(JSON.stringify({ message: "No users to notify" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate time range based on frequency
    const now = new Date();
    const startDate = new Date();
    if (frequency === 'daily') {
      startDate.setDate(startDate.getDate() - 1);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    // Fetch new applications in the time range
    const { data: jobApplications, error: jobError } = await supabaseClient
      .from('job_applications')
      .select(`
        id,
        full_name,
        email,
        applied_at,
        status,
        jobs!inner(title, company)
      `)
      .gte('applied_at', startDate.toISOString())
      .order('applied_at', { ascending: false });

    const { data: tenderApplications, error: tenderError } = await supabaseClient
      .from('tender_applications')
      .select(`
        id,
        company_name,
        company_email,
        applied_at,
        status,
        tenders!inner(title, organization)
      `)
      .gte('applied_at', startDate.toISOString())
      .order('applied_at', { ascending: false });

    if (jobError || tenderError) {
      console.error("Error fetching applications:", jobError || tenderError);
      throw jobError || tenderError;
    }

    const totalApplications = (jobApplications?.length || 0) + (tenderApplications?.length || 0);

    if (totalApplications === 0) {
      console.log("No new applications to report");
      return new Response(JSON.stringify({ message: "No new applications" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send digest emails
    const emailPromises = preferences.map(async (pref) => {
      try {
        const profile = pref.profiles;
        
        // Generate application summary HTML
        let applicationsHTML = '';
        
        if (jobApplications && jobApplications.length > 0) {
          applicationsHTML += `
            <h3 style="color: #333; margin-top: 20px;">Job Applications (${jobApplications.length})</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          `;
          
          jobApplications.slice(0, 10).forEach(app => {
            applicationsHTML += `
              <div style="border-bottom: 1px solid #e5e5e5; padding: 10px 0;">
                <p style="margin: 3px 0;"><strong>${app.full_name || app.email}</strong> applied for <strong>${app.jobs.title}</strong></p>
                <p style="margin: 3px 0; font-size: 12px; color: #666;">
                  ${app.jobs.company} • ${new Date(app.applied_at).toLocaleDateString()} • 
                  <span style="color: ${app.status === 'pending' ? '#f59e0b' : app.status === 'accepted' ? '#10b981' : '#ef4444'}">
                    ${app.status}
                  </span>
                </p>
              </div>
            `;
          });
          
          if (jobApplications.length > 10) {
            applicationsHTML += `<p style="color: #666; margin-top: 10px;">And ${jobApplications.length - 10} more...</p>`;
          }
          
          applicationsHTML += `</div>`;
        }
        
        if (tenderApplications && tenderApplications.length > 0) {
          applicationsHTML += `
            <h3 style="color: #333; margin-top: 20px;">Tender Applications (${tenderApplications.length})</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
          `;
          
          tenderApplications.slice(0, 10).forEach(app => {
            applicationsHTML += `
              <div style="border-bottom: 1px solid #e5e5e5; padding: 10px 0;">
                <p style="margin: 3px 0;"><strong>${app.company_name || app.company_email}</strong> applied for <strong>${app.tenders.title}</strong></p>
                <p style="margin: 3px 0; font-size: 12px; color: #666;">
                  ${app.tenders.organization} • ${new Date(app.applied_at).toLocaleDateString()} • 
                  <span style="color: ${app.status === 'pending' ? '#f59e0b' : app.status === 'accepted' ? '#10b981' : '#ef4444'}">
                    ${app.status}
                  </span>
                </p>
              </div>
            `;
          });
          
          if (tenderApplications.length > 10) {
            applicationsHTML += `<p style="color: #666; margin-top: 10px;">And ${tenderApplications.length - 10} more...</p>`;
          }
          
          applicationsHTML += `</div>`;
        }

        const { data, error } = await resend.emails.send({
          from: "Application Digest <onboarding@resend.dev>",
          to: [profile.email],
          subject: `${frequency === 'daily' ? 'Daily' : 'Weekly'} Application Digest - ${totalApplications} New Applications`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
              <h2 style="color: #333;">Your ${frequency === 'daily' ? 'Daily' : 'Weekly'} Application Digest</h2>
              <p>Hello ${profile.full_name || 'Admin'},</p>
              <p>Here's a summary of new applications received in the last ${frequency === 'daily' ? '24 hours' : '7 days'}:</p>
              
              <div style="background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h1 style="margin: 0; font-size: 48px;">${totalApplications}</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">New Applications</p>
              </div>

              ${applicationsHTML}

              <p style="margin-top: 30px;">
                <a href="https://lovable.app" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View All in Dashboard
                </a>
              </p>
              
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                You're receiving this ${frequency} digest because of your notification preferences. 
                You can change these settings in the admin dashboard.
              </p>
            </div>
          `,
        });

        if (error) {
          console.error(`Error sending digest to ${profile.email}:`, error);
          return null;
        }

        // Update last_digest_sent_at
        await supabaseClient
          .from('notification_preferences')
          .update({ last_digest_sent_at: now.toISOString() })
          .eq('user_id', pref.user_id);

        console.log(`Digest email sent successfully to ${profile.email}`);
        return data;
      } catch (error) {
        console.error(`Failed to send digest to user:`, error);
        return null;
      }
    });

    await Promise.all(emailPromises);

    return new Response(JSON.stringify({ 
      message: "Digest emails sent",
      count: preferences.length,
      applications: totalApplications
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-digest-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
