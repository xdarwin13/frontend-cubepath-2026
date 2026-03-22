'use client';

import { useState, useEffect, use } from 'react';
import { verifyApi } from '@/lib/api';
import { CheckCircle, XCircle, Loader2, BookOpen, Calendar, User, GraduationCap, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [certData, setCertData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const data = await verifyApi.verifyCertificate(resolvedParams.code);
      setValid(data.valid);
      setCertData(data.certificate);
    } catch (err: any) {
      setValid(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(145deg, #050a18 0%, #0a1128 50%, #050a18 100%)' }}>
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="EduCubeIA" width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-bold gradient-text">EduCubeIA</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <ShieldCheck className="w-4 h-4" />
            Verificación de Certificados
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-slate-400">Verificando certificado...</p>
          </div>
        ) : valid && certData ? (
          <div className="w-full max-w-xl animate-fade-in">
            {/* Valid badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Certificado Válido</h1>
              <p className="text-slate-400 text-sm">Este certificado ha sido verificado y es auténtico</p>
            </div>

            {/* Certificate details card */}
            <div className="glass-card p-6 space-y-5">
              {/* Verification code */}
              <div className="text-center pb-4 border-b border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Código de verificación</p>
                <p className="text-lg font-bold text-blue-400 font-mono tracking-wider">{certData.verificationCode}</p>
              </div>

              {/* Student */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Otorgado a</p>
                  <p className="text-lg font-semibold text-white">{certData.studentName}</p>
                </div>
              </div>

              {/* Course */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Curso completado</p>
                  <p className="text-lg font-semibold text-white">{certData.courseTitle}</p>
                  {certData.courseCategory && (
                    <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {certData.courseCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Teacher */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Instructor</p>
                  <p className="text-white font-medium">{certData.teacherName}</p>
                  <p className="text-xs text-slate-500">{certData.totalModules} módulo{certData.totalModules !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Fechas</p>
                  <div className="flex justify-between mt-1">
                    <div>
                      <p className="text-xs text-slate-500">Completado</p>
                      <p className="text-white text-sm font-medium">{formatDate(certData.completedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Emitido</p>
                      <p className="text-white text-sm font-medium">{formatDate(certData.issuedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-slate-600 mt-6">
              Certificado emitido por EduCubeIA · Plataforma Educativa con Inteligencia Artificial
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Certificado No Válido</h1>
            <p className="text-slate-400 text-sm mb-6">
              {error || 'El código de verificación proporcionado no corresponde a ningún certificado en nuestro sistema.'}
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Ir al inicio
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
