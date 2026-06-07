<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::updateOrCreate(
            ['email' => 'superadmin@sakip.go.id'],
            [
                'name' => 'Super Admin E-SAKIP',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'super_admin',
            ]
        );
    }
}
