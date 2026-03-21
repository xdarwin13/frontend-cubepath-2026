'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, BookOpen, GraduationCap, BarChart3, Loader2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: 'Total Usuarios', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-600 to-blue-800', bg: 'bg-blue-500/20', text: 'text-blue-400' },
    { label: 'Profesores', value: stats?.totalTeachers || 0, icon: GraduationCap, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/20', text: 'text-amber-400' },
    { label: 'Estudiantes', value: stats?.totalStudents || 0, icon: BookOpen, color: 'from-teal-600 to-teal-800', bg: 'bg-teal-500/20', text: 'text-teal-400' },
    { label: 'Cursos', value: stats?.totalCourses || 0, icon: BarChart3, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20', text: 'text-green-400' },
    { label: 'Publicados', value: stats?.publishedCourses || 0, icon: TrendingUp, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/20', text: 'text-pink-400' },
    { label: 'Inscripciones', value: stats?.totalEnrollments || 0, icon: Users, color: 'from-violet-600 to-violet-800', bg: 'bg-violet-500/20', text: 'text-violet-400' },
  ];

  const registrationsData = {
    labels: charts?.registrationsPerDay?.map((d: any) => {
      const date = new Date(d.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }) || [],
    datasets: [
      {
        label: 'Registros',
        data: charts?.registrationsPerDay?.map((d: any) => parseInt(d.count)) || [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: charts?.coursesByCategory?.map((c: any) => c.category) || [],
    datasets: [
      {
        data: charts?.coursesByCategory?.map((c: any) => parseInt(c.count)) || [],
        backgroundColor: ['#2563eb', '#0d9488', '#f97316', '#10b981', '#ef4444', '#7c3aed'],
        borderWidth: 0,
      },
    ],
  };

  const roleData = {
    labels: charts?.roleDistribution?.map((r: any) => r.role === 'teacher' ? 'Profesores' : r.role === 'student' ? 'Estudiantes' : 'Admins') || [],
    datasets: [
      {
        data: charts?.roleDistribution?.map((r: any) => parseInt(r.count)) || [],
        backgroundColor: ['#f97316', '#0d9488', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#94a3b8', padding: 16 } },
    },
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400 mb-8">Overview de la plataforma EduCubeIA</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-slate-400">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="font-bold mb-4">Registros por Dia</h3>
            {charts?.registrationsPerDay?.length > 0 ? (
              <Line data={registrationsData} options={chartOptions} />
            ) : (
              <p className="text-slate-500 text-center py-12">Sin datos de registros aun</p>
            )}
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="font-bold mb-4">Cursos por Categoria</h3>
            {charts?.coursesByCategory?.length > 0 ? (
              <div className="max-w-xs mx-auto">
                <Doughnut data={categoryData} options={doughnutOptions} />
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">Sin cursos aun</p>
            )}
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="font-bold mb-4">Distribucion de Roles</h3>
            {charts?.roleDistribution?.length > 0 ? (
              <div className="max-w-xs mx-auto">
                <Doughnut data={roleData} options={doughnutOptions} />
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">Sin usuarios aun</p>
            )}
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="font-bold mb-4">Top Profesores</h3>
            {charts?.topTeachers?.length > 0 ? (
              <div className="space-y-3">
                {charts.topTeachers.map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-sm">{t.teacher?.name || 'Profesor'}</span>
                    </div>
                    <span className="text-sm text-blue-400 font-medium">{t.courseCount} cursos</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">Sin profesores aun</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
