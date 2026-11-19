import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export default function UserManagementIndex({ users }: { users: UserItem[] }) {
    const { auth, flash }: any = usePage().props;
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
    });

    const startEdit = (user: UserItem) => {
        clearErrors();
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
    };

    const cancelEdit = () => {
        clearErrors();
        setEditingUser(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post('/users', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (user: UserItem) => {
        if (confirm(`Yakin ingin menghapus akun ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Pengguna', href: '/users' }]}>
            <Head title="Manajemen Pengguna" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Manajemen Pengguna (Khusus Admin)</h1>

                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {flash.error}
                    </div>
                )}

                {/* Form Tambah / Edit User */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-4 rounded border space-y-4">
                    <h2 className="font-semibold text-lg">
                        {editingUser ? `Edit Pengguna: ${editingUser.name}` : 'Tambah Pengguna Baru'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Nama</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                disabled={editingUser?.id === auth.user.id}
                                className="w-full border rounded p-2 mt-1 disabled:opacity-60"
                            >
                                <option value="user">user (Anggota)</option>
                                <option value="admin">admin (Petugas)</option>
                            </select>
                            {editingUser?.id === auth.user.id && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Role akun Anda sendiri tidak dapat diubah.
                                </p>
                            )}
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Password {editingUser && '(Kosongkan jika tidak diubah)'}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {editingUser ? 'Update Pengguna' : 'Tambah Pengguna'}
                        </button>
                        {editingUser && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>

                {/* Tabel Pengguna */}
                <div className="overflow-x-auto border rounded">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Nama</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Role</th>
                                <th className="p-3 border-b">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => {
                                const isSelf = u.id === auth.user.id;
                                return (
                                    <tr key={u.id} className="border-b">
                                        <td className="p-3">{idx + 1}</td>
                                        <td className="p-3">
                                            {u.name} {isSelf && <span className="text-xs text-blue-600">(Anda)</span>}
                                        </td>
                                        <td className="p-3">{u.email}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs uppercase ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                onClick={() => startEdit(u)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Edit
                                            </button>
                                            {!isSelf && (
                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}