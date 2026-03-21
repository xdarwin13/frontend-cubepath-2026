'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth';
import { teacherApi, aiApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Sparkles, Loader2, ChevronDown, ChevronUp, Eye, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { token } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [generatingContent, setGeneratingContent] = useState<Set<string>>(new Set());
  const [generatingAudio, setGeneratingAudio] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (token) loadCourse();
  }, [token]);

  const loadCourse = async () => {
    try {
      const data = await teacherApi.getCourse(resolvedParams.id, token!);
      setCourse(data.course);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateLessonContent = async (lessonId: string) => {
    setGeneratingContent(prev => new Set(prev).add(lessonId));
    try {
      const data = await aiApi.generateLessonContent(lessonId, token!);
      setCourse((prev: any) => {
        const updated = { ...prev };
        updated.modules = updated.modules.map((m: any) => ({
          ...m,
          lessons: m.lessons.map((l: any) => l.id === lessonId ? { ...l, content: data.lesson.content } : l),
        }));
        return updated;
      });
      toast.success('Contenido generado!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGeneratingContent(prev => { const n = new Set(prev); n.delete(lessonId); return n; });
    }
  };

  const generateAudio = async (lessonId: string) => {
    setGeneratingAudio(prev => new Set(prev).add(lessonId));
    try {
      await aiApi.generateAudio(lessonId, token!);
      toast.success('Audio generado!');
      // Reload course to get updated audioUrl
      await loadCourse();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGeneratingAudio(prev => { const n = new Set(prev); n.delete(lessonId); return n; });
    }
  };

  const publishCourse = async () => {
    try {
      await teacherApi.updateCourse(course.id, { status: 'published' }, token!);
      setCourse((prev: any) => ({ ...prev, status: 'published' }));
      toast.success('Curso publicado!');
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

  const hasContent = (lesson: any) => lesson.content && lesson.content.length > 100;
  const hasAudio = (lesson: any) => !!lesson.audioUrl;

  if (loading) {
    return (
      <DashboardLayout allowedRole="teacher">
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout allowedRole="teacher">
        <p className="text-center text-slate-400 py-20">Curso no encontrado</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole="teacher">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Link href="/teacher" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a mis cursos
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{course.title}</h1>
            <p className="text-slate-400">{course.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-blue-400">{course.category}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${course.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {course.status === 'published' ? 'Publicado' : 'Borrador'}
              </span>
            </div>
          </div>
          {course.status !== 'published' && (
            <button onClick={publishCourse} className="btn-primary flex items-center gap-2">
              <Eye className="w-4 h-4" /> Publicar
            </button>
          )}
        </div>

        <div className="space-y-3">
          {course.modules?.map((mod: any, idx: number) => (
            <div key={mod.id} className="glass rounded-xl overflow-hidden">
              <button onClick={() => toggleModule(idx)} className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">{idx + 1}</div>
                  <div className="text-left">
                    <h3 className="font-medium">{mod.title}</h3>
                    <p className="text-xs text-slate-400">{mod.lessons?.length || 0} lecciones</p>
                  </div>
                </div>
                {expandedModules.has(idx) ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {expandedModules.has(idx) && (
                <div className="border-t border-slate-700/50 p-4 space-y-3">
                  {mod.lessons?.map((lesson: any, lIdx: number) => (
                    <div key={lesson.id} className="flex items-start justify-between p-3 rounded-lg bg-slate-800/30">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-xs text-slate-500 mt-1">{lIdx + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          {/* Status indicators */}
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={`inline-flex items-center gap-1 text-xs ${hasContent(lesson) ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {hasContent(lesson) ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {hasContent(lesson) ? 'Texto listo' : 'Sin texto'}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs ${hasAudio(lesson) ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {hasAudio(lesson) ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {hasAudio(lesson) ? 'Audio listo' : 'Sin audio'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() => generateLessonContent(lesson.id)}
                          disabled={generatingContent.has(lesson.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          {generatingContent.has(lesson.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {hasContent(lesson) ? 'Regenerar' : 'Generar'} Texto
                        </button>
                        <button
                          onClick={() => generateAudio(lesson.id)}
                          disabled={generatingAudio.has(lesson.id) || !hasContent(lesson)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          {generatingAudio.has(lesson.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                          {hasAudio(lesson) ? 'Regenerar' : 'Generar'} Audio
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
