import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Bookmark,
  Settings,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const BookReader = () => {
  const { bookId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

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
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Content */}
        <Card className="mb-6">
          <CardContent className="p-8" style={{ fontSize: `${zoom}%` }}>
            {currentPageContent ? (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentPageContent.title}</h1>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {currentPageContent.text.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Content for page {currentPage} is not available.</p>
              </div>
            )}
          </CardContent>
        </Card>

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