import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  GraduationCap, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostScholarshipDialog } from "@/components/PostScholarshipDialog";
import ThemeToggle from "@/components/ThemeToggle";

const Scholarships = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch scholarships",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || scholarship.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleApplyToScholarship = (scholarship: any) => {
    setSelectedScholarship(scholarship);
  };

  const handleAddScholarship = async () => {
    await fetchScholarships();
    toast({
      title: "Scholarship Created",
      description: "New scholarship has been created successfully.",
    });
  };

  const ScholarshipCard = ({ scholarship }: { scholarship: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-primary mb-2">
              {scholarship.title}
            </CardTitle>
            <CardDescription className="flex items-center text-muted-foreground mb-2">
              <Award className="w-4 h-4 mr-1" />
              {scholarship.organization}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {scholarship.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="font-medium">Field:</span>
            <span className="ml-1">{scholarship.field}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-medium">Amount:</span>
            <span className="ml-1">{scholarship.amount}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">Location:</span>
            <span className="ml-1">{scholarship.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-destructive">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">Deadline:</span>
            <span className="ml-1">{new Date(scholarship.deadline).toLocaleDateString()}</span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3">
            {scholarship.description}
          </p>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              onClick={() => handleApplyToScholarship(scholarship)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              onClick={() => window.open(scholarship.application_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedScholarship) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedScholarship(null)}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Scholarships
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Scholarship Details</h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Scholarship Details */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {selectedScholarship.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {selectedScholarship.organization}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Scholarship Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <Badge variant="secondary">{selectedScholarship.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Field:</span>
                      <span className="text-foreground">{selectedScholarship.field}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium text-foreground">{selectedScholarship.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground">{selectedScholarship.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="text-destructive font-medium">
                        {new Date(selectedScholarship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Description</h3>
                  <p className="text-muted-foreground">{selectedScholarship.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Requirements</h3>
                  <ul className="space-y-2">
                    {(selectedScholarship.requirements || []).map((req: string, index: number) => (
                      <li key={index} className="flex items-start text-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                        {req}
                      </li>
                    ))}
                    {(!selectedScholarship.requirements || selectedScholarship.requirements.length === 0) && (
                      <li className="text-muted-foreground">No requirements specified</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Benefits</h3>
                  <ul className="space-y-2">
                    {(selectedScholarship.benefits || []).map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start text-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></span>
                        {benefit}
                      </li>
                    ))}
                    {(!selectedScholarship.benefits || selectedScholarship.benefits.length === 0) && (
                      <li className="text-muted-foreground">No benefits specified</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-border">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={() => window.open(selectedScholarship.application_url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Apply for This Scholarship
                </Button>
                <Button size="lg" variant="outline">
                  Save for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/">
                <Button variant="ghost" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-foreground">Scholarship Opportunities</h1>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {user && isAdmin && (
                  <>
                    <PostScholarshipDialog onScholarshipCreated={() => {}}>
                      <Button variant="secondary" size="sm">Create New Scholarship</Button>
                    </PostScholarshipDialog>
                    <Link to="/admin">
                      <Button variant="secondary" size="sm">Admin Dashboard</Button>
                    </Link>
                  </>
                )}
                {!user ? (
                  <Link to="/auth">
                    <Button>Sign In</Button>
                  </Link>
                ) : (
                  <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Scholarship Opportunities
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover funding opportunities to pursue your educational dreams. 
            Find scholarships that match your field of study and career goals.
          </p>
          <div className="flex items-center justify-center gap-4 text-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {scholarships.length}+ Active Scholarships
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search scholarships by title, organization, or field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Available Scholarships ({filteredScholarships.length})
            </h2>
            <p className="text-muted-foreground mt-2">
              Find the perfect scholarship opportunity for your educational journey
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading scholarships...</p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No scholarships found
              </h3>
              <p className="text-muted-foreground/70">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Scholarships;
