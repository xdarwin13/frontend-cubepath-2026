'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { aiApi, teacherApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Sparkles, Loader2, BookOpen, ArrowRight, Eye, Check, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
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
    'Curso de Python para principiantes con ejercicios practicos',
    'Introduccion al Machine Learning y sus aplicaciones',
    'Fundamentos de diseno web moderno con HTML, CSS y JavaScript',
    'Marketing digital para emprendedores',
    'Fotografia profesional: de basico a avanzado',
    'Finanzas personales e inversion para principiantes',
  ];

  return (
    <DashboardLayout allowedRole="teacher">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { num: 1, label: 'Prompt' },
            { num: 2, label: 'Preview' },
            { num: 3, label: 'Contenido' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-sm ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
              {i < 2 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-blue-600' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Prompt */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Crear Curso con IA</h1>
              <p className="text-slate-400">Describe el curso que quieres crear y la IA generara toda la estructura</p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <label className="block text-sm font-medium text-slate-300">Describe tu curso</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="Ej: Quiero un curso de desarrollo web moderno que cubra HTML5, CSS3, JavaScript ES6+, React y Node.js. Orientado a principiantes con ejercicios practicos en cada leccion."
              />

              <div>
                <p className="text-xs text-slate-500 mb-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando curso con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generar Curso
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preview & Generate Content */}
        {step >= 2 && course && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1">{course.title}</h1>
                <p className="text-slate-400">{course.description}</p>
                <span className="text-xs text-blue-400 mt-1 inline-block">{course.category}</span>
              </div>
              {course.coverImage && (
                <img src={course.coverImage} alt="" className="w-24 h-24 rounded-xl object-cover" />
              )}
            </div>

            {/* Modules */}
            <div className="space-y-3">
              {course.modules?.map((mod: any, idx: number) => (
                <div key={mod.id} className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleModule(idx)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                        {idx + 1}
                      </div>
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
                        <div key={lesson.id} className="flex flex-col gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <span className="text-sm font-medium text-slate-500 mt-0.5">{lIdx + 1}.</span>
                              <div>
                                <h4 className="font-medium text-[15px] leading-tight mb-2">{lesson.title}</h4>
                                <div className="flex items-center gap-4 text-xs">
                                  {/* Status indicators */}
                                  <div className="flex items-center gap-3">
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
                            </div>
                            
                            <div className="flex gap-2 shrink-0 self-start sm:self-center">
                              <button
                                onClick={() => generateLessonContent(lesson.id)}
                                disabled={generatingContent.has(lesson.id)}
                                className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-50 flex items-center gap-1.5"
                              >
                                {generatingContent.has(lesson.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {hasContent(lesson) ? 'Regenerar Texto' : 'Generar Texto'}
                              </button>
                              <button
                                onClick={() => generateAudio(lesson.id)}
                                disabled={generatingAudio.has(lesson.id) || !hasContent(lesson)}
                                className="text-xs px-3 py-1.5 rounded-lg border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                title={!hasContent(lesson) ? 'Genera el contenido de texto primero' : ''}
                              >
                                {generatingAudio.has(lesson.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : '🔊'}
                                {hasAudio(lesson) ? 'Regenerar Audio' : 'Generar Audio'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button onClick={publishCourse} disabled={publishing} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                {publishing ? 'Publicando...' : 'Publicar Curso'}
              </button>
              <button onClick={() => router.push('/teacher')} className="btn-secondary">
                Guardar como Borrador
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
