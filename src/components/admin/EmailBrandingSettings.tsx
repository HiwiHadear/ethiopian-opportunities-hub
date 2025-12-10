import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Eye } from "lucide-react";
import { 
  generateInstantNotificationEmail, 
  generateDigestEmail,
  generateStatusUpdateEmail,
  type ApplicationStatus 
} from "../../../supabase/functions/_shared/email-templates";

export const EmailBrandingSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [branding, setBranding] = useState({
    id: "",
    company_name: "Your Company",
    primary_color: "#667eea",
    secondary_color: "#764ba2",
    logo_url: "",
    company_website: "",
    support_email: "",
  });

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const { data, error } = await supabase
        .from("email_branding")
        .select("*")
        .single();

      if (error) throw error;
      if (data) {
        setBranding(data);
      }
    } catch (error: any) {
      console.error("Error fetching branding:", error);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      // Delete old logo if exists
      if (branding.logo_url) {
        const oldPath = branding.logo_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("email-logos").remove([oldPath]);
        }
      }

      // Upload new logo
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("email-logos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("email-logos")
        .getPublicUrl(fileName);

      setBranding({ ...branding, logo_url: publicUrl });

      toast({
        title: "Logo uploaded",
        description: "Your email logo has been uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("email_branding")
        .update({
          company_name: branding.company_name,
          primary_color: branding.primary_color,
          secondary_color: branding.secondary_color,
          logo_url: branding.logo_url,
          company_website: branding.company_website,
          support_email: branding.support_email,
        })
        .eq("id", branding.id);

      if (error) throw error;

      toast({
        title: "Branding updated",
        description: "Email branding settings have been saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving branding:", error);
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPreviewBranding = () => ({
    logo_url: branding.logo_url || undefined,
    primary_color: branding.primary_color,
    secondary_color: branding.secondary_color,
    company_name: branding.company_name,
    company_website: branding.company_website || undefined,
    support_email: branding.support_email || undefined,
  });

  const instantNotificationPreview = generateInstantNotificationEmail({
    recipientName: "Admin User",
    applicantName: "Jane Doe",
    applicationType: "job",
    title: "Senior Software Engineer",
    appliedAt: new Date().toISOString(),
    dashboardUrl: window.location.origin + "/admin",
    branding: getPreviewBranding(),
  });

  const digestPreview = generateDigestEmail({
    recipientName: "Admin User",
    frequency: "daily",
    totalApplications: 5,
    jobApplications: [
      {
        full_name: "Jane Doe",
        email: "jane@example.com",
        applied_at: new Date().toISOString(),
        status: "pending",
        jobs: {
          title: "Senior Software Engineer",
          company: "Tech Corp",
        },
      },
      {
        full_name: "John Smith",
        email: "john@example.com",
        applied_at: new Date(Date.now() - 3600000).toISOString(),
        status: "pending",
        jobs: {
          title: "Product Manager",
          company: "Startup Inc",
        },
      },
    ],
    tenderApplications: [
      {
        company_name: "BuildCo Ltd",
        company_email: "contact@buildco.com",
        applied_at: new Date(Date.now() - 7200000).toISOString(),
        status: "pending",
        tenders: {
          title: "Road Construction Project",
          organization: "City Council",
        },
      },
    ],
    dashboardUrl: window.location.origin + "/admin",
    branding: getPreviewBranding(),
  });

  const generateStatusPreview = (status: ApplicationStatus) => {
    const baseData = {
      recipientName: "Jane Doe",
      recipientEmail: "jane@example.com",
      applicationType: "job" as const,
      title: "Senior Software Engineer",
      company: branding.company_name || "Tech Corp",
      branding: getPreviewBranding(),
    };

    const statusData: Record<ApplicationStatus, Partial<typeof baseData & { nextSteps: string[]; interviewDate: string; interviewLocation: string }>> = {
      accepted: {
        nextSteps: [
          "You will receive onboarding information within 2-3 business days",
          "Please prepare your identification documents",
          "Your start date will be confirmed shortly"
        ]
      },
      rejected: {},
      under_review: {},
      shortlisted: {
        nextSteps: [
          "We will contact you within the next 5 business days",
          "Please keep your phone and email available",
          "Prepare to discuss your experience in detail"
        ]
      },
      interview_scheduled: {
        interviewDate: "Monday, January 15, 2024 at 10:00 AM",
        interviewLocation: "123 Business Street, Suite 400, City, Country (or Video Call Link)",
        nextSteps: [
          "Please confirm your attendance by replying to this email",
          "Bring a copy of your resume and portfolio",
          "Arrive 10 minutes early"
        ]
      }
    };

    return generateStatusUpdateEmail({
      ...baseData,
      status,
      ...statusData[status]
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Branding</CardTitle>
          <CardDescription>
            Customize the appearance of email notifications sent to admins and users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              {branding.logo_url && (
                <img
                  src={branding.logo_url}
                  alt="Company logo"
                  className="h-16 w-auto object-contain border rounded-md p-2"
                />
              )}
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: PNG or JPG, max 2MB
                </p>
              </div>
              {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={branding.company_name}
              onChange={(e) => setBranding({ ...branding, company_name: e.target.value })}
              placeholder="Your Company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_website">Company Website (Optional)</Label>
            <Input
              id="company_website"
              type="url"
              value={branding.company_website || ""}
              onChange={(e) => setBranding({ ...branding, company_website: e.target.value })}
              placeholder="https://yourcompany.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support_email">Support Email (Optional)</Label>
            <Input
              id="support_email"
              type="email"
              value={branding.support_email || ""}
              onChange={(e) => setBranding({ ...branding, support_email: e.target.value })}
              placeholder="support@yourcompany.com"
            />
          </div>

          {/* Color Customization */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={branding.primary_color}
                  onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={branding.primary_color}
                  onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                  placeholder="#667eea"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={branding.secondary_color}
                  onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={branding.secondary_color}
                  onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                  placeholder="#764ba2"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Email Header Preview</Label>
            <div
              className="rounded-lg p-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${branding.primary_color} 0%, ${branding.secondary_color} 100%)`,
              }}
            >
              {branding.logo_url && (
                <img
                  src={branding.logo_url}
                  alt="Logo preview"
                  className="h-12 w-auto mx-auto mb-4 bg-white/10 rounded p-2"
                />
              )}
              <h2 className="text-2xl font-bold text-white">
                {branding.company_name}
              </h2>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Branding Settings"
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
            <CardDescription>
              See how your notification emails will look with the current branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="instant" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1">
                <TabsTrigger value="instant" className="text-xs">New Application</TabsTrigger>
                <TabsTrigger value="digest" className="text-xs">Digest</TabsTrigger>
                <TabsTrigger value="accepted" className="text-xs">Accepted</TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs">Rejected</TabsTrigger>
                <TabsTrigger value="under_review" className="text-xs">Under Review</TabsTrigger>
                <TabsTrigger value="shortlisted" className="text-xs">Shortlisted</TabsTrigger>
                <TabsTrigger value="interview" className="text-xs">Interview</TabsTrigger>
              </TabsList>
              <TabsContent value="instant" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={instantNotificationPreview}
                    className="w-full h-[600px]"
                    title="Instant Notification Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="digest" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={digestPreview}
                    className="w-full h-[600px]"
                    title="Digest Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="accepted" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generateStatusPreview("accepted")}
                    className="w-full h-[600px]"
                    title="Accepted Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="rejected" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generateStatusPreview("rejected")}
                    className="w-full h-[600px]"
                    title="Rejected Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="under_review" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generateStatusPreview("under_review")}
                    className="w-full h-[600px]"
                    title="Under Review Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="shortlisted" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generateStatusPreview("shortlisted")}
                    className="w-full h-[600px]"
                    title="Shortlisted Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
              <TabsContent value="interview" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generateStatusPreview("interview_scheduled")}
                    className="w-full h-[600px]"
                    title="Interview Scheduled Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
