<?php

namespace Modules\UserManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Modules\UserManagement\Http\Requests\UserRequest;

class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('UserManagement::index', [
            'users' => User::latest()->get(),
        ]);
    }

    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        User::create($data);

        return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(UserRequest $request, User $user)
    {
        $data = $request->validated();

        // Cegah admin menurunkan role akunnya sendiri
        if ($user->id === $request->user()->id && $data['role'] !== 'admin') {
            return redirect()->back()->withErrors([
                'role' => 'Anda tidak dapat menurunkan role akun Anda sendiri.',
            ]);
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }
}