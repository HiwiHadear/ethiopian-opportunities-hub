import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Settings,
  ZoomIn,
  ZoomOut,
  Palette,
  Type,
  Sun,
  Moon,
  Highlighter,
  Eraser,
  Plus,
  Trash2
} from 'lucide-react';

const BookReader = () => {
  const { bookId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Reading customization settings
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [fontFamily, setFontFamily] = useState('serif');
  const [textColor, setTextColor] = useState('#374151');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [theme, setTheme] = useState('light');

  // Bookmarks and highlights state
  const [bookmarks, setBookmarks] = useState<{[key: string]: {page: number, title: string, timestamp: string}}>({});
  const [highlights, setHighlights] = useState<{[key: string]: {text: string, color: string, page: number, id: string}}>({});
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  const [selectedText, setSelectedText] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  // Highlight colors
  const highlightColors = ['#FFFF00', '#FFB6C1', '#90EE90', '#87CEEB', '#DDA0DD', '#F0E68C'];

  // Predefined color schemes
  const colorSchemes = {
    light: { text: '#374151', bg: '#ffffff' },
    sepia: { text: '#8B4513', bg: '#FDF6E3' },
    dark: { text: '#E5E7EB', bg: '#1F2937' },
    night: { text: '#60A5FA', bg: '#0F172A' }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const scheme = colorSchemes[newTheme as keyof typeof colorSchemes];
    setTextColor(scheme.text);
    setBackgroundColor(scheme.bg);
  };

  // Sample book data with actual content
  const sampleBooks = {
    '1': {
      title: "A Brief History of Ethiopia",
      author: "Dr. Bahru Zewde",
      totalPages: 248,
      content: {
        1: {
          title: "Chapter 1: Ancient Origins",
          text: `Ethiopia, known in ancient times as Abyssinia, has one of the world's oldest recorded histories. The kingdom's origins trace back to the ancient Kingdom of Aksum, which flourished from approximately 100 to 940 CE.

The Aksumite Empire was a major naval and trading power, controlling the Red Sea trade routes between the Roman Empire and Ancient India. The empire's wealth came from its strategic location and its control over the trade in gold, ivory, and exotic animals.

One of the most significant developments in Ethiopian history was the adoption of Christianity in the 4th century CE under King Ezana. This made Ethiopia one of the first nations to officially adopt Christianity as a state religion.

The famous rock-hewn churches of Lalibela, carved directly into the mountainous terrain, stand as testament to the deep Christian faith that has shaped Ethiopian culture for over 1,600 years.`
        },
        2: {
          title: "Chapter 2: Medieval Period",
          text: `The medieval period in Ethiopian history was marked by the rise of the Zagwe dynasty and later the Solomonic dynasty, which claimed descent from the biblical King Solomon and the Queen of Sheba.

During this period, Ethiopia developed a unique form of Christianity that incorporated many local traditions and customs. The Ethiopian Orthodox Tewahedo Church became central to the identity of the Ethiopian people.

The construction of numerous churches and monasteries during this time created a rich architectural heritage that continues to influence Ethiopian culture today. The tradition of manuscript illumination also flourished, producing some of the world's most beautiful religious texts.

Trade relationships with the Arab world, despite religious differences, continued to bring prosperity to the Ethiopian highlands, while the lowland regions maintained their own distinct cultural traditions.`
        }
      }
    },
    '2': {
      title: "Advanced Engineering Mathematics",
      author: "Erwin Kreyszig",
      totalPages: 342,
      content: {
        1: {
          title: "Chapter 1: First-Order Differential Equations",
          text: `Differential equations are fundamental to engineering and applied mathematics. A first-order differential equation contains only the first derivative of the unknown function.

The general form of a first-order differential equation is:
dy/dx = f(x, y)

These equations appear frequently in engineering applications such as:
- Population growth models
- Radioactive decay
- Newton's law of cooling
- Electric circuits with resistors and capacitors

Solution methods include:
1. Separation of variables
2. Linear first-order equations
3. Exact equations
4. Substitution methods

Example: The equation dy/dx = 2xy represents exponential growth where the rate of change is proportional to both the current value and an external factor.`
        },
        2: {
          title: "Chapter 2: Linear Algebra Applications",
          text: `Linear algebra provides the foundation for understanding multidimensional problems in engineering. Matrices and vectors are essential tools for representing complex systems.

Key concepts include:
- Vector spaces and linear transformations
- Eigenvalues and eigenvectors
- Matrix operations and determinants
- Systems of linear equations

Engineering applications:
- Structural analysis of buildings and bridges
- Signal processing and digital filters
- Control systems design
- Computer graphics and 3D modeling

The power of linear algebra lies in its ability to simplify complex multidimensional problems into manageable computational tasks.`
        }
      }
    },
    '4': {
      title: "Introduction to Computer Science",
      author: "Thomas H. Cormen",
      totalPages: 425,
      content: {
        1: {
          title: "Chapter 1: Algorithms and Data Structures",
          text: `Computer science is fundamentally about problem-solving through algorithmic thinking. An algorithm is a step-by-step procedure for solving a problem or completing a task.

Key principles of algorithm design:
1. Correctness - The algorithm must produce the correct output
2. Efficiency - The algorithm should use resources optimally
3. Clarity - The algorithm should be understandable

Data structures are ways of organizing and storing data to enable efficient access and modification. Common data structures include:
- Arrays and lists
- Stacks and queues
- Trees and graphs
- Hash tables

The choice of data structure significantly impacts the efficiency of algorithms that operate on the data.`
        },
        2: {
          title: "Chapter 2: Computational Complexity",
          text: `Computational complexity theory focuses on classifying computational problems according to their resource usage and relating these classes to each other.

Big O notation is used to describe the upper bound of the time complexity of an algorithm:
- O(1) - Constant time
- O(log n) - Logarithmic time
- O(n) - Linear time
- O(n²) - Quadratic time
- O(2^n) - Exponential time

Understanding complexity helps developers choose appropriate algorithms for different problem sizes and constraints. It's crucial for building scalable software systems.

Example: A binary search algorithm has O(log n) complexity, making it much more efficient than linear search O(n) for large datasets.`
        }
      }
    }
  };

  const currentBook = sampleBooks[bookId as keyof typeof sampleBooks];
  const currentPageContent = currentBook?.content[currentPage as keyof typeof currentBook.content];

  const nextPage = () => {
    if (currentBook && currentPage < currentBook.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  // Bookmark functions
  const addBookmark = () => {
    const bookmarkId = `${bookId}-${currentPage}`;
    const newBookmark = {
      page: currentPage,
      title: currentPageContent?.title || `Page ${currentPage}`,
      timestamp: new Date().toLocaleString()
    };
    setBookmarks(prev => ({ ...prev, [bookmarkId]: newBookmark }));
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => {
      const updated = { ...prev };
      delete updated[bookmarkId];
      return updated;
    });
  };

  const isBookmarked = () => {
    return bookmarks[`${bookId}-${currentPage}`] !== undefined;
  };

  // Highlight functions
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      if (highlightMode) {
        addHighlight(selection.toString().trim());
        selection.removeAllRanges();
      }
    }
  };

  const addHighlight = (text: string) => {
    const highlightId = `${bookId}-${currentPage}-${Date.now()}`;
    const newHighlight = {
      text,
      color: highlightColor,
      page: currentPage,
      id: highlightId
    };
    setHighlights(prev => ({ ...prev, [highlightId]: newHighlight }));
  };

  const removeHighlight = (highlightId: string) => {
    setHighlights(prev => {
      const updated = { ...prev };
      delete updated[highlightId];
      return updated;
    });
  };

  const renderTextWithHighlights = (text: string) => {
    let highlightedText = text;
    const pageHighlights = Object.values(highlights).filter(h => h.page === currentPage);
    
    pageHighlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, 
        `<mark style="background-color: ${highlight.color}; cursor: pointer;" data-highlight-id="${highlight.id}">$1</mark>`
      );
    });
    
    return highlightedText;
  };

  if (!currentBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-4">The requested book could not be found.</p>
          <Link to="/library">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/library" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Library</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <div>
                  <span className="text-lg font-semibold text-gray-900">{currentBook.title}</span>
                  <p className="text-sm text-gray-500">by {currentBook.author}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addBookmark}
                className={isBookmarked() ? 'bg-primary text-primary-foreground' : ''}
              >
                {isBookmarked() ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              
              <Button 
                variant={highlightMode ? "default" : "outline"} 
                size="sm"
                onClick={() => setHighlightMode(!highlightMode)}
              >
                <Highlighter className="w-4 h-4" />
              </Button>
              
              {/* Reading Settings Dialog */}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Reading Settings
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color Theme
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(colorSchemes).map(([key, scheme]) => (
                          <Button
                            key={key}
                            variant={theme === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleThemeChange(key)}
                            className="justify-start"
                            style={{
                              backgroundColor: theme === key ? undefined : scheme.bg,
                              color: theme === key ? undefined : scheme.text,
                              borderColor: scheme.text + '40'
                            }}
                          >
                            {key === 'light' && <Sun className="w-4 h-4 mr-2" />}
                            {key === 'dark' && <Moon className="w-4 h-4 mr-2" />}
                            {key === 'sepia' && <div className="w-4 h-4 mr-2 rounded-full bg-amber-200" />}
                            {key === 'night' && <div className="w-4 h-4 mr-2 rounded-full bg-blue-900" />}
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Font Settings */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Font Family
                      </Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serif">Serif (Times)</SelectItem>
                          <SelectItem value="sans-serif">Sans-serif (Arial)</SelectItem>
                          <SelectItem value="monospace">Monospace (Code)</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Palatino">Palatino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-3">
                      <Label>Font Size: {fontSize}px</Label>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        max={24}
                        min={12}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Line Height */}
                    <div className="space-y-3">
                      <Label>Line Height: {lineHeight.toFixed(1)}</Label>
                      <Slider
                        value={[lineHeight]}
                        onValueChange={(value) => setLineHeight(value[0])}
                        max={2.5}
                        min={1.2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {/* Custom Colors */}
                    <div className="space-y-3">
                      <Label>Custom Colors</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Text Color</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-8 h-8 rounded border"
                            />
                            <span className="text-xs text-gray-500">{textColor}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Background</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-8 h-8 rounded border"
                            />
                            <span className="text-xs text-gray-500">{backgroundColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => setSettingsOpen(false)} className="w-full">
                        Apply Settings
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Highlight Controls */}
        {highlightMode && (
          <Card className="mb-4 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">Highlight Mode Active</span>
                  <div className="flex space-x-2">
                    {highlightColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setHighlightColor(color)}
                        className={`w-6 h-6 rounded border-2 ${highlightColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setHighlightMode(false)}>
                  Exit Highlight Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Book Content */}
        <Card className="mb-6" style={{ backgroundColor: backgroundColor }}>
          <CardContent 
            className="p-8" 
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily: fontFamily,
              color: textColor,
              backgroundColor: backgroundColor
            }}
            onMouseUp={handleTextSelection}
          >
            {currentPageContent ? (
              <div>
                <h1 className="text-3xl font-bold mb-6" style={{ color: textColor }}>
                  {currentPageContent.title}
                </h1>
                <div className="prose prose-lg max-w-none leading-relaxed">
                  {currentPageContent.text.split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="mb-4" 
                      style={{ color: textColor }}
                      dangerouslySetInnerHTML={{ __html: renderTextWithHighlights(paragraph) }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.tagName === 'MARK') {
                          const highlightId = target.getAttribute('data-highlight-id');
                          if (highlightId && !highlightMode) {
                            removeHighlight(highlightId);
                          }
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p style={{ color: textColor, opacity: 0.7 }}>
                  Content for page {currentPage} is not available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookmarks and Highlights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Bookmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Bookmarks ({Object.keys(bookmarks).length})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookmarks(!showBookmarks)}
                >
                  {showBookmarks ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showBookmarks && (
              <CardContent>
                {Object.keys(bookmarks).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No bookmarks yet</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(bookmarks).map(([id, bookmark]) => (
                      <div key={id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setCurrentPage(bookmark.page)}
                        >
                          <p className="font-medium text-sm">{bookmark.title}</p>
                          <p className="text-xs text-muted-foreground">Page {bookmark.page} • {bookmark.timestamp}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBookmark(id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Highlighter className="w-5 h-5" />
                  Highlights ({Object.keys(highlights).length})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHighlights(!showHighlights)}
                >
                  {showHighlights ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showHighlights && (
              <CardContent>
                {Object.keys(highlights).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No highlights yet</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(highlights).map(([id, highlight]) => (
                      <div key={id} className="flex items-start justify-between p-2 bg-muted rounded">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setCurrentPage(highlight.page)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: highlight.color }}
                            />
                            <span className="text-xs text-muted-foreground">Page {highlight.page}</span>
                          </div>
                          <p className="text-sm">{highlight.text.substring(0, 100)}...</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHighlight(id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {currentBook.totalPages}
            </span>
          </div>

          <Button 
            variant="outline" 
            onClick={nextPage}
            disabled={!currentPageContent || currentPage >= Object.keys(currentBook.content).length}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Page Progress */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentPage / currentBook.totalPages) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;