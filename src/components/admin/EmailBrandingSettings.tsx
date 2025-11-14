import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";

export const EmailBrandingSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  return (
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

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Branding Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
