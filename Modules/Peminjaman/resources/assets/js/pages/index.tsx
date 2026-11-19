import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Peminjaman {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    status: 'Dipinjam' | 'Dikembalikan';
    berkas: string | null;
    berkas_url: string | null;
}

export default function PeminjamanIndex() {
    const [items, setItems] = useState<Peminjaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [editingId, setEditingId] = useState<number | null>(null);
    const [existingBerkasUrl, setExistingBerkasUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({
        nama_peminjam: '',
        judul_buku: '',
        tanggal_pinjam: '',
        tanggal_kembali: '',
        status: 'Dipinjam',
        berkas: null as File | null,
    });

    const getCsrfToken = () =>
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const fetchPeminjaman = async () => {
        setLoading(true);
        const res = await fetch('/peminjaman/data', {
            headers: { Accept: 'application/json' },
        });
        const json = await res.json();
        setItems(json.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchPeminjaman();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setExistingBerkasUrl(null);
        setErrors({});
        setForm({
            nama_peminjam: '',
            judul_buku: '',
            tanggal_pinjam: '',
            tanggal_kembali: '',
            status: 'Dipinjam',
            berkas: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (item: Peminjaman) => {
        setErrors({});
        setSuccessMsg(null);
        setEditingId(item.id);
        setExistingBerkasUrl(item.berkas_url);
        setForm({
            nama_peminjam: item.nama_peminjam,
            judul_buku: item.judul_buku,
            tanggal_pinjam: item.tanggal_pinjam,
            tanggal_kembali: item.tanggal_kembali,
            status: item.status,
            berkas: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccessMsg(null);
        setSubmitError(null);
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('nama_peminjam', form.nama_peminjam);
            formData.append('judul_buku', form.judul_buku);
            formData.append('tanggal_pinjam', form.tanggal_pinjam);
            formData.append('tanggal_kembali', form.tanggal_kembali);
            formData.append('status', form.status);
            if (form.berkas) {
                formData.append('berkas', form.berkas);
            }

            const url = editingId ? `/peminjaman/${editingId}` : '/peminjaman';
            if (editingId) {
                formData.append('_method', 'PUT');
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: formData,
            });

            const json = await res.json();

            if (res.status === 422) {
                setErrors(json.errors || {});
                return;
            }

            if (!res.ok) {
                setSubmitError(json.message || 'Peminjaman gagal disimpan. Silakan coba lagi.');
                return;
            }

            setSuccessMsg(json.message);
            resetForm();
            fetchPeminjaman();
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? `Peminjaman gagal disimpan: ${error.message}`
                    : 'Peminjaman gagal disimpan. Periksa koneksi lalu coba lagi.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin hapus data peminjaman ini? File bukti juga akan terhapus.')) return;

        const res = await fetch(`/peminjaman/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': getCsrfToken(),
                Accept: 'application/json',
            },
        });

        const json = await res.json();
        if (res.ok) {
            setSuccessMsg(json.message);
            fetchPeminjaman();
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Peminjaman (AJAX)', href: '/peminjaman' }]}>
            <Head title="Peminjaman Buku" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Data Peminjaman Buku (CRUD AJAX)</h1>

                {successMsg && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {successMsg}
                    </div>
                )}
                {submitError && (
                    <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {submitError}
                    </div>
                )}

                {/* Form AJAX */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-4 rounded border space-y-4">
                    <h2 className="font-semibold text-lg">
                        {editingId ? 'Edit Data Peminjaman' : 'Catat Peminjaman Baru'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Nama Peminjam</label>
                            <input
                                type="text"
                                required
                                value={form.nama_peminjam}
                                onChange={(e) => setForm({ ...form, nama_peminjam: e.target.value })}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.nama_peminjam && (
                                <p className="text-red-500 text-xs mt-1">{errors.nama_peminjam[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Judul Buku</label>
                            <input
                                type="text"
                                required
                                value={form.judul_buku}
                                onChange={(e) => setForm({ ...form, judul_buku: e.target.value })}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.judul_buku && (
                                <p className="text-red-500 text-xs mt-1">{errors.judul_buku[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Tanggal Pinjam</label>
                            <input
                                type="date"
                                required
                                value={form.tanggal_pinjam}
                                onChange={(e) => setForm({ ...form, tanggal_pinjam: e.target.value })}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.tanggal_pinjam && (
                                <p className="text-red-500 text-xs mt-1">{errors.tanggal_pinjam[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Tanggal Kembali</label>
                            <input
                                type="date"
                                required
                                value={form.tanggal_kembali}
                                onChange={(e) => setForm({ ...form, tanggal_kembali: e.target.value })}
                                className="w-full border rounded p-2 mt-1"
                            />
                            {errors.tanggal_kembali && (
                                <p className="text-red-500 text-xs mt-1">{errors.tanggal_kembali[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                required
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full border rounded p-2 mt-1"
                            >
                                <option value="Dipinjam">Dipinjam</option>
                                <option value="Dikembalikan">Dikembalikan</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Foto Bukti Peminjaman (JPG/PNG/PDF, maks. 2MB)
                                {!editingId && ' - wajib diisi'}
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                required={!editingId}
                                onChange={(e) =>
                                    setForm({ ...form, berkas: e.target.files ? e.target.files[0] : null })
                                }
                                className="w-full border rounded p-2 mt-1"
                            />
                            {existingBerkasUrl && (
                                <p className="text-xs mt-1">
                                    Berkas saat ini:{' '}
                                    <a
                                        href={existingBerkasUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Lihat Berkas Lama
                                    </a>{' '}
                                    (biarkan kosong jika tidak ingin mengganti)
                                </p>
                            )}
                            {errors.berkas && <p className="text-red-500 text-xs mt-1">{errors.berkas[0]}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Menyimpan...' : editingId ? 'Update Peminjaman' : 'Simpan Peminjaman'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Batal Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Tabel AJAX */}
                <div className="overflow-x-auto border rounded">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Nama Peminjam</th>
                                <th className="p-3 border-b">Judul Buku</th>
                                <th className="p-3 border-b">Tgl Pinjam</th>
                                <th className="p-3 border-b">Tgl Kembali</th>
                                <th className="p-3 border-b">Status</th>
                                <th className="p-3 border-b">Bukti</th>
                                <th className="p-3 border-b">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-gray-500">
                                        Belum ada data peminjaman.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, idx) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-3">{idx + 1}</td>
                                        <td className="p-3">{item.nama_peminjam}</td>
                                        <td className="p-3">{item.judul_buku}</td>
                                        <td className="p-3">{item.tanggal_pinjam}</td>
                                        <td className="p-3">{item.tanggal_kembali}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    item.status === 'Dipinjam'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {item.berkas_url ? (
                                                <a
                                                    href={item.berkas_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline text-sm"
                                                >
                                                    Buka Berkas
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}