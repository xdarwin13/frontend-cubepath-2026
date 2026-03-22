'use client';

import { useRef, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

interface CertificateData {
  id: string;
  verificationCode: string;
  studentName: string;
  courseTitle: string;
  teacherName: string;
  totalModules: number;
  completedAt: string;
  enrolledAt: string;
  issuedAt: string;
}

interface CertificateProps {
  data: CertificateData;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Certificate({ data }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${data.verificationCode}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#38bdf8', light: '#00000000' },
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl);
  }, [verifyUrl]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const html2canvas = (await import('html2canvas-pro')).default;
    const { jsPDF } = await import('jspdf');

    const canvas = await html2canvas(certRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`certificado-${data.courseTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={certRef}
        style={{
          width: 960,
          height: 600,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          background: 'linear-gradient(145deg, #050a18 0%, #0a1128 30%, #0d1535 60%, #0a1128 100%)',
        }}
      >
        {/* Outer border glow */}
        <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderImage: 'linear-gradient(135deg, #38bdf8, #818cf8, #a78bfa, #38bdf8) 1' }} />

        {/* Inner decorative border */}
        <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 4 }} />

        {/* Corner ornaments */}
        {[
          { top: 16, left: 16 },
          { top: 16, right: 16 },
          { bottom: 16, left: 16 },
          { bottom: 16, right: 16 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: 40,
              height: 40,
              borderTop: i < 2 ? '2px solid rgba(56, 189, 248, 0.4)' : 'none',
              borderBottom: i >= 2 ? '2px solid rgba(56, 189, 248, 0.4)' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid rgba(56, 189, 248, 0.4)' : 'none',
              borderRight: i % 2 === 1 ? '2px solid rgba(56, 189, 248, 0.4)' : 'none',
            }}
          />
        ))}

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px 50px', textAlign: 'center' }}>

          {/* Logo + Platform name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="EduCubeIA" style={{ width: 38, height: 38, borderRadius: 8 }} />
            <span style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.5px' }}>
              EduCubeIA
            </span>
          </div>

          <p style={{ color: '#64748b', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
            Plataforma Educativa con Inteligencia Artificial
          </p>

          {/* Decorative line */}
          <div style={{ width: 420, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(129,140,248,0.4), transparent)', marginBottom: 14 }} />

          {/* Certificate title */}
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#e2e8f0', letterSpacing: '1px', marginBottom: 2 }}>
            CERTIFICADO DE FINALIZACIÓN
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>Se otorga a</p>

          {/* Student name */}
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#818cf8', marginBottom: 4, lineHeight: 1.2 }}>
            {data.studentName}
          </h2>

          <div style={{ width: 180, height: 2, background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)', marginBottom: 10, borderRadius: 1 }} />

          <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>Por completar exitosamente el curso</p>

          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#ffffff', marginBottom: 4, maxWidth: 700, lineHeight: 1.3 }}>
            {`"${data.courseTitle}"`}
          </h3>

          <p style={{ color: '#64748b', fontSize: 11, marginBottom: 18 }}>
            {data.totalModules} módulo{data.totalModules !== 1 ? 's' : ''} completado{data.totalModules !== 1 ? 's' : ''}
            {' · '}Impartido por {data.teacherName}
          </p>

          {/* Bottom section: date + QR + verification */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', maxWidth: 700 }}>
            {/* Date */}
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
                Fecha de emisión
              </p>
              <p style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{formatDate(data.completedAt)}</p>
              <div style={{ marginTop: 8, width: 150, height: 1, background: 'rgba(56, 189, 248, 0.3)' }} />
            </div>

            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                background: 'rgba(10, 17, 40, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 6,
              }}>
                {qrDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="QR Verificación" style={{ width: 78, height: 78, borderRadius: 6 }} />
                )}
              </div>
              <span style={{ fontSize: 7, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Escanea para verificar</span>
            </div>

            {/* Verification code */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
                Código de verificación
              </p>
              <p style={{ color: '#38bdf8', fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 1 }}>
                {data.verificationCode}
              </p>
              <div style={{ marginTop: 8, width: 150, height: 1, background: 'rgba(129, 140, 248, 0.3)', marginLeft: 'auto' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
      >
        <Download className="w-5 h-5" />
        Descargar Certificado
      </button>
    </div>
  );
}
