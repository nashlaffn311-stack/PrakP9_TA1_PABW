<?php

namespace Modules\Buku\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Buku\Http\Requests\BukuRequest;
use Modules\Buku\Models\Buku;

class BukuController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $bukus = Buku::query()
            ->when($search, function ($query, $search) {
                $query->where('judul', 'like', "%{$search}%")
                      ->orWhere('penulis', 'like', "%{$search}%")
                      ->orWhere('penerbit', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Buku::index', [
            'bukus' => $bukus,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(BukuRequest $request)
    {
        Buku::create($request->validated());
        return redirect()->back()->with('success', 'Data buku berhasil ditambahkan.');
    }

    public function update(BukuRequest $request, Buku $buku)
    {
        $buku->update($request->validated());
        return redirect()->back()->with('success', 'Data buku berhasil diperbarui.');
    }

    public function destroy(Buku $buku)
    {
        $buku->delete();
        return redirect()->back()->with('success', 'Data buku berhasil dihapus.');
    }
}