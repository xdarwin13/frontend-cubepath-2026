'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Loader2, GraduationCap, BookOpen, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (token) loadUsers();
  }, [token, roleFilter]);

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers(token!, roleFilter || undefined);
      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const roleIcons: Record<string, any> = { teacher: GraduationCap, student: BookOpen, admin: Shield };
  const roleColors: Record<string, string> = { teacher: 'text-amber-400 bg-amber-500/20', student: 'text-teal-400 bg-teal-500/20', admin: 'text-green-400 bg-green-500/20' };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-slate-400 mt-1">Gestion de usuarios de la plataforma</p>
          </div>
          <div className="flex gap-2">
            {['', 'teacher', 'student', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => { setRoleFilter(role); setLoading(true); }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${roleFilter === role ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {role === '' ? 'Todos' : role === 'teacher' ? 'Profesores' : role === 'student' ? 'Estudiantes' : 'Admins'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Usuario</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Email</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Rol</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const RoleIcon = roleIcons[user.role] || Users;
                  return (
                    <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${roleColors[user.role] || ''}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
