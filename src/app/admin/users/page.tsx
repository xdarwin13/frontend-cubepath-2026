'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, GraduationCap, BookOpen, Shield, Search, Trash2, UserCog, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [roleModal, setRoleModal] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (token) loadUsers();
  }, [token, roleFilter, searchDebounced]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers(token!, roleFilter || undefined, searchDebounced || undefined);
      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    try {
      await adminApi.deleteUser(deleteModal.id, token!);
      toast.success('Usuario eliminado correctamente');
      setDeleteModal(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (newRole: string) => {
    if (!roleModal) return;
    setActionLoading(true);
    try {
      await adminApi.updateUserRole(roleModal.id, newRole, token!);
      toast.success('Rol actualizado correctamente');
      setRoleModal(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const roleIcons: Record<string, any> = { teacher: GraduationCap, student: BookOpen, admin: Shield };
  const roleColors: Record<string, string> = {
    teacher: 'text-amber-400 bg-amber-500/20',
    student: 'text-teal-400 bg-teal-500/20',
    admin: 'text-green-400 bg-green-500/20',
  };
  const roleLabels: Record<string, string> = { teacher: 'Profesor', student: 'Estudiante', admin: 'Admin' };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Usuarios</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Gestión de usuarios de la plataforma</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            <span>{users.length} usuario{users.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
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
            {['', 'teacher', 'student', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${roleFilter === role ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50'}`}
              >
                {role === '' ? 'Todos' : roleLabels[role]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Usuario</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Email</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Rol</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase">Registro</th>
                  <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const RoleIcon = roleIcons[u.role] || Users;
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[u.role] || ''}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => !isSelf && setRoleModal(u)}
                            disabled={isSelf}
                            title={isSelf ? 'No puedes cambiar tu rol' : 'Cambiar rol'}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <UserCog className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => !isSelf && setDeleteModal(u)}
                            disabled={isSelf}
                            title={isSelf ? 'No puedes eliminarte' : 'Eliminar usuario'}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
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
                <h3 className="text-lg font-bold">Eliminar Usuario</h3>
              </div>
              <p className="text-slate-400 text-sm mb-1">
                ¿Estás seguro de que deseas eliminar a <span className="text-white font-medium">{deleteModal.name}</span>?
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Se eliminarán todos sus datos, cursos, inscripciones y certificados asociados. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteModal(null)} disabled={actionLoading} className="btn-secondary text-sm">
                  Cancelar
                </button>
                <button onClick={handleDeleteUser} disabled={actionLoading} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Change Modal */}
      <AnimatePresence>
        {roleModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !actionLoading && setRoleModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Cambiar Rol</h3>
                  <p className="text-slate-400 text-xs">{roleModal.name} — {roleModal.email}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">Selecciona el nuevo rol para este usuario:</p>
              <div className="space-y-2 mb-6">
                {(['admin', 'teacher', 'student'] as const).map(role => {
                  const Icon = roleIcons[role];
                  const isCurrentRole = roleModal.role === role;
                  return (
                    <button
                      key={role}
                      onClick={() => !isCurrentRole && handleChangeRole(role)}
                      disabled={isCurrentRole || actionLoading}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${isCurrentRole ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300' : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10'} disabled:cursor-not-allowed`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{roleLabels[role]}</span>
                      {isCurrentRole && <span className="ml-auto text-xs text-blue-400">Actual</span>}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <button onClick={() => setRoleModal(null)} disabled={actionLoading} className="btn-secondary text-sm">
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
