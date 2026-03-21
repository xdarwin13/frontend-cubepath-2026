'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { teacherApi, aiApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { BookOpen, Plus, Users, Sparkles, Trash2, Eye, Edit, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadCourses();
  }, [token]);

  const loadCourses = async () => {
    try {
      const data = await teacherApi.getCourses(token!);
      setCourses(data.courses);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este curso?')) return;
    try {
      await teacherApi.deleteCourse(id, token!);
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Curso eliminado');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardLayout allowedRole="teacher">
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis Cursos</h1>
            <p className="text-slate-400 mt-1">Gestiona y crea cursos con IA</p>
          </div>
          <Link href="/teacher/create" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Curso con IA
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-sm text-slate-400">Total Cursos</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.filter(c => c.status === 'published').length}</p>
                <p className="text-sm text-slate-400">Publicados</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.reduce((acc: number, c: any) => acc + (c.enrollments?.length || 0), 0)}</p>
                <p className="text-sm text-slate-400">Estudiantes Inscritos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : courses.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No tienes cursos aun</h3>
            <p className="text-slate-400 mb-6">Crea tu primer curso con inteligencia artificial</p>
            <Link href="/teacher/create" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Crear Curso con IA
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card overflow-hidden group">
                <div className="h-40 bg-gradient-to-br from-blue-700 to-blue-900 relative">
                  {course.coverImage && (
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {course.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-blue-400 mb-1">{course.category}</div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{course.modules?.length || 0} modulos</span>
                    <span>{course.enrollments?.length || 0} estudiantes</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/teacher/course/${course.id}`} className="flex-1 btn-secondary text-sm text-center flex items-center justify-center gap-1">
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                    <button onClick={() => deleteCourse(course.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
