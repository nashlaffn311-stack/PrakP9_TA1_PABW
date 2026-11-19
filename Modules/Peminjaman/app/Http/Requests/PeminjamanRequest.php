<?php

namespace Modules\Peminjaman\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PeminjamanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Admin dan user boleh mengakses
    }

    public function rules(): array
    {
        $fileRule = $this->isMethod('POST')
            ? 'required|file|mimes:jpg,jpeg,png,pdf|max:2048'
            : 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048';

        return [
            'nama_peminjam' => 'required|string|max:255',
            'judul_buku' => 'required|string|max:255',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
            'status' => 'required|in:Dipinjam,Dikembalikan',
            'berkas' => $fileRule,
        ];
    }
}