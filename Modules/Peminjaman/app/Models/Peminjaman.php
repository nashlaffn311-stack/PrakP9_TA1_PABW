<?php

namespace Modules\Peminjaman\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    protected $table = 'peminjamen';

    protected $fillable = [
        'nama_peminjam',
        'judul_buku',
        'tanggal_pinjam',
        'tanggal_kembali',
        'status',
        'berkas',
    ];

    protected $appends = ['berkas_url'];

    public function getBerkasUrlAttribute(): ?string
    {
        return $this->berkas ? asset('storage/' . $this->berkas) : null;
    }
}