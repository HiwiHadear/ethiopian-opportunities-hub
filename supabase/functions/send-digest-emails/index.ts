import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";
import { generateDigestEmail } from "../_shared/email-templates.ts";

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

    // Fetch email branding
    const { data: branding } = await supabaseClient
      .from('email_branding')
      .select('*')
      .single();

    // Send digest emails
    const emailPromises = preferences.map(async (pref) => {
      try {
        const profile = pref.profiles;
        const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/admin`;
        
        const emailHtml = generateDigestEmail({
          recipientName: profile.full_name || 'Admin',
          frequency,
          totalApplications,
          jobApplications,
          tenderApplications,
          dashboardUrl,
          branding: branding || undefined,
        });

        const { data, error } = await resend.emails.send({
          from: "Application Digest <onboarding@resend.dev>",
          to: [profile.email],
          subject: `📊 ${frequency === 'daily' ? 'Daily' : 'Weekly'} Application Digest - ${totalApplications} New Application${totalApplications !== 1 ? 's' : ''}`,
          html: emailHtml,
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
