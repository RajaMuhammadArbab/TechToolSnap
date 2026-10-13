'use client';
import { useState } from 'react';
import { Plus, Trash2, GraduationCap, Award } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Course 1', grade: 'A', credits: 3 },
    { id: '2', name: 'Course 2', grade: 'A-', credits: 3 },
    { id: '3', name: 'Course 3', grade: 'B+', credits: 4 },
    { id: '4', name: 'Course 4', grade: 'A', credits: 3 },
  ]);

  const [prevGpa, setPrevGpa] = useState<string>('');
  const [prevCredits, setPrevCredits] = useState<string>('');

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: `Course ${prev.length + 1}`,
        grade: 'A',
        credits: 3
      }
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  // Calculations
  let semesterPoints = 0;
  let semesterCredits = 0;
  courses.forEach(c => {
    const pts = GRADE_POINTS[c.grade] ?? 0;
    semesterPoints += pts * c.credits;
    semesterCredits += c.credits;
  });

  const semesterGpa = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';

  // Cumulative CGPA
  const pGpa = parseFloat(prevGpa);
  const pCredits = parseFloat(prevCredits);
  let cumulativeGpa: string | null = null;
  let totalCumulativeCredits = semesterCredits;

  if (!isNaN(pGpa) && !isNaN(pCredits) && pCredits > 0) {
    totalCumulativeCredits = semesterCredits + pCredits;
    const totalPoints = (pGpa * pCredits) + semesterPoints;
    cumulativeGpa = (totalPoints / totalCumulativeCredits).toFixed(2);
  }

  const getStanding = (gpaNum: number) => {
    if (gpaNum >= 3.8) return { label: 'Summa Cum Laude (High Distinction)', color: 'text-emerald-500' };
    if (gpaNum >= 3.5) return { label: 'Magna Cum Laude (Distinction)', color: 'text-indigo-500' };
    if (gpaNum >= 3.0) return { label: 'Cum Laude (Good Standing)', color: 'text-blue-500' };
    if (gpaNum >= 2.0) return { label: 'Satisfactory Academic Standing', color: 'text-amber-500' };
    return { label: 'Academic Warning', color: 'text-rose-500' };
  };

  const standing = getStanding(parseFloat(cumulativeGpa || semesterGpa));

  return (
    <div className="space-y-8">
      {/* GPA Score Hero Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Semester GPA
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white my-2">
            {semesterGpa}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total Credits: {semesterCredits}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cumulative CGPA
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white my-2">
            {cumulativeGpa ? cumulativeGpa : semesterGpa}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium mt-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span className={standing.color}>{standing.label}</span>
          </div>
        </div>
      </div>

      {/* Courses Table / Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            Semester Courses
          </h3>
          <button
            onClick={addCourse}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div key={course.id} className="grid grid-cols-12 gap-2 sm:gap-3 items-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="col-span-5 sm:col-span-6">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder={`Course ${idx + 1}`}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="col-span-3 sm:col-span-3">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  className="w-full px-2 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>
                      {g} ({GRADE_POINTS[g].toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3 sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="col-span-1 text-center">
                <button
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1}
                  title="Remove course"
                  className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Prior CGPA */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
          Optional: Include Previous Semesters for Cumulative CGPA
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Previous Cumulative GPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              placeholder="e.g. 3.45"
              value={prevGpa}
              onChange={(e) => setPrevGpa(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Previous Total Credits</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={prevCredits}
              onChange={(e) => setPrevCredits(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
