'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, Loader2, Search, X, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCertificatesPage() {
  const { token } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (token) loadCertificates();
  }, [token, searchDebounced]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCertificates(token!, searchDebounced || undefined);
      setCertificates(data.certificates);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Código copiado');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Certificados</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Certificados emitidos en la plataforma</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Award className="w-4 h-4" />
            <span>{certificates.length} certificado{certificates.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por estudiante, curso o código..."
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
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No se encontraron certificados</p>
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Estudiante</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Curso</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Profesor</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Código de Verificación</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Emitido</th>
                  <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase">Verificar</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, i) => (
                  <motion.tr
                    key={cert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {cert.student?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{cert.student?.name || '-'}</p>
                          <p className="text-xs text-slate-500 truncate">{cert.student?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm truncate max-w-[180px]">{cert.course?.title || '-'}</p>
                      <p className="text-xs text-slate-500">{cert.course?.category || ''}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{cert.course?.teacher?.name || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-800 px-2 py-1 rounded-lg text-[#38bdf8] font-mono">
                          {cert.verificationCode}
                        </code>
                        <button
                          onClick={() => copyCode(cert.verificationCode)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
                          title="Copiar código"
                        >
                          {copiedCode === cert.verificationCode ? (
                            <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{new Date(cert.issuedAt).toLocaleDateString('es-ES')}</td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <a
                          href={`/verify/${cert.verificationCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10 transition-all"
                          title="Verificar certificado"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
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
