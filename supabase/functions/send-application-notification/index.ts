import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";
import { generateInstantNotificationEmail } from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  applicationType: 'job' | 'tender';
  applicationId: string;
  applicantName: string;
  title: string;
  appliedAt: string;
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

    const { applicationType, applicationId, applicantName, title, appliedAt }: NotificationRequest = await req.json();

    console.log("Processing notification for:", { applicationType, applicationId, applicantName });

    // Get all admin users with notification preferences
    const { data: adminRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw rolesError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found to notify");
      return new Response(JSON.stringify({ message: "No admins to notify" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminUserIds = adminRoles.map(r => r.user_id);

    // Get admin profiles and notification preferences
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, email, full_name')
      .in('id', adminUserIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    const { data: preferences, error: prefsError } = await supabaseClient
      .from('notification_preferences')
      .select('*')
      .in('user_id', adminUserIds)
      .eq('email_on_new_application', true);

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
      throw prefsError;
    }

    const usersToNotify = profiles?.filter(profile => {
      // If user has no preferences, default to sending notifications
      const userPref = preferences?.find(p => p.user_id === profile.id);
      return !userPref || userPref.email_on_new_application;
    });

    if (!usersToNotify || usersToNotify.length === 0) {
      console.log("No admins want instant notifications");
      return new Response(JSON.stringify({ message: "No admins opted in for notifications" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch email branding
    const { data: branding } = await supabaseClient
      .from('email_branding')
      .select('*')
      .single();

    // Send emails to each admin
    const emailPromises = usersToNotify.map(async (user) => {
      try {
        const applicationTypeLabel = applicationType === 'job' ? 'Job' : 'Tender';
        const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/admin`;
        
        const emailHtml = generateInstantNotificationEmail({
          recipientName: user.full_name || 'Admin',
          applicantName,
          applicationType,
          title,
          appliedAt,
          dashboardUrl,
          branding: branding || undefined,
        });
        
        const { data, error } = await resend.emails.send({
          from: "Application Notifications <onboarding@resend.dev>",
          to: [user.email],
          subject: `🎉 New ${applicationTypeLabel} Application - ${applicantName}`,
          html: emailHtml,
        });

        if (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          return null;
        }

        // Log the notification
        await supabaseClient.from('notification_log').insert({
          user_id: user.id,
          notification_type: 'instant',
          application_type: applicationType,
          application_id: applicationId,
        });

        console.log(`Email sent successfully to ${user.email}`);
        return data;
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        return null;
      }
    });

    await Promise.all(emailPromises);

    return new Response(JSON.stringify({ message: "Notifications sent" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-application-notification function:", error);
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
