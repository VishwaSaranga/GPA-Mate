
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Course } from '@/types/course';
import { jsPDF } from 'jspdf';
import { saveCourse, getUserCourses, deleteCourse, calculateGPA } from '@/services/gpaService';

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Course>({ name: '', grade: 'A', credits: 3 });
  const [gpa, setGpa] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const fetchCourses = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userCourses = await getUserCourses(currentUser.uid);
      setCourses(userCourses);
      setGpa(calculateGPA(userCourses));
    } catch (error) {
      toast({
        title: "Failed to load courses",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    fetchCourses();
  }, [currentUser, navigate]);
  
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to add courses",
        variant: "destructive",
      });
      return;
    }
    
    if (!newCourse.name.trim()) {
      toast({
        title: "Validation error",
        description: "Course name is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const courseId = await saveCourse(currentUser.uid, newCourse);
      const courseWithId = { ...newCourse, id: courseId };
      setCourses([...courses, courseWithId]);
      setGpa(calculateGPA([...courses, courseWithId]));
      
      setNewCourse({ name: '', grade: 'A', credits: 3 });
      
      toast({
        title: "Course added",
        description: `${newCourse.name} has been added to your courses`,
      });
    } catch (error) {
      console.error("Error adding course: ", error);
      toast({
        title: "Failed to add course",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCourse = async (id?: string) => {
    if (!id) return;
    
    try {
      await deleteCourse(id);
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      setGpa(calculateGPA(updatedCourses));
      
      toast({
        title: "Course deleted",
        description: "Course has been removed from your list",
      });
    } catch (error) {
      toast({
        title: "Failed to delete course",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('GPA Report', 105, 15, { align: 'center' });
    
    // Add user info
    doc.setFontSize(12);
    doc.text(`User: ${currentUser?.email || 'Unknown User'}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);
    doc.text(`Cumulative GPA: ${gpa}`, 20, 44);
    
    // Add table header
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    let y = 60;
    doc.text('Course', 20, y);
    doc.text('Grade', 120, y);
    doc.text('Credits', 160, y);
    
    // Add separator line
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 180, y);
    y += 10;
    
    // Add courses
    doc.setTextColor(0, 0, 0);
    courses.forEach(course => {
      doc.text(course.name, 20, y);
      doc.text(course.grade, 120, y);
      doc.text(course.credits.toString(), 160, y);
      y += 10;
    });
    
    // Save the PDF
    doc.save('gpa-report.pdf');
    
    toast({
      title: "PDF Generated",
      description: "Your GPA report has been downloaded",
    });
  };
  
  return (
    <div className="min-h-screen bg-navy p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center bg-navy-light rounded-lg p-4 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">GPA Mate</h1>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={downloadPDF}
              disabled={courses.length === 0}
              className="bg-transparent text-white border-white hover:bg-navy"
            >
              Download PDF
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GPA Display */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your GPA</CardTitle>
              <CardDescription>Based on your current courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-6xl font-bold text-gpa-blue">{gpa}</p>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                {courses.length} courses, {courses.reduce((sum, course) => sum + course.credits, 0)} total credits
              </p>
            </CardContent>
          </Card>
          
          {/* Add Course Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
              <CardDescription>Enter your course details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="course-name">Course Name</Label>
                    <Input
                      id="course-name"
                      placeholder="e.g. Mathematics"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={newCourse.grade}
                      onValueChange={(value) => setNewCourse({...newCourse, grade: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="C+">C+</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="C-">C-</SelectItem>
                        <SelectItem value="D+">D+</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="D-">D-</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="6"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gpa-blue hover:bg-blue-700">
                  Add Course
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Courses List */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Manage your course list</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-10">Loading your courses...</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No courses added yet. Add your first course above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Course</th>
                        <th className="text-left py-3 px-4 font-medium">Grade</th>
                        <th className="text-left py-3 px-4 font-medium">Credits</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{course.name}</td>
                          <td className="py-3 px-4">{course.grade}</td>
                          <td className="py-3 px-4">{course.credits}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
