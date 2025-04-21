
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Course } from '@/types/course';

export async function saveCourse(userId: string, course: Course): Promise<string> {
  try {
    // Check if userId is available
    if (!userId) {
      console.error("No user ID provided when saving course");
      throw new Error("User authentication required");
    }

    console.log("Saving course for user:", userId, course);
    
    const docRef = await addDoc(collection(db, "courses"), {
      ...course,
      userId: userId
    });
    
    console.log("Course saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving course: ", error);
    throw error;
  }
}

export async function getUserCourses(userId: string): Promise<Course[]> {
  try {
    const coursesQuery = query(collection(db, "courses"), where("userId", "==", userId));
    const querySnapshot = await getDocs(coursesQuery);
    
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id,
        name: data.name,
        grade: data.grade,
        credits: data.credits
      });
    });
    
    return courses;
  } catch (error) {
    console.error("Error getting courses: ", error);
    throw error;
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "courses", courseId));
    console.log("Course deleted: ", courseId);
  } catch (error) {
    console.error("Error deleting course: ", error);
    throw error;
  }
}

export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
  try {
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, courseData);
    console.log("Course updated: ", courseId);
  } catch (error) {
    console.error("Error updating course: ", error);
    throw error;
  }
}

export function calculateGPA(courses: Course[]): number {
  if (courses.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  courses.forEach(course => {
    const gradePoints = getGradePoints(course.grade);
    totalPoints += gradePoints * course.credits;
    totalCredits += course.credits;
  });
  
  return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
}

function getGradePoints(grade: string): number {
  const gradeMap: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };
  
  return gradeMap[grade] !== undefined ? gradeMap[grade] : 0;
}
