import { GRADING_CONFIG } from './teacherConstants';

/**
 * Determine teacher's grading level based on their role
 * 
 * @param {string} userRole - User's role from auth context
 * @returns {string} - 'K12' or 'COLLEGE'
 */
export const getTeacherLevel = (userRole) => {
  const role = userRole?.toLowerCase() || '';
  if (role.includes('elementary') || role.includes('highschool')) return 'K12';
  if (role.includes('college')) return 'COLLEGE';
  return 'K12'; // Default to K12
};

/**
 * Calculate final grade based on teacher level and component scores
 * Handles both K12 (weighted percentage) and COLLEGE (GPA) systems
 * 
 * @param {Object} student - Student object with grade components
 * @param {string} teacherLevel - 'K12' or 'COLLEGE'
 * @returns {number|string} - Calculated final grade
 */
export const calculateFinalGrade = (student, teacherLevel) => {
  const config = GRADING_CONFIG[teacherLevel];
  
  if (teacherLevel === 'K12') {
    const total = 
      (parseFloat(student.written) || 0) * 0.30 +
      (parseFloat(student.performance) || 0) * 0.50 +
      (parseFloat(student.exam) || 0) * 0.20;
    return Math.round(total);
  } else if (teacherLevel === 'COLLEGE') {
    const avg = 
      (parseFloat(student.prelim) || 0 + 
       parseFloat(student.midterm) || 0 + 
       parseFloat(student.finals) || 0) / 3;
    return parseFloat(avg.toFixed(2));
  }
  
  return 0;
};

/**
 * Determine pass/fail status based on final grade and teacher level
 * K12: 75+ = Pass
 * COLLEGE: 3.0 or below (inverted GPA) = Pass
 * 
 * @param {number} grade - Final grade
 * @param {string} teacherLevel - 'K12' or 'COLLEGE'
 * @returns {string} - 'Passed' or 'Failed'
 */
export const getGradeStatus = (grade, teacherLevel) => {
  if (teacherLevel === 'K12') {
    return grade >= 75 ? 'Passed' : 'Failed';
  } else {
    // COLLEGE: Lower GPA is better (inverted scale)
    return grade <= 3.0 && grade > 0 ? 'Passed' : 'Failed';
  }
};

/**
 * Get grading categories for the current system
 * Useful for rendering grade input fields dynamically
 * 
 * @param {string} teacherLevel - 'K12' or 'COLLEGE'
 * @returns {Array<Object>} - Array of category objects with key, label, weight
 */
export const getGradingCategories = (teacherLevel) => {
  return GRADING_CONFIG[teacherLevel]?.categories || [];
};

/**
 * Validate a grade value for a specific teacher level
 * K12: 0-100 (percentage)
 * COLLEGE: 0-4.0 (GPA)
 * 
 * @param {number} grade - Grade value to validate
 * @param {string} teacherLevel - 'K12' or 'COLLEGE'
 * @returns {boolean} - Whether the grade is valid
 */
export const isValidGrade = (grade, teacherLevel) => {
  const numGrade = parseFloat(grade);
  if (isNaN(numGrade)) return false;
  
  if (teacherLevel === 'K12') {
    return numGrade >= 0 && numGrade <= 100;
  } else if (teacherLevel === 'COLLEGE') {
    return numGrade >= 0 && numGrade <= 4.0;
  }
  return false;
};

/**
 * Prepare grades payload for API submission
 * Standardizes the data format sent to backend
 * 
 * @param {Array} students - Array of student objects with updated grades
 * @param {string} classId - Class ID
 * @param {string} teacherLevel - 'K12' or 'COLLEGE'
 * @returns {Object} - Formatted payload for API
 */
export const prepareGradesPayload = (students, classId, teacherLevel) => {
  return {
    class_id: classId,
    teacher_level: teacherLevel,
    students: students.map(s => ({
      ...s,
      final_grade: calculateFinalGrade(s, teacherLevel),
      remarks: getGradeStatus(calculateFinalGrade(s, teacherLevel), teacherLevel),
    })),
  };
};

/**
 * Get placeholder dummy data when API is offline
 * Allows UI to remain functional even without network
 * 
 * @param {string} teacherLevel - 'K12' or 'COLLEGE'
 * @returns {Array} - Array of dummy student records
 */
export const getDummyStudentData = (teacherLevel) => {
  if (teacherLevel === 'K12') {
    return [
      { id: 101, student_id: 'S-2024-001', name: 'Juan Dela Cruz', written: 0, performance: 0, exam: 0 },
      { id: 102, student_id: 'S-2024-002', name: 'Maria Clara', written: 0, performance: 0, exam: 0 },
    ];
  } else {
    return [
      { id: 201, student_id: 'C-2024-001', name: 'Jose Rizal', prelim: 0, midterm: 0, finals: 0 },
    ];
  }
};