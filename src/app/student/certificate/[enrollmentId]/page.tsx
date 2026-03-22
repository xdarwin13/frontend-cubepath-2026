'use client';

import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth';
import { studentApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Loader2, Award } from 'lucide-react';

const Certificate = dynamic(() => import('@/components/Certificate'), { ssr: false });
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CertificatePage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const resolvedParams = use(params);
  const { token } = useAuth();
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) loadCertificate();
  }, [token]);

  const loadCertificate = async () => {
    try {
      const data = await studentApi.getCertificate(resolvedParams.enrollmentId, token!);
      setCertData(data.certificate);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole="student">
      <div className="animate-fade-in">
        <Link href="/student/my-courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a mis cursos
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : error ? (
          <div className="glass rounded-xl p-12 text-center">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">{error}</p>
            <Link href="/student/my-courses" className="btn-primary inline-block mt-4">
              Ir a mis cursos
            </Link>
          </div>
        ) : certData ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Tu Certificado</h1>
              <p className="text-slate-400 text-sm">Felicidades por completar el curso. Descarga tu certificado a continuacion.</p>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[960px] flex justify-center">
                <Certificate data={certData} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
