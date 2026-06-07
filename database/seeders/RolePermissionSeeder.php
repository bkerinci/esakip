<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Define permissions
        $permissions = [
            'access_analytics',
            'access_ai_insight',
            'access_forecasting',
            'access_recommendation',
            'access_executive_dashboard',
            'manage_users',
            'manage_roles',
            'view_audit_log',
            'evaluate_opd',
            'input_realisasi',
            'upload_document',
            'view_public_data'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles and assign permissions
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        // Super Admin typically bypasses permissions via Gate, but we assign all for clarity
        $superAdmin->syncPermissions(Permission::all());

        $evaluator = Role::firstOrCreate(['name' => 'evaluator']);
        $evaluator->syncPermissions([
            'access_analytics',
            'access_ai_insight',
            'access_forecasting',
            'access_recommendation',
            'evaluate_opd'
        ]);

        $adminOpd = Role::firstOrCreate(['name' => 'admin_opd']);
        $adminOpd->syncPermissions([
            'input_realisasi',
            'upload_document'
        ]);

        $pimpinan = Role::firstOrCreate(['name' => 'pimpinan']);
        $pimpinan->syncPermissions([
            'access_executive_dashboard'
        ]);

        $viewerPublik = Role::firstOrCreate(['name' => 'viewer_publik']);
        $viewerPublik->syncPermissions([
            'view_public_data'
        ]);

        // Migrate existing users
        // Since the previous implementation used the 'role' column (string),
        // we assign the corresponding Spatie Role to each user.
        $users = User::all();
        foreach ($users as $user) {
            if ($user->role && Role::where('name', $user->role)->exists()) {
                $user->assignRole($user->role);
            } else {
                // Default to admin_opd if no valid role
                $user->assignRole('admin_opd');
            }
        }
    }
}
