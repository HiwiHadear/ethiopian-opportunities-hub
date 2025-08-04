import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostScholarshipDialog } from "@/components/PostScholarshipDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";

interface Scholarship {
  id: string;
  title: string;
  organization: string;
  level: string;
  field: string;
  amount: string;
  deadline: string;
  location: string;
  application_url: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: string;
  created_at: string;
}

export const ScholarshipManagement = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
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

  const updateScholarshipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("scholarships")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setScholarships(prev =>
        prev.map(scholarship =>
          scholarship.id === id ? { ...scholarship, status } : scholarship
        )
      );

      toast({
        title: "Success",
        description: `Scholarship ${status} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update scholarship status",
        variant: "destructive",
      });
    }
  };

  const deleteScholarship = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;

    try {
      const { error } = await supabase
        .from("scholarships")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setScholarships(prev => prev.filter(scholarship => scholarship.id !== id));
      toast({
        title: "Success",
        description: "Scholarship deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete scholarship",
        variant: "destructive",
      });
    }
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || scholarship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-6">Loading scholarships...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scholarship Management</h2>
          <p className="text-gray-600">Manage scholarship listings</p>
        </div>
        <PostScholarshipDialog onScholarshipCreated={fetchScholarships}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Scholarship
          </Button>
        </PostScholarshipDialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scholarships List */}
      <div className="grid gap-4">
        {filteredScholarships.map((scholarship) => (
          <Card key={scholarship.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                  <CardDescription>{scholarship.organization}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    scholarship.status === 'approved' ? 'default' : 
                    scholarship.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {scholarship.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Level:</span>
                  <p className="font-medium">{scholarship.level}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Amount:</span>
                  <p className="font-medium">{scholarship.amount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Deadline:</span>
                  <p className="font-medium">{new Date(scholarship.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Select onValueChange={(status) => updateScholarshipStatus(scholarship.id, status)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(scholarship.application_url, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Application
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingScholarship(scholarship)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteScholarship(scholarship.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No scholarships found</p>
        </div>
      )}
    </div>
  );
};