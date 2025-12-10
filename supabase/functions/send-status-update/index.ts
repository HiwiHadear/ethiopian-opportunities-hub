import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";
import { 
  generateStatusUpdateEmail, 
  type ApplicationStatus,
  type EmailBranding 
} from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  applicationType: "job" | "tender";
  applicationId: string;
  newStatus: ApplicationStatus;
  customMessage?: string;
  nextSteps?: string[];
  interviewDate?: string;
  interviewLocation?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      applicationType, 
      applicationId, 
      newStatus, 
      customMessage,
      nextSteps,
      interviewDate,
      interviewLocation 
    }: StatusUpdateRequest = await req.json();

    console.log(`Processing status update: ${applicationType} application ${applicationId} -> ${newStatus}`);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch application details based on type
    let applicantEmail: string;
    let applicantName: string;
    let title: string;
    let company: string;

    if (applicationType === "job") {
      const { data: application, error: appError } = await supabase
        .from("job_applications")
        .select(`
          id,
          full_name,
          email,
          jobs (
            title,
            company
          )
        `)
        .eq("id", applicationId)
        .single();

      if (appError || !application) {
        console.error("Error fetching job application:", appError);
        throw new Error("Job application not found");
      }

      applicantEmail = application.email;
      applicantName = application.full_name;
      title = application.jobs?.title || "Position";
      company = application.jobs?.company || "Company";
    } else {
      const { data: application, error: appError } = await supabase
        .from("tender_applications")
        .select(`
          id,
          company_name,
          company_email,
          tenders (
            title,
            organization
          )
        `)
        .eq("id", applicationId)
        .single();

      if (appError || !application) {
        console.error("Error fetching tender application:", appError);
        throw new Error("Tender application not found");
      }

      applicantEmail = application.company_email;
      applicantName = application.company_name;
      title = application.tenders?.title || "Tender";
      company = application.tenders?.organization || "Organization";
    }

    // Fetch email branding settings
    const { data: brandingData } = await supabase
      .from("email_branding")
      .select("*")
      .single();

    const branding: EmailBranding | undefined = brandingData ? {
      logo_url: brandingData.logo_url || undefined,
      primary_color: brandingData.primary_color,
      secondary_color: brandingData.secondary_color,
      company_name: brandingData.company_name,
      company_website: brandingData.company_website || undefined,
      support_email: brandingData.support_email || undefined,
    } : undefined;

    // Generate the email HTML
    const emailHtml = generateStatusUpdateEmail({
      recipientName: applicantName,
      recipientEmail: applicantEmail,
      applicationType,
      title,
      company,
      status: newStatus,
      message: customMessage,
      nextSteps,
      interviewDate,
      interviewLocation,
      contactEmail: branding?.support_email,
      branding,
    });

    // Determine email subject based on status
    const subjectMap: Record<ApplicationStatus, string> = {
      accepted: `Congratulations! Your Application for ${title} Has Been Accepted`,
      rejected: `Update on Your Application for ${title}`,
      under_review: `Your Application for ${title} Is Under Review`,
      shortlisted: `Great News! You've Been Shortlisted for ${title}`,
      interview_scheduled: `Interview Scheduled for ${title}`,
    };

    const subject = subjectMap[newStatus];
    const fromEmail = branding?.support_email 
      ? `${branding.company_name} <${branding.support_email}>` 
      : `${branding?.company_name || 'Notifications'} <onboarding@resend.dev>`;

    console.log(`Sending ${newStatus} email to ${applicantEmail}`);

    // Send the email
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [applicantEmail],
      subject,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log(`Email sent successfully: ${emailResponse.data?.id}`);

    // Log the notification
    const { error: logError } = await supabase
      .from("notification_log")
      .insert({
        user_id: "00000000-0000-0000-0000-000000000000", // System user placeholder
        application_id: applicationId,
        application_type: applicationType,
        notification_type: `status_update_${newStatus}`,
      });

    if (logError) {
      console.warn("Failed to log notification:", logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Status update email sent to ${applicantEmail}`,
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-status-update function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
