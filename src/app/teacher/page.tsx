'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { teacherApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Users, Sparkles, Trash2, Eye, Edit, Loader2, TrendingUp, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOnboardingTour } from '@/lib/useOnboardingTour';

const TEACHER_TOUR_STEPS = [
  {
    popover: {
      title: '👋 ¡Hola, Profesor!',
      description: '<p>Bienvenido a <strong>EduCubeIA</strong>, tu plataforma para crear cursos potenciados con inteligencia artificial.</p><p style="margin-top:8px;opacity:0.7;font-size:13px">Este tour dura menos de 1 minuto. Puedes cerrarlo y repetirlo cuando quieras.</p>',
    },
  },
  {
    element: '#create-course-btn',
    popover: {
      title: '✨ Tu herramienta principal',
      description: '<p>Con un solo clic, nuestra <strong>IA genera la estructura completa</strong> de tu curso:</p><ul style="margin:8px 0 0 16px;list-style:disc;opacity:0.85;font-size:13px"><li>Módulos y lecciones organizadas</li><li>Contenido educativo adaptado</li><li>Evaluaciones sugeridas</li></ul>',
      side: 'bottom' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#teacher-stats',
    popover: {
      title: '📊 Panel de métricas',
      description: '<p>Monitorea tu impacto de un vistazo:</p><ul style="margin:8px 0 0 16px;list-style:disc;opacity:0.85;font-size:13px"><li><strong>Total Cursos</strong> — todos los que has creado</li><li><strong>Publicados</strong> — visibles para estudiantes</li><li><strong>Estudiantes</strong> — inscritos en tus cursos</li></ul>',
      side: 'bottom' as const,
    },
  },
  {
    element: '#sidebar-main-section',
    popover: {
      title: '🧭 Navegación rápida',
      description: '<p>Desde el menú lateral accedes a todo:</p><ul style="margin:8px 0 0 16px;list-style:disc;opacity:0.85;font-size:13px"><li><strong>Mis Cursos</strong> — gestiona los existentes</li><li><strong>Crear Curso</strong> — genera nuevos con IA</li></ul><p style="margin-top:8px;opacity:0.7;font-size:12px">En móvil, abre el menú con el ícono ☰</p>',
      side: 'right' as const,
    },
  },
  {
    element: '#course-list-section',
    popover: {
      title: '📚 Tus cursos en acción',
      description: '<p>Cada tarjeta de curso te permite:</p><ul style="margin:8px 0 0 16px;list-style:disc;opacity:0.85;font-size:13px"><li><strong>Editar</strong> — modificar contenido y módulos</li><li><strong>Publicar</strong> — hacerlo visible a estudiantes</li><li><strong>Eliminar</strong> — si ya no lo necesitas</li></ul>',
      side: 'top' as const,
    },
  },
  {
    popover: {
      title: '🚀 ¡Todo listo!',
      description: '<p>Ya conoces las herramientas principales. <strong>Crea tu primer curso con IA</strong> y transforma la educación.</p><p style="margin-top:10px;padding:8px 12px;background:rgba(56,189,248,0.08);border-radius:8px;border-left:3px solid #38bdf8;font-size:13px">💡 <strong>Tip:</strong> Pulsa el botón <strong>?</strong> en cualquier momento para repetir este tour.</p>',
    },
  },
];

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { startTour } = useOnboardingTour({
    tourId: 'teacher_dashboard',
    steps: TEACHER_TOUR_STEPS,
    delay: 1200,
  });

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
            <h1 className="text-2xl sm:text-3xl font-bold">Mis Cursos</h1>
            <p className="text-slate-400 mt-1">Gestiona y crea cursos con IA</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => startTour()}
              className="p-2.5 rounded-xl border border-slate-700/50 text-slate-400 hover:text-[#38bdf8] hover:border-[#38bdf8]/30 hover:bg-[#38bdf8]/5 transition-all"
              title="Ver tour de ayuda"
              id="help-tour-btn"
            >
              <HelpCircle className="w-5 h-5" />
            </motion.button>
            <Link href="/teacher/create" id="create-course-btn">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient-glow flex items-center gap-2 px-6 py-3"
              >
                <Sparkles className="w-5 h-5" />
                Crear Curso con IA
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div id="teacher-stats" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
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
        <div id="course-list-section">
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
      </div>
    </DashboardLayout>
  );
}
