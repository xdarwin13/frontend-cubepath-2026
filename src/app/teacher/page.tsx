'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { teacherApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Users, Sparkles, Trash2, Eye, Edit, Loader2, TrendingUp } from 'lucide-react';
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

  const statCards = [
    { label: 'Total Cursos', value: courses.length, icon: BookOpen, color: 'from-[#3b82f6] to-[#6366f1]', glow: 'rgba(59,130,246,0.15)' },
    { label: 'Publicados', value: courses.filter(c => c.status === 'published').length, icon: Eye, color: 'from-[#10b981] to-[#059669]', glow: 'rgba(16,185,129,0.15)' },
    { label: 'Estudiantes', value: courses.reduce((acc: number, c: any) => acc + (c.enrollments?.length || 0), 0), icon: Users, color: 'from-[#06b6d4] to-[#0ea5e9]', glow: 'rgba(6,182,212,0.15)' },
  ];

  return (
    <DashboardLayout allowedRole="teacher">
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Mis Cursos</h1>
            <p className="text-slate-400 mt-1">Gestiona y crea cursos con IA</p>
          </div>
          <Link href="/teacher/create">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gradient-glow flex items-center gap-2 px-6 py-3"
            >
              <Sparkles className="w-5 h-5" />
              Crear Curso con IA
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`} style={{ boxShadow: `0 0 25px ${card.glow}` }}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-slate-400">{card.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Course List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#38bdf8]/20 border-t-[#38bdf8] rounded-full animate-spin" />
            </div>
          </div>
        ) : courses.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#3b82f6]/10 to-[#818cf8]/10 flex items-center justify-center border border-[#3b82f6]/20">
              <Sparkles className="w-10 h-10 text-[#38bdf8]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tienes cursos aún</h3>
            <p className="text-slate-400 mb-6">Crea tu primer curso con inteligencia artificial</p>
            <Link href="/teacher/create">
              <motion.div whileHover={{ scale: 1.05 }} className="btn-gradient-glow inline-flex items-center gap-2 px-8 py-3">
                <Sparkles className="w-5 h-5" />
                Crear Curso con IA
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card overflow-hidden group"
              >
                <div className="h-40 bg-gradient-to-br from-[#1e3a5f] to-[#0a1128] relative overflow-hidden">
                  {course.coverImage && (
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a18] to-transparent opacity-60" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      course.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    }`}>
                      {course.status === 'published' ? '✓ Publicado' : '◦ Borrador'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-[#38bdf8] mb-1 font-medium">{course.category}</div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#38bdf8] transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.modules?.length || 0} módulos</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrollments?.length || 0} estudiantes</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/teacher/course/${course.id}`} className="flex-1">
                      <motion.div whileHover={{ scale: 1.02 }} className="btn-secondary text-sm text-center flex items-center justify-center gap-1 w-full">
                        <Edit className="w-4 h-4" /> Editar
                      </motion.div>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteCourse(course.id)}
                      className="p-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
