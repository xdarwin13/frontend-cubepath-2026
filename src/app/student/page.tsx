'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { studentApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { BookOpen, Search, Loader2, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (token) loadCourses();
  }, [token]);

  const loadCourses = async () => {
    try {
      const data = await studentApi.getCourses(token!);
      setCourses(data.courses);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRole="student">
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Explorar Cursos</h1>
            <p className="text-slate-400 mt-1">Descubre cursos creados con inteligencia artificial</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field py-3"
            style={{ paddingLeft: '3rem' }}
            placeholder="Buscar cursos por titulo o descripcion..."
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No hay cursos disponibles</h3>
            <p className="text-slate-400">Los profesores estan creando contenido. Vuelve pronto!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Link key={course.id} href={`/student/course/${course.id}`} className="card overflow-hidden group cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-teal-700 to-teal-900 relative">
                  {course.coverImage && (
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-600/80 text-white">{course.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.teacher?.name || 'Profesor'}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.modules?.length || 0} modulos
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
