'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { studentApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Search, Loader2, Users, Sparkles, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOnboardingTour } from '@/lib/useOnboardingTour';

const STUDENT_TOUR_STEPS = [
  {
    popover: {
      title: '👋 ¡Bienvenido, Estudiante!',
      description: '<p>Esta es tu plataforma de aprendizaje con cursos creados con <strong>inteligencia artificial</strong>.</p><p style="margin-top:8px;opacity:0.7;font-size:13px">Te mostraremos cómo sacarle el máximo provecho en menos de 1 minuto.</p>',
    },
  },
  {
    element: '#student-search',
    popover: {
      title: '🔍 Busca lo que te interesa',
      description: '<p>Escribe cualquier tema y filtra los cursos disponibles al instante. Puedes buscar por <strong>título</strong> o <strong>descripción</strong>.</p>',
      side: 'bottom' as const,
    },
  },
  {
    element: '#sidebar-main-section',
    popover: {
      title: '🧭 Tu menú de navegación',
      description: '<ul style="margin:4px 0 0 16px;list-style:disc;opacity:0.85;font-size:13px"><li><strong>Mis Cursos</strong> — cursos en los que estás inscrito</li><li><strong>Explorar Cursos</strong> — descubre cursos nuevos</li></ul><p style="margin-top:8px;opacity:0.7;font-size:12px">En móvil, abre el menú con el ícono ☰</p>',
      side: 'right' as const,
    },
  },
  {
    element: '#student-course-list',
    popover: {
      title: '📚 Catálogo de cursos',
      description: '<p>Aquí verás todos los cursos disponibles. Haz clic en cualquiera para ver su contenido completo e <strong>inscribirte gratis</strong>.</p><p style="margin-top:8px;opacity:0.7;font-size:13px">Cada curso incluye módulos, lecciones y evaluaciones generadas con IA.</p>',
      side: 'top' as const,
    },
  },
  {
    popover: {
      title: '🎓 ¡A aprender!',
      description: '<p>Explora el catálogo, inscríbete en los cursos que te interesen y <strong>avanza a tu ritmo</strong>.</p><p style="margin-top:10px;padding:8px 12px;background:rgba(6,182,212,0.08);border-radius:8px;border-left:3px solid #06b6d4;font-size:13px">💡 <strong>Tip:</strong> Al completar un curso recibirás un certificado verificable con código QR.</p>',
    },
  },
];

export default function StudentDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { startTour } = useOnboardingTour({
    tourId: 'student_dashboard',
    steps: STUDENT_TOUR_STEPS,
    delay: 1200,
  });

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
      <div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Explorar Cursos</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Descubre cursos creados con inteligencia artificial</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => startTour()}
            className="p-2.5 rounded-xl border border-slate-700/50 text-slate-400 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/5 transition-all"
            title="Ver tour de ayuda"
            id="help-tour-btn"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div id="student-search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field py-3.5 !pl-12 text-base"
            placeholder="Buscar cursos por título o descripción..."
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#06b6d4]/20 border-t-[#06b6d4] rounded-full animate-spin" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#06b6d4]/10 to-[#0ea5e9]/10 flex items-center justify-center border border-[#06b6d4]/20">
              <BookOpen className="w-10 h-10 text-[#06b6d4]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No hay cursos disponibles</h3>
            <p className="text-slate-400">Los profesores están creando contenido. ¡Vuelve pronto!</p>
          </motion.div>
        ) : (
          <div id="student-course-list" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Link href={`/student/course/${course.id}`} className="card overflow-hidden group cursor-pointer block h-full">
                  <div className="h-44 bg-gradient-to-br from-[#0a2a3f] to-[#0a1128] relative overflow-hidden">
                    {course.coverImage && (
                      <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a18] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-[#38bdf8]/10 text-[#38bdf8] backdrop-blur-sm border border-[#38bdf8]/15 font-medium">{course.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#38bdf8] transition-colors">{course.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {course.teacher?.name || 'Profesor'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.modules?.length || 0} módulos
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
