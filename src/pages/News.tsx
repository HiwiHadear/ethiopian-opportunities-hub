import React, { useState } from 'react';
import { Search, Calendar, Tag, Eye, Edit, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostNewsDialog from '@/components/PostNewsDialog';

const News = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "New Government Procurement Guidelines Released",
      date: "December 15, 2024",
      category: "Policy",
      excerpt: "The Ministry of Finance has released updated procurement guidelines affecting all government tenders..."
    },
    {
      id: 2,
      title: "Digital Transformation Initiative Launches",
      date: "December 12, 2024",
      category: "Technology",
      excerpt: "Ethiopia launches major digital transformation initiative to modernize government services..."
    },
    {
      id: 3,
      title: "Construction Sector Job Opportunities Increase",
      date: "December 10, 2024",
      category: "Jobs",
      excerpt: "Major infrastructure projects create thousands of new job opportunities in the construction sector..."
    },
    {
      id: 4,
      title: "Healthcare Equipment Tender Announcement",
      date: "December 8, 2024",
      category: "Tenders",
      excerpt: "Ministry of Health announces multi-billion birr tender for medical equipment procurement..."
    },
    {
      id: 5,
      title: "Skills Development Program Expansion",
      date: "December 5, 2024",
      category: "Education",
      excerpt: "Government expands technical and vocational education programs to meet industry demands..."
    }
  ]);

  const [editingNews, setEditingNews] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsDetailsOpen, setNewsDetailsOpen] = useState(false);

  const handleEditNews = (newsId) => {
    setEditingNews(newsId);
  };

  const handleSaveNews = (newsId, updatedNews) => {
    setNews(prev => 
      prev.map(item => 
        item.id === newsId ? { ...item, ...updatedNews } : item
      )
    );
    setEditingNews(null);
  };

  const handleAddNews = (newNews) => {
    setNews(prev => [newNews, ...prev]);
  };

  const handleViewNewsDetails = (newsItem) => {
    setSelectedNews(newsItem);
    setNewsDetailsOpen(true);
  };

  const EditableNewsCard = ({ newsItem }) => {
    const [editData, setEditData] = useState(newsItem);
    const isEditing = editingNews === newsItem.id;

    if (isEditing) {
      return (
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="space-y-3">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="News Title"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              />
              <Input
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <Input
              value={editData.excerpt}
              onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
              placeholder="News Excerpt"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSaveNews(newsItem.id, editData)}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingNews(null)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{newsItem.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{newsItem.category}</Badge>
            <Button size="sm" variant="ghost" onClick={() => handleEditNews(newsItem.id)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {newsItem.date}
          </span>
        </div>
        <p className="text-gray-600 mb-3">{newsItem.excerpt}</p>
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => handleViewNewsDetails(newsItem)}
        >
          <Eye className="w-4 h-4 mr-1" />
          Read More
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TenderJob Portal</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/tenders" className="text-gray-700 hover:text-blue-600 transition-colors">Tenders</Link>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Jobs</Link>
              <Link to="/news" className="text-blue-600 font-medium">News</Link>
              <span className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Companies</span>
            </nav>

            <div className="flex items-center space-x-4">
              <PostNewsDialog onSubmit={handleAddNews} />
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h1>
          <p className="text-gray-600">Stay updated with the latest news in government tenders, jobs, and industry updates</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Search news..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="tenders">Tenders</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* News List */}
        <div className="grid gap-6">
          {news.map((newsItem) => (
            <EditableNewsCard key={newsItem.id} newsItem={newsItem} />
          ))}
        </div>
      </div>

      {/* News Details Modal */}
      <Dialog open={newsDetailsOpen} onOpenChange={setNewsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>News Details</DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedNews.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedNews.date}
                  </span>
                  <Badge variant="secondary">{selectedNews.category}</Badge>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg leading-relaxed">
                  {selectedNews.excerpt}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Article
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  This is the full content of the news article. In a real application, 
                  this would contain the complete article text with detailed information 
                  about the topic.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Share Article
                </Button>
                <Button variant="outline">
                  Save for Later
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;
