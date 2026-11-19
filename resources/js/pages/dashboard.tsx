import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, ClipboardList, Library, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface PeminjamanItem {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    status: 'Dipinjam' | 'Dikembalikan';
}

interface DashboardProps {
    totalBuku: number;
    totalPeminjaman: number;
    totalUsers: number;
    recentPeminjaman: PeminjamanItem[];
}

export default function Dashboard({
    totalBuku = 0,
    totalPeminjaman = 0,
    totalUsers = 0,
    recentPeminjaman = [],
}: DashboardProps) {
    const { auth }: any = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2">
                        <Library className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard SiPustaka</h1>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                        Selamat datang di Sistem Informasi Perpustakaan. Kelola koleksi buku dan peminjaman dengan mudah.
                    </p>
                </div>

                {/* Kartu Statistik (3 Kolom untuk Admin, 2 Kolom untuk User) */}
                <div className={`grid grid-cols-1 gap-4 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {/* Total Buku */}
                    <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                        <div>
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Buku</p>
                            <p className="mt-2 text-3xl font-bold">{totalBuku}</p>
                            <p className="mt-2 text-xs text-neutral-400">Koleksi buku perpustakaan</p>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Total Peminjaman */}
                    <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                        <div>
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Peminjaman</p>
                            <p className="mt-2 text-3xl font-bold">{totalPeminjaman}</p>
                            <p className="mt-2 text-xs text-neutral-400">Seluruh transaksi peminjaman</p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Total Pengguna (Khusus Admin) */}
                    {isAdmin && (
                        <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Pengguna</p>
                                <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
                                <p className="mt-2 text-xs text-neutral-400">Akun terdaftar</p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabel Peminjaman Terbaru */}
                <div className="rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold">Peminjaman Terbaru</h2>
                            <p className="text-xs text-neutral-500">Lima transaksi peminjaman terakhir.</p>
                        </div>
                        <Link
                            href="/peminjaman"
                            className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300"
                        >
                            Lihat Semua <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-neutral-50 text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium">No.</th>
                                    <th className="px-4 py-3 font-medium">Peminjam</th>
                                    <th className="px-4 py-3 font-medium">Judul Buku</th>
                                    <th className="px-4 py-3 font-medium">Tanggal Pinjam</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentPeminjaman.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                                            Belum ada transaksi peminjaman.
                                        </td>
                                    </tr>
                                ) : (
                                    recentPeminjaman.map((item, idx) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">{idx + 1}</td>
                                            <td className="px-4 py-3">{item.nama_peminjam}</td>
                                            <td className="px-4 py-3">{item.judul_buku}</td>
                                            <td className="px-4 py-3">{item.tanggal_pinjam}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        item.status === 'Dipinjam'
                                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                    <h2 className="text-base font-semibold">Informasi SiPustaka</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        SiPustaka merupakan sistem informasi perpustakaan untuk mengelola koleksi buku, transaksi peminjaman, dan data pengguna secara terintegrasi.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}