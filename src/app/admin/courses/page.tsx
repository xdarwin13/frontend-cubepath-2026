'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, Users, Search, X, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (token) loadCourses();
  }, [token, searchDebounced, statusFilter]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCourses(token!, searchDebounced || undefined, statusFilter || undefined);
      setCourses(data.courses);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (course: any) => {
    try {
      const res = await adminApi.toggleCourseStatus(course.id, token!);
      toast.success(res.message);
      loadCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    try {
      await adminApi.deleteCourse(deleteModal.id, token!);
      toast.success('Curso eliminado correctamente');
      setDeleteModal(null);
      loadCourses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const categories = [...new Set(courses.map(c => c.category))].filter(Boolean);

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Cursos</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Gestión de todos los cursos de la plataforma</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>{courses.length} curso{courses.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: '', label: 'Todos' },
              { value: 'published', label: 'Publicados' },
              { value: 'draft', label: 'Borradores' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${statusFilter === opt.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No se encontraron cursos</p>
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Curso</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Profesor</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Categoría</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Estado</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Inscritos</th>
                  <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, i) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[200px]">{course.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{course.teacher?.name || '-'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 font-medium">{course.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${course.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {course.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {course.enrollments?.length || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(course)}
                          title={course.status === 'published' ? 'Despublicar' : 'Publicar'}
                          className={`p-2 rounded-lg transition-all ${course.status === 'published' ? 'text-amber-400 hover:bg-amber-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                        >
                          {course.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteModal(course)}
                          title="Eliminar curso"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !actionLoading && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold">Eliminar Curso</h3>
              </div>
              <p className="text-slate-400 text-sm mb-1">
                ¿Estás seguro de que deseas eliminar <span className="text-white font-medium">"{deleteModal.title}"</span>?
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Se eliminarán módulos, lecciones, inscripciones y certificados asociados. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteModal(null)} disabled={actionLoading} className="btn-secondary text-sm">
                  Cancelar
                </button>
                <button onClick={handleDeleteCourse} disabled={actionLoading} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
