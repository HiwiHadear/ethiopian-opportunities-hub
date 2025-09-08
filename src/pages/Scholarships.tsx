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

const Scholarships = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([
    {
      id: 1,
      title: "Ethiopian Government Scholarship Program",
      organization: "Ministry of Education, Ethiopia",
      field: "Engineering & Technology",
      level: "masters",
      amount: "Full Tuition + Living Allowance",
      location: "Addis Ababa University, Ethiopia",
      deadline: "2024-12-31",
      description: "Comprehensive scholarship program for Ethiopian students pursuing Master's degrees in Engineering and Technology fields. Covers full tuition, accommodation, and monthly stipend.",
      requirements: [
        "Ethiopian citizenship required",
        "Bachelor's degree with minimum GPA of 3.5",
        "IELTS score of 6.5 or equivalent",
        "2+ years of relevant work experience",
        "Letter of recommendation from employer"
      ],
      benefits: [
        "Full tuition coverage",
        "Monthly living allowance of $800",
        "Free accommodation",
        "Health insurance coverage",
        "Research funding support"
      ],
      application_url: "https://moe.gov.et/scholarships",
      status: "approved"
    },
    {
      id: 2,
      title: "African Union Scholarship for Women in STEM",
      organization: "African Union Commission",
      field: "Science, Technology, Engineering & Mathematics",
      level: "undergraduate",
      amount: "$15,000 per year",
      location: "Various African Universities",
      deadline: "2024-11-15",
      description: "Empowering young African women to pursue careers in STEM fields. This scholarship supports undergraduate studies in science, technology, engineering, and mathematics.",
      requirements: [
        "Female applicant from Africa",
        "High school diploma with excellent grades",
        "Demonstrated interest in STEM fields",
        "Age between 18-25 years",
        "English proficiency certificate"
      ],
      benefits: [
        "Annual scholarship of $15,000",
        "Mentorship program access",
        "Internship opportunities",
        "Professional development workshops",
        "Networking with STEM professionals"
      ],
      application_url: "https://au.int/scholarships",
      status: "approved"
    },
    {
      id: 3,
      title: "Mastercard Foundation Scholars Program",
      organization: "Mastercard Foundation",
      field: "Various Fields",
      level: "undergraduate",
      amount: "Full Scholarship + Support",
      location: "Leading African Universities",
      deadline: "2024-10-30",
      description: "Comprehensive scholarship program for academically talented yet economically disadvantaged young people from Africa, with a focus on young women.",
      requirements: [
        "African citizenship",
        "Demonstrated academic excellence",
        "Financial need",
        "Leadership potential",
        "Community service involvement"
      ],
      benefits: [
        "Full tuition and fees",
        "Accommodation and meals",
        "Academic support services",
        "Leadership development programs",
        "Career guidance and mentorship"
      ],
      application_url: "https://mastercardfdn.org/scholars",
      status: "approved"
    },
    {
      id: 4,
      title: "German Academic Exchange Service (DAAD) Scholarship",
      organization: "DAAD Germany",
      field: "Engineering, Agriculture, Natural Sciences",
      level: "masters",
      amount: "€850-1,200 per month",
      location: "German Universities",
      deadline: "2024-09-30",
      description: "Study opportunities in Germany for international students from developing countries, with focus on sustainable development and innovation.",
      requirements: [
        "Bachelor's degree in relevant field",
        "Minimum 2 years work experience",
        "German or English language proficiency",
        "Strong academic record",
        "Development-oriented career goals"
      ],
      benefits: [
        "Monthly stipend €850-1,200",
        "Health insurance coverage",
        "Travel allowance",
        "Study and research allowance",
        "German language course"
      ],
      application_url: "https://daad.de/scholarships",
      status: "approved"
    },
    {
      id: 5,
      title: "World Bank Graduate Scholarship Program",
      organization: "World Bank Group",
      field: "Development Studies, Economics, Public Policy",
      level: "masters",
      amount: "Full Tuition + Expenses",
      location: "Partner Universities Worldwide",
      deadline: "2024-11-30",
      description: "Comprehensive scholarship for citizens of World Bank member countries to pursue master's degrees in development-related fields.",
      requirements: [
        "Citizenship of World Bank member country",
        "Bachelor's degree with strong academic record",
        "3+ years of development-related experience",
        "English proficiency (TOEFL/IELTS)",
        "Commitment to return to home country"
      ],
      benefits: [
        "Full tuition and fees",
        "Monthly living stipend",
        "Round-trip airfare",
        "Health insurance",
        "Annual book allowance"
      ],
      application_url: "https://worldbank.org/scholarships",
      status: "approved"
    },
    {
      id: 6,
      title: "Ethiopian Airlines Aviation Academy Scholarship",
      organization: "Ethiopian Airlines",
      field: "Aviation & Aerospace",
      level: "undergraduate",
      amount: "Full Sponsorship",
      location: "Ethiopian Aviation Academy",
      deadline: "2024-08-15",
      description: "Comprehensive aviation training program for aspiring pilots and aviation professionals. Includes theoretical and practical training with guaranteed employment upon completion.",
      requirements: [
        "Ethiopian citizenship",
        "Age between 18-28 years",
        "High school completion with science subjects",
        "Medical fitness for aviation",
        "English proficiency"
      ],
      benefits: [
        "Complete pilot training program",
        "Guaranteed employment with Ethiopian Airlines",
        "Competitive salary upon graduation",
        "International career opportunities",
        "Professional development support"
      ],
      application_url: "https://ethiopianairlines.com/careers",
      status: "approved"
    },
    {
      id: 7,
      title: "USAID Higher Education Scholarship",
      organization: "USAID Ethiopia",
      field: "Public Health, Agriculture, Education",
      level: "masters",
      amount: "$25,000 per year",
      location: "US Universities",
      deadline: "2024-12-15",
      description: "Scholarship program supporting Ethiopian professionals in critical development sectors to pursue advanced degrees in the United States.",
      requirements: [
        "Ethiopian citizenship",
        "Bachelor's degree in relevant field",
        "5+ years of professional experience",
        "TOEFL iBT 80+ or IELTS 6.5+",
        "Commitment to development work in Ethiopia"
      ],
      benefits: [
        "Full tuition coverage",
        "Monthly living allowance",
        "Health insurance",
        "Professional development opportunities",
        "Networking with development professionals"
      ],
      application_url: "https://usaid.gov/ethiopia/scholarships",
      status: "approved"
    },
    {
      id: 8,
      title: "Islamic Development Bank Scholarship",
      organization: "Islamic Development Bank",
      field: "Medicine, Engineering, Agriculture",
      level: "phd",
      amount: "Full Scholarship Package",
      location: "Top Universities in Member Countries",
      deadline: "2024-10-01",
      description: "Merit-based scholarship program for outstanding students from IDB member countries to pursue PhD studies in priority fields for Islamic world development.",
      requirements: [
        "Citizenship of IDB member country",
        "Master's degree with distinction",
        "Research proposal in priority field",
        "Language proficiency certificate",
        "Age limit: 35 years for PhD"
      ],
      benefits: [
        "Full tuition and fees coverage",
        "Monthly living allowance",
        "Annual book allowance",
        "Health insurance",
        "Conference participation funding"
      ],
      application_url: "https://isdb.org/scholarships",
      status: "approved"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using sample data for now instead of fetching from database
    setLoading(false);
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

  const handleAddScholarship = (newScholarship: any) => {
    setScholarships(prev => [newScholarship, ...prev]);
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
            <CardTitle className="text-lg text-blue-700 mb-2">
              {scholarship.title}
            </CardTitle>
            <CardDescription className="flex items-center text-gray-600 mb-2">
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
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="font-medium">Field:</span>
            <span className="ml-1">{scholarship.field}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-medium">Amount:</span>
            <span className="ml-1">{scholarship.amount}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">Location:</span>
            <span className="ml-1">{scholarship.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-red-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">Deadline:</span>
            <span className="ml-1">{new Date(scholarship.deadline).toLocaleDateString()}</span>
          </div>
          
          <p className="text-sm text-gray-700 mt-3">
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
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
              <h1 className="text-xl font-semibold">Scholarship Details</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Scholarship Details */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">
                {selectedScholarship.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {selectedScholarship.organization}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Scholarship Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <Badge variant="secondary">{selectedScholarship.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Field:</span>
                      <span>{selectedScholarship.field}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{selectedScholarship.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span>{selectedScholarship.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="text-red-600 font-medium">
                        {new Date(selectedScholarship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-700">{selectedScholarship.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedScholarship.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedScholarship.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/">
                <Button variant="ghost" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Scholarship Opportunities</h1>
              <div className="flex items-center space-x-4">
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Scholarship Opportunities
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
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
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search scholarships by title, organization, or field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
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
            <h2 className="text-2xl font-bold text-gray-900">
              Available Scholarships ({filteredScholarships.length})
            </h2>
            <p className="text-gray-600 mt-2">
              Find the perfect scholarship opportunity for your educational journey
            </p>
          </div>

          {filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                No scholarships found
              </h3>
              <p className="text-gray-400">
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