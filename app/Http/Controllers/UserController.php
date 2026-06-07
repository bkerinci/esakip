<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Opd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('opd')->latest()->paginate(10);
        $opds = Opd::all();
        
        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
            'opds' => $opds
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
            'no_telp' => 'nullable|string|max:20',
            'role' => 'required|in:super_admin,admin,user,evaluator',
            'opd_id' => 'required_if:role,admin|nullable|exists:opds,id',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_telp' => $request->no_telp,
            'role' => $request->role,
            'opd_id' => $request->opd_id,
        ]);

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
    }

    public function storeOpd(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'singkatan' => 'nullable|string|max:50',
        ]);

        Opd::create([
            'nama' => $request->nama,
            'singkatan' => $request->singkatan,
        ]);

        return redirect()->back()->with('success', 'OPD berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$id,
            'no_telp' => 'nullable|string|max:20',
            'role' => 'required|in:super_admin,admin,user,evaluator',
            'opd_id' => 'required_if:role,admin|nullable|exists:opds,id',
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'role' => $request->role,
            'opd_id' => $request->opd_id,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Cegah penghapusan diri sendiri
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}
