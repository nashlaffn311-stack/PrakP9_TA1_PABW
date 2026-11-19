import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Buku {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
}

export default function BukuIndex({ bukus, filters }: any) {
    const { auth, flash }: any = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        stok: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/buku', { search }, { preserveState: true, replace: true });
    };

    const openCreate = () => {
        reset();
        clearErrors();
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (buku: Buku) => {
        clearErrors();
        setEditingId(buku.id);
        setData({
            judul: buku.judul,
            penulis: buku.penulis,
            penerbit: buku.penerbit,
            tahun_terbit: String(buku.tahun_terbit),
            stok: String(buku.stok),
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/buku/${editingId}`, {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        } else {
            post('/buku', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus buku ini?')) {
            router.delete(`/buku/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Data Buku', href: '/buku' }]}>
            <Head title="Data Buku" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Daftar Buku Perpustakaan</h1>
                    {isAdmin && (
                        <button
                            onClick={openCreate}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Tambah Buku
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Form Tambah / Edit (Khusus Admin) */}
                {isAdmin && showForm && (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-4 rounded border space-y-3">
                        <h2 className="font-semibold text-lg">{editingId ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Judul Buku</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                />
                                {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Penulis</label>
                                <input
                                    type="text"
                                    value={data.penulis}
                                    onChange={(e) => setData('penulis', e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                />
                                {errors.penulis && <p className="text-red-500 text-xs mt-1">{errors.penulis}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Penerbit</label>
                                <input
                                    type="text"
                                    value={data.penerbit}
                                    onChange={(e) => setData('penerbit', e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                />
                                {errors.penerbit && <p className="text-red-500 text-xs mt-1">{errors.penerbit}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tahun Terbit</label>
                                <input
                                    type="number"
                                    value={data.tahun_terbit}
                                    onChange={(e) => setData('tahun_terbit', e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                />
                                {errors.tahun_terbit && <p className="text-red-500 text-xs mt-1">{errors.tahun_terbit}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Stok</label>
                                <input
                                    type="number"
                                    value={data.stok}
                                    onChange={(e) => setData('stok', e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                />
                                {errors.stok && <p className="text-red-500 text-xs mt-1">{errors.stok}</p>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                {/* Pencarian */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Cari judul, penulis, atau penerbit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded p-2 w-full md:w-80"
                    />
                    <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded">
                        Cari
                    </button>
                </form>

                {/* Tabel Buku */}
                <div className="overflow-x-auto border rounded">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Judul</th>
                                <th className="p-3 border-b">Penulis</th>
                                <th className="p-3 border-b">Penerbit</th>
                                <th className="p-3 border-b">Tahun</th>
                                <th className="p-3 border-b">Stok</th>
                                {isAdmin && <th className="p-3 border-b">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bukus.data.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 7 : 6} className="p-4 text-center text-gray-500">
                                        Data buku kosong.
                                    </td>
                                </tr>
                            ) : (
                                bukus.data.map((buku: Buku, index: number) => (
                                    <tr key={buku.id} className="border-b">
                                        <td className="p-3">{bukus.from + index}</td>
                                        <td className="p-3 font-medium">{buku.judul}</td>
                                        <td className="p-3">{buku.penulis}</td>
                                        <td className="p-3">{buku.penerbit}</td>
                                        <td className="p-3">{buku.tahun_terbit}</td>
                                        <td className="p-3">{buku.stok}</td>
                                        {isAdmin && (
                                            <td className="p-3 space-x-2">
                                                <button
                                                    onClick={() => openEdit(buku)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(buku.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-1 flex-wrap">
                    {bukus.links.map((link: any, i: number) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 border rounded text-sm ${
                                link.active ? 'bg-blue-600 text-white' : 'bg-white dark:bg-neutral-900'
                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}