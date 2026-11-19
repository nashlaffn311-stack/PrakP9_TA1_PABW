<?php

namespace Modules\Peminjaman\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Modules\Peminjaman\Http\Requests\PeminjamanRequest;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanController extends Controller
{
    public function index()
    {
        return Inertia::render('Peminjaman::index');
    }

    public function getData()
    {
        $data = Peminjaman::latest()->get();
        return response()->json(['data' => $data]);
    }

    public function store(PeminjamanRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('berkas')) {
            $validated['berkas'] = $request->file('berkas')->store('peminjaman', 'public');
        }

        $peminjaman = Peminjaman::create($validated);

        return response()->json([
            'message' => 'Data peminjaman berhasil ditambahkan.',
            'data' => $peminjaman,
        ], 201);
    }

    public function update(PeminjamanRequest $request, Peminjaman $peminjaman)
    {
        $validated = $request->validated();

        if ($request->hasFile('berkas')) {
            if ($peminjaman->berkas && Storage::disk('public')->exists($peminjaman->berkas)) {
                Storage::disk('public')->delete($peminjaman->berkas);
            }
            $validated['berkas'] = $request->file('berkas')->store('peminjaman', 'public');
        } else {
            unset($validated['berkas']);
        }

        $peminjaman->update($validated);

        return response()->json([
            'message' => 'Data peminjaman berhasil diperbarui.',
            'data' => $peminjaman,
        ]);
    }

    public function destroy(Peminjaman $peminjaman)
    {
        if ($peminjaman->berkas && Storage::disk('public')->exists($peminjaman->berkas)) {
            Storage::disk('public')->delete($peminjaman->berkas);
        }

        $peminjaman->delete();

        return response()->json([
            'message' => 'Data peminjaman dan berkas berhasil dihapus.',
        ]);
    }
}