'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { aiApi, teacherApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, BookOpen, ArrowRight, Eye, Check, ChevronDown, ChevronUp, CheckCircle, XCircle, Wand2, Volume2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateCoursePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [generatingContent, setGeneratingContent] = useState<Set<string>>(new Set());
  const [generatingAudio, setGeneratingAudio] = useState<Set<string>>(new Set());
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [savingLesson, setSavingLesson] = useState<Set<string>>(new Set());

  const hasContent = (lesson: any) => lesson.content && lesson.content.length > 100;
  const hasAudio = (lesson: any) => !!lesson.audioUrl;

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Escribe un prompt para generar el curso');
    setGenerating(true);
    try {
      const data = await aiApi.generateCourse(prompt, token!);
      setCourse(data.course);
      setStep(2);
      toast.success('Curso generado exitosamente!');
    } catch (error: any) {
      toast.error(error.message || 'Error al generar curso');
    } finally {
      setGenerating(false);
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
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGeneratingAudio(prev => { const n = new Set(prev); n.delete(lessonId); return n; });
    }
  };

  const saveLessonContent = useCallback(async (lessonId: string, markdown: string) => {
    setSavingLesson(prev => new Set(prev).add(lessonId));
    try {
      await teacherApi.updateLesson(lessonId, { content: markdown }, token!);
      setCourse((prev: any) => {
        const updated = { ...prev };
        updated.modules = updated.modules.map((m: any) => ({
          ...m,
          lessons: m.lessons.map((l: any) => l.id === lessonId ? { ...l, content: markdown } : l),
        }));
        return updated;
      });
      toast.success('Contenido guardado!');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setSavingLesson(prev => { const n = new Set(prev); n.delete(lessonId); return n; });
    }
  }, [token]);

  const handleSearchImages = useCallback(async (query: string) => {
    const data = await aiApi.searchImages(query, token!);
    const photos = data.photos || data.results || [];
    return photos.map((p: any) => ({
      src: p.src?.medium || p.src?.small || p.url || p.src,
      alt: p.alt || p.photographer || query,
    }));
  }, [token]);

  const publishCourse = async () => {
    setPublishing(true);
    try {
      await teacherApi.updateCourse(course.id, { status: 'published' }, token!);
      toast.success('Curso publicado!');
      router.push('/teacher');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPublishing(false);
    }
  };

  const toggleModule = (idx: number) => {
    setExpandedModules(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  };

  const promptSuggestions = [
    'Curso de Python para principiantes con ejercicios prácticos',
    'Introducción al Machine Learning y sus aplicaciones',
    'Fundamentos de diseño web moderno con HTML, CSS y JavaScript',
    'Marketing digital para emprendedores',
    'Fotografía profesional: de básico a avanzado',
    'Finanzas personales e inversión para principiantes',
  ];

  const stepItems = [
    { num: 1, label: 'Prompt', icon: Wand2 },
    { num: 2, label: 'Preview', icon: Eye },
    { num: 3, label: 'Contenido', icon: BookOpen },
  ];

  return (
    <DashboardLayout allowedRole="teacher">
      <div className="max-w-4xl mx-auto">
        {/* Steps indicator */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-8">
          {stepItems.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 shrink-0">
                <motion.div
                  animate={{ scale: step === s.num ? 1.06 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= s.num
                      ? 'bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white'
                      : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </motion.div>
                <span className={`text-sm hidden sm:block whitespace-nowrap ${step >= s.num ? 'text-white font-medium' : 'text-slate-500'}`}>{s.label}</span>
              </div>
              {i < stepItems.length - 1 && (
                <div
                  className={`h-0.5 w-10 sm:w-20 rounded-full transition-colors ${
                    step > s.num ? 'bg-gradient-to-r from-[#3b82f6] to-[#6366f1]' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step 1: Prompt */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Crear Curso con <span className="gradient-text">IA</span></h1>
                <p className="text-slate-400">Describe el curso que quieres crear y la IA generará toda la estructura</p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-4">
                <label className="block text-sm font-medium text-slate-300">Describe tu curso</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="input-field min-h-[120px] resize-none !pl-4"
                  placeholder="Ej: Quiero un curso de desarrollo web moderno que cubra HTML5, CSS3, JavaScript ES6+, React y Node.js. Orientado a principiantes con ejercicios prácticos en cada lección."
                  style={{ paddingLeft: '1rem' }}
                />

                <div>
                  <p className="text-xs text-slate-500 mb-2">💡 Sugerencias:</p>
                  <div className="flex flex-wrap gap-2">
                    {promptSuggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPrompt(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-slate-700/50 text-slate-400 hover:border-[#38bdf8]/30 hover:text-[#38bdf8] hover:bg-[#38bdf8]/5 transition-all"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  whileHover={{ scale: generating ? 1 : 1.02 }}
                  whileTap={{ scale: generating ? 1 : 0.98 }}
                  className="btn-gradient-glow w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="relative">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                      <span>Generando curso con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generar Curso
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Preview & Generate Content */}
          {step >= 2 && course && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{course.title}</h1>
                  <p className="text-slate-400 text-sm sm:text-base">{course.description}</p>
                  <span className="text-xs text-[#38bdf8] mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#38bdf8]/5 border border-[#38bdf8]/10">{course.category}</span>
                </div>
                {course.coverImage && (
                  <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} src={course.coverImage} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-700/30 shrink-0" />
                )}
              </div>

              {/* Modules */}
              <div className="space-y-3">
                {course.modules?.map((mod: any, idx: number) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#6366f1]/20 flex items-center justify-center text-sm font-bold text-[#38bdf8] border border-[#3b82f6]/10">
                          {idx + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">{mod.title}</h3>
                          <p className="text-xs text-slate-400">{mod.lessons?.length || 0} lecciones</p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: expandedModules.has(idx) ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedModules.has(idx) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-700/30 p-4 space-y-3">
                            {mod.lessons?.map((lesson: any, lIdx: number) => (
                              <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: lIdx * 0.05 }}
                                className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-slate-700/30"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    <span className="text-sm font-medium text-slate-500 mt-0.5">{lIdx + 1}.</span>
                                    <div>
                                      <h4 className="font-medium text-[15px] leading-tight mb-2">{lesson.title}</h4>
                                      <div className="flex items-center gap-4 text-xs">
                                        <span className={`inline-flex items-center gap-1 ${hasContent(lesson) ? 'text-emerald-400' : 'text-slate-500'}`}>
                                          {hasContent(lesson) ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                          {hasContent(lesson) ? 'Texto listo' : 'Sin texto'}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 ${hasAudio(lesson) ? 'text-emerald-400' : 'text-slate-500'}`}>
                                          {hasAudio(lesson) ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                          {hasAudio(lesson) ? 'Audio listo' : 'Sin audio'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 shrink-0 self-start sm:self-center">
                                    <motion.button
                                      whileHover={{ scale: 1.03 }}
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() => generateLessonContent(lesson.id)}
                                      disabled={generatingContent.has(lesson.id)}
                                      className="text-xs px-3 py-1.5 rounded-lg border border-[#3b82f6]/20 text-[#38bdf8] hover:bg-[#3b82f6]/10 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                      {generatingContent.has(lesson.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                      {hasContent(lesson) ? 'Regenerar Texto' : 'Generar Texto'}
                                    </motion.button>
                                    {hasContent(lesson) && (
                                      <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)}
                                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                                          editingLesson === lesson.id
                                            ? 'border-[#a78bfa]/30 text-[#a78bfa] bg-[#a78bfa]/10'
                                            : 'border-[#a78bfa]/20 text-[#a78bfa] hover:bg-[#a78bfa]/10'
                                        }`}
                                      >
                                        <Pencil className="w-3 h-3" />
                                        {editingLesson === lesson.id ? 'Cerrar Editor' : 'Editar'}
                                      </motion.button>
                                    )}
                                    <motion.button
                                      whileHover={{ scale: 1.03 }}
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() => generateAudio(lesson.id)}
                                      disabled={generatingAudio.has(lesson.id) || !hasContent(lesson)}
                                      className="text-xs px-3 py-1.5 rounded-lg border border-[#06b6d4]/20 text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                      title={!hasContent(lesson) ? 'Genera el contenido de texto primero' : ''}
                                    >
                                      {generatingAudio.has(lesson.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                                      {hasAudio(lesson) ? 'Regenerar Audio' : 'Generar Audio'}
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Editor de contenido */}
                                <AnimatePresence>
                                  {editingLesson === lesson.id && hasContent(lesson) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-2">
                                        <RichTextEditor
                                          content={lesson.content}
                                          onSave={(md) => saveLessonContent(lesson.id, md)}
                                          saving={savingLesson.has(lesson.id)}
                                          onSearchImages={handleSearchImages}
                                        />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={publishCourse}
                  disabled={publishing}
                  className="btn-gradient-glow flex-1 flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                  {publishing ? 'Publicando...' : 'Publicar Curso'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/teacher')}
                  className="btn-secondary px-6 py-3.5 text-center"
                >
                  Guardar como Borrador
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
