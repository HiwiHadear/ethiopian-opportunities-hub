import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Bookmark, 
  Eye,
  FileText,
  Image,
  ArrowLeft,
  Home,
  Users,
  Star,
  Clock,
  BookMarked,
  ScanLine
} from 'lucide-react';

const DigitalLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for library items
  const libraryItems = [
    {
      id: 1,
      title: "Introduction to Ethiopian History",
      type: "PDF",
      pages: 248,
      category: "History",
      uploadDate: "2024-01-15",
      views: 1234,
      bookmarks: 45,
      rating: 4.8,
      thumbnail: "/placeholder-book.jpg"
    },
    {
      id: 2,
      title: "Mathematics for Engineering Students",
      type: "Scanned Document",
      pages: 342,
      category: "Mathematics",
      uploadDate: "2024-01-10",
      views: 2156,
      bookmarks: 78,
      rating: 4.9,
      thumbnail: "/placeholder-book.jpg"
    },
    {
      id: 3,
      title: "Business Management Principles",
      type: "PDF",
      pages: 156,
      category: "Business",
      uploadDate: "2024-01-08",
      views: 987,
      bookmarks: 32,
      rating: 4.6,
      thumbnail: "/placeholder-book.jpg"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', count: 156 },
    { value: 'history', label: 'History', count: 24 },
    { value: 'mathematics', label: 'Mathematics', count: 18 },
    { value: 'business', label: 'Business', count: 32 },
    { value: 'science', label: 'Science', count: 28 },
    { value: 'literature', label: 'Literature', count: 21 },
    { value: 'technology', label: 'Technology', count: 33 }
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <Home className="w-5 h-5" />
                <span>Back to Portal</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">Digital Library</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                My Library
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Digital Library
            <span className="text-purple-600"> & Learning Hub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access, scan, and read educational materials in an interactive book-like format. 
            Perfect for students, researchers, and professionals.
          </p>
          
          {/* Upload Feature Highlight */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <ScanLine className="w-5 h-5 mr-2" />
              Scan & Convert Document
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Library
            </Button>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search books, documents, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="text-sm"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </section>

        {/* Library Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <BookOpen className="w-16 h-16 text-purple-400" />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {item.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">{item.category}</Badge>
                  {item.pages} pages
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.views}
                    </span>
                    <span className="flex items-center">
                      <BookMarked className="w-4 h-4 mr-1" />
                      {item.bookmarks}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {item.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ScanLine className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">OCR Technology</h3>
            <p className="text-gray-600 text-sm">
              Convert images and PDFs into searchable, editable text using advanced OCR technology
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Reading</h3>
            <p className="text-gray-600 text-sm">
              Experience immersive reading with page-flipping animations and bookmarking features
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-gray-600 text-sm">
              Support for multiple languages including English, Amharic, and Tigrigna
            </p>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,456</div>
              <div className="text-gray-600">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45,782</div>
              <div className="text-gray-600">Pages Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8,234</div>
              <div className="text-gray-600">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">15,678</div>
              <div className="text-gray-600">Bookmarks Created</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DigitalLibrary;