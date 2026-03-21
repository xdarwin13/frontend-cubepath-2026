'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, BarChart3, Loader2, TrendingUp, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [statsData, chartsData] = await Promise.all([
        adminApi.getStats(token!),
        adminApi.getChartData(token!),
      ]);
      setStats(statsData.stats);
      setCharts(chartsData.charts);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRole="admin">
        <div className="flex justify-center py-20">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-[#10b981]/20 border-t-[#10b981] rounded-full animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: 'Total Usuarios', value: stats?.totalUsers || 0, icon: Users, color: 'from-[#3b82f6] to-[#6366f1]', glow: 'rgba(59,130,246,0.15)' },
    { label: 'Profesores', value: stats?.totalTeachers || 0, icon: GraduationCap, color: 'from-[#f59e0b] to-[#f97316]', glow: 'rgba(249,115,22,0.15)' },
    { label: 'Estudiantes', value: stats?.totalStudents || 0, icon: BookOpen, color: 'from-[#06b6d4] to-[#0ea5e9]', glow: 'rgba(6,182,212,0.15)' },
    { label: 'Cursos', value: stats?.totalCourses || 0, icon: BarChart3, color: 'from-[#10b981] to-[#059669]', glow: 'rgba(16,185,129,0.15)' },
    { label: 'Publicados', value: stats?.publishedCourses || 0, icon: TrendingUp, color: 'from-[#ec4899] to-[#f43f5e]', glow: 'rgba(244,63,94,0.15)' },
    { label: 'Inscripciones', value: stats?.totalEnrollments || 0, icon: Activity, color: 'from-[#8b5cf6] to-[#7c3aed]', glow: 'rgba(139,92,246,0.15)' },
  ];

  const registrationsData = {
    labels: charts?.registrationsPerDay?.map((d: any) => {
      const date = new Date(d.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }) || [],
    datasets: [{
      label: 'Registros',
      data: charts?.registrationsPerDay?.map((d: any) => parseInt(d.count)) || [],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.05)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: '#38bdf8',
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const categoryData = {
    labels: charts?.coursesByCategory?.map((c: any) => c.category) || [],
    datasets: [{
      data: charts?.coursesByCategory?.map((c: any) => parseInt(c.count)) || [],
      backgroundColor: ['#3b82f6', '#06b6d4', '#f97316', '#10b981', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
      borderRadius: 4,
    }],
  };

  const roleData = {
    labels: charts?.roleDistribution?.map((r: any) => r.role === 'teacher' ? 'Profesores' : r.role === 'student' ? 'Estudiantes' : 'Admins') || [],
    datasets: [{
      data: charts?.roleDistribution?.map((r: any) => parseInt(r.count)) || [],
      backgroundColor: ['#f97316', '#06b6d4', '#10b981'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#64748b', font: { family: 'Inter' } } },
    },
    scales: {
      x: { ticks: { color: '#475569' }, grid: { color: 'rgba(148, 163, 184, 0.05)' } },
      y: { ticks: { color: '#475569' }, grid: { color: 'rgba(148, 163, 184, 0.05)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#64748b', padding: 16, font: { family: 'Inter' } } },
    },
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-slate-400 mb-8">Overview de la plataforma <span className="gradient-text font-semibold">EduCubeIA</span></p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl p-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`} style={{ boxShadow: `0 0 20px ${card.glow}` }}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-slate-400">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#38bdf8]" /> Registros por Día</h3>
            {charts?.registrationsPerDay?.length > 0 ? (
              <Line data={registrationsData} options={chartOptions} />
            ) : (
              <p className="text-slate-500 text-center py-12">Sin datos de registros aún</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#818cf8]" /> Cursos por Categoría</h3>
            {charts?.coursesByCategory?.length > 0 ? (
              <div className="max-w-xs mx-auto"><Doughnut data={categoryData} options={doughnutOptions} /></div>
            ) : (
              <p className="text-slate-500 text-center py-12">Sin cursos aún</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-[#06b6d4]" /> Distribución de Roles</h3>
            {charts?.roleDistribution?.length > 0 ? (
              <div className="max-w-xs mx-auto"><Doughnut data={roleData} options={doughnutOptions} /></div>
            ) : (
              <p className="text-slate-500 text-center py-12">Sin usuarios aún</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#f97316]" /> Top Profesores</h3>
            {charts?.topTeachers?.length > 0 ? (
              <div className="space-y-3">
                {charts.topTeachers.map((t: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-slate-700/30 hover:border-slate-600/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <span className="text-sm">{t.teacher?.name || 'Profesor'}</span>
                    </div>
                    <span className="text-sm text-[#38bdf8] font-medium">{t.courseCount} cursos</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">Sin profesores aún</p>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
