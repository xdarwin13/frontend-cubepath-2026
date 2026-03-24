'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ClipboardList, Loader2, Search, X, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminEnrollmentsPage() {
  const { token } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (token) loadEnrollments();
  }, [token, searchDebounced]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getEnrollments(token!, searchDebounced || undefined);
      setEnrollments(data.enrollments);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter(e => {
    if (filter === 'completed') return e.completedAt;
    if (filter === 'active') return !e.completedAt;
    return true;
  });

  const completedCount = enrollments.filter(e => e.completedAt).length;
  const avgProgress = enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length) : 0;

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Inscripciones</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Todas las inscripciones de la plataforma</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">{enrollments.length}</p>
              <p className="text-xs text-slate-400">Total Inscripciones</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">{completedCount}</p>
              <p className="text-xs text-slate-400">Completadas</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">{avgProgress}%</p>
              <p className="text-xs text-slate-400">Progreso Promedio</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por estudiante o curso..."
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
            {([
              { value: 'all', label: 'Todas' },
              { value: 'active', label: 'En progreso' },
              { value: 'completed', label: 'Completadas' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${filter === opt.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No se encontraron inscripciones</p>
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Estudiante</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Curso</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Profesor</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Progreso</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Estado</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enrollment, i) => (
                  <motion.tr
                    key={enrollment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {enrollment.student?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{enrollment.student?.name || '-'}</p>
                          <p className="text-xs text-slate-500 truncate">{enrollment.student?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm truncate max-w-[180px]">{enrollment.course?.title || '-'}</p>
                      <p className="text-xs text-slate-500">{enrollment.course?.category || ''}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{enrollment.course?.teacher?.name || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className={`h-full rounded-full transition-all ${enrollment.progress >= 100 ? 'bg-green-500' : enrollment.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(enrollment.progress || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 min-w-[36px]">{Math.round(enrollment.progress || 0)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {enrollment.completedAt ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          <Clock className="w-3 h-3" />
                          En progreso
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-400">{new Date(enrollment.createdAt).toLocaleDateString('es-ES')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
