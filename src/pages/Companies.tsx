
import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Users, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostCompanyDialog from '@/components/PostCompanyDialog';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

const Companies = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || 
      company.industry.toLowerCase().includes(industryFilter.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || 
      company.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  const handleViewCompanyDetails = (company: any) => {
    setSelectedCompany(company);
    setCompanyDetailsOpen(true);
  };

  const handleAddCompany = async () => {
    await fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c6863b9a-31ae-4e2f-87a6-19b9386abbdf.png" 
                alt="Geza Shekalo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-foreground">Geza Shekalo</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/tenders" className="text-muted-foreground hover:text-primary transition-colors">Tenders</Link>
              <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Jobs</Link>
              <Link to="/scholarships" className="text-muted-foreground hover:text-primary transition-colors">Scholarships</Link>
              <Link to="/companies" className="text-primary font-medium">Companies</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user && isAdmin && (
                <>
                  <PostCompanyDialog onSubmit={handleAddCompany} />
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

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Companies Directory</h1>
          <p className="text-muted-foreground">Discover leading companies and organizations across Ethiopia</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search companies..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="aviation">Aviation</SelectItem>
                  <SelectItem value="banking">Banking & Finance</SelectItem>
                  <SelectItem value="telecommunications">Telecommunications</SelectItem>
                  <SelectItem value="energy">Energy & Utilities</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="addis ababa">Addis Ababa</SelectItem>
                  <SelectItem value="dire dawa">Dire Dawa</SelectItem>
                  <SelectItem value="mekelle">Mekelle</SelectItem>
                  <SelectItem value="bahir dar">Bahir Dar</SelectItem>
                  <SelectItem value="debre birhan">Debre Birhan</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground/70">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-card rounded-lg flex items-center justify-center overflow-hidden border border-border">
                          {company.logo_url ? (
                            <img 
                              src={company.logo_url} 
                              alt={`${company.name} logo`}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {company.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Badge variant="secondary">{company.industry}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {company.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {company.size} employees
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleViewCompanyDetails(company)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {company.website && (
                          <Button 
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(company.website, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        )}
      </div>

      {/* Company Details Modal */}
      <Dialog open={companyDetailsOpen} onOpenChange={setCompanyDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-card rounded-lg flex items-center justify-center overflow-hidden border border-border">
                  {selectedCompany.logo_url ? (
                    <img 
                      src={selectedCompany.logo_url} 
                      alt={`${selectedCompany.name} logo`}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedCompany.name}
                  </h3>
                  <p className="text-muted-foreground">{selectedCompany.industry}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedCompany.location}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">About</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedCompany.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Company Size</h4>
                  <p className="text-muted-foreground">{selectedCompany.size} employees</p>
                </div>
                {selectedCompany.website && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Website</h4>
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Link to="/jobs">
                  <Button>
                    View Jobs
                  </Button>
                </Link>
                <Link to="/tenders">
                  <Button variant="outline">
                    View Tenders
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
