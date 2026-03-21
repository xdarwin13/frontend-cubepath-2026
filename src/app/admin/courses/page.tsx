'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { BookOpen, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadCourses();
  }, [token]);

  const loadCourses = async () => {
    try {
      const data = await adminApi.getCourses(token!);
      setCourses(data.courses);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Cursos</h1>
        <p className="text-slate-400 mb-8">Todos los cursos de la plataforma</p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Curso</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Profesor</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Categoria</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Estado</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Inscritos</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{course.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{course.teacher?.name || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">{course.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${course.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {course.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-sm text-slate-400">
                        <Users className="w-3 h-3" />
                        {course.enrollments?.length || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
