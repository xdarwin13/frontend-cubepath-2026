'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { studentApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { BookOpen, Loader2, BarChart3, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyCoursesPage() {
  const { token } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadEnrollments();
  }, [token]);

  const loadEnrollments = async () => {
    try {
      const data = await studentApi.getMyCourses(token!);
      setEnrollments(data.enrollments);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole="student">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mis Cursos</h1>
        <p className="text-slate-400 mb-8">Cursos en los que estas inscrito</p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : enrollments.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No tienes cursos inscritos</h3>
            <p className="text-slate-400 mb-6">Explora el catalogo y encuentra tu primer curso</p>
            <Link href="/student" className="btn-primary inline-flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="card overflow-hidden group">
                <Link href={`/student/course/${enrollment.course?.id}`} className="cursor-pointer">
                  <div className="h-36 bg-gradient-to-br from-teal-700 to-teal-900 relative">
                    {enrollment.course?.coverImage && (
                      <img src={enrollment.course.coverImage} alt="" className="w-full h-full object-cover" />
                    )}
                    {enrollment.progress >= 100 && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Award className="w-3 h-3" />
                        Completado
                      </div>
                    )}
                  </div>
                  <div className="p-5 pb-3">
                    <h3 className="font-bold mb-2 group-hover:text-blue-400 transition-colors">{enrollment.course?.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{enrollment.course?.teacher?.name || 'Profesor'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all" style={{ width: `${enrollment.progress || 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{Math.round(enrollment.progress || 0)}%</span>
                    </div>
                  </div>
                </Link>
                {enrollment.progress >= 100 && (
                  <div className="px-5 pb-5">
                    <Link
                      href={`/student/certificate/${enrollment.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
                    >
                      <Award className="w-4 h-4" />
                      Ver Certificado
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
