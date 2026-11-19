<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Models\Peminjaman;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'totalBuku' => Buku::count(),
            'totalPeminjaman' => Peminjaman::count(),
            'totalUsers' => User::count(),
            'recentPeminjaman' => Peminjaman::latest()->take(5)->get(),
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';