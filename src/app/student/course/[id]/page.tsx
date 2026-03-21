'use client';

import { useState, useEffect, use, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { studentApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, BookOpen, Loader2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function CourseViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { token } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (token) loadCourse();
  }, [token]);

  const loadCourse = async () => {
    try {
      const data = await studentApi.getCourseDetail(resolvedParams.id, token!);
      setCourse(data.course);
      setEnrollment(data.enrollment);
      // Set first lesson as active
      if (data.course.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(data.course.modules[0].lessons[0]);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const data = await studentApi.enroll(resolvedParams.id, token!);
      setEnrollment(data.enrollment);
      toast.success('Inscrito exitosamente!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleModule = (idx: number) => {
    setExpandedModules(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  };

  // Flat list of all lessons for navigation
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    const lessons: any[] = [];
    course.modules.forEach((mod: any) => {
      mod.lessons?.forEach((lesson: any) => {
        lessons.push(lesson);
      });
    });
    return lessons;
  }, [course]);

  const currentLessonIndex = useMemo(() => {
    return allLessons.findIndex((l: any) => l.id === activeLesson?.id);
  }, [allLessons, activeLesson]);

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const updateProgress = async (newProgress: number) => {
    if (!enrollment) return;
    try {
      await studentApi.updateProgress(enrollment.id, newProgress, token!);
      setEnrollment((prev: any) => ({ ...prev, progress: newProgress }));
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }
  };

  const navigateToLesson = (lesson: any) => {
    setActiveLesson(lesson);
    // Expand the module containing this lesson
    if (course?.modules) {
      course.modules.forEach((mod: any, idx: number) => {
        if (mod.lessons?.some((l: any) => l.id === lesson.id)) {
          setExpandedModules(prev => new Set(prev).add(idx));
        }
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (enrollment && allLessons.length > 0) {
      const idx = allLessons.findIndex((l: any) => l.id === lesson.id);
      const newProgress = Math.max(enrollment.progress || 0, Math.round(((idx + 1) / allLessons.length) * 100));
      if (newProgress > (enrollment.progress || 0)) {
        updateProgress(newProgress);
      }
    }
  };

  const audioBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

  if (loading) {
    return (
      <DashboardLayout allowedRole="student">
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout allowedRole="student">
        <p className="text-center text-slate-400 py-20">Curso no encontrado</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole="student">
      <div className="animate-fade-in">
        <Link href="/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a cursos
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Course Structure */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="glass rounded-xl p-4 sticky top-8">
              <div className="mb-4">
                <h2 className="font-bold text-lg">{course.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{course.teacher?.name}</p>
                {!enrollment && (
                  <button onClick={handleEnroll} className="btn-primary w-full mt-3 text-sm">
                    Inscribirme en este curso
                  </button>
                )}
                {enrollment && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(enrollment.progress || 0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500" style={{ width: `${enrollment.progress || 0}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson counter */}
              <div className="text-xs text-slate-500 mb-3 px-2">
                Leccion {currentLessonIndex + 1} de {allLessons.length}
              </div>

              <div className="space-y-1">
                {course.modules?.map((mod: any, idx: number) => (
                  <div key={mod.id}>
                    <button onClick={() => toggleModule(idx)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <span className="text-sm font-medium truncate">{mod.title}</span>
                      {expandedModules.has(idx) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {expandedModules.has(idx) && (
                      <div className="ml-3 space-y-0.5">
                        {mod.lessons?.map((lesson: any) => (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(lesson)}
                            className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                              activeLesson?.id === lesson.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                          >
                            <BookOpen className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeLesson ? (
              <div>
                <div className="glass rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
                  {activeLesson.imageUrl && (
                    <img src={activeLesson.imageUrl} alt="" className="w-full h-64 object-cover rounded-xl mb-6" />
                  )}
                  {activeLesson.audioUrl && (
                    <div className="mb-6 glass rounded-xl p-4">
                      <p className="text-sm text-slate-400 mb-2">Narracion de la leccion</p>
                      <audio controls className="w-full" src={`${audioBaseUrl}${activeLesson.audioUrl}`}>
                        Tu navegador no soporta audio
                      </audio>
                    </div>
                  )}
                  <div className="markdown-content">
                    <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between mt-6 gap-4">
                  {prevLesson ? (
                    <button
                      onClick={() => navigateToLesson(prevLesson)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-blue-500/30 hover:text-white hover:bg-slate-800/50 transition-all flex-1 max-w-xs"
                    >
                      <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                      <div className="text-left min-w-0">
                        <div className="text-xs text-slate-500">Anterior</div>
                        <div className="text-sm font-medium truncate">{prevLesson.title}</div>
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}
                  {nextLesson ? (
                    <button
                      onClick={() => navigateToLesson(nextLesson)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-blue-500/30 hover:text-white hover:bg-slate-800/50 transition-all flex-1 max-w-xs text-right"
                    >
                      <div className="text-right min-w-0 flex-1">
                        <div className="text-xs text-slate-500">Siguiente</div>
                        <div className="text-sm font-medium truncate">{nextLesson.title}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            ) : (
              <div className="glass rounded-xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Selecciona una leccion para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
