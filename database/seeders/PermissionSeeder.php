<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [

            // dashboard -----------------------------------------------------------
            [
                "name" => 'admin_dashboard',
                'guard_name' => 'web',
                "display_name" => 'Admin Dashboard',
                "category" => 'dashboard',
            ],

            // user ----------------------------------------------------------------
            [
                "name" => 'user_view',
                'guard_name' => 'web',
                "display_name" => 'User View',
                "category" => 'user',
            ],
            [
                "name" => 'user_store',
                'guard_name' => 'web',
                "display_name" => 'User Store',
                "category" => 'user',
            ],
            [
                "name" => 'user_update',
                'guard_name' => 'web',
                "display_name" => 'User Update',
                "category" => 'user',
            ],
            [
                "name" => 'user_delete',
                'guard_name' => 'web',
                "display_name" => 'User Delete',
                "category" => 'user',
            ],

            // vendor ---------------------------------------------------------------
            [
                "name" => 'vendor_view',
                'guard_name' => 'web',
                "display_name" => 'Vendor View',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_store',
                'guard_name' => 'web',
                "display_name" => 'Vendor Store',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_update',
                'guard_name' => 'web',
                "display_name" => 'Vendor Update',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_delete',
                'guard_name' => 'web',
                "display_name" => 'Vendor Delete',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_details',
                'guard_name' => 'web',
                "display_name" => 'Vendor Details',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_balance_view',
                'guard_name' => 'web',
                "display_name" => 'Vendor Balance View',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_balance_import',
                'guard_name' => 'web',
                "display_name" => 'Vendor Balance Import',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_balance_export',
                'guard_name' => 'web',
                "display_name" => 'Vendor Balance Export',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_balance_demo',
                'guard_name' => 'web',
                "display_name" => 'Vendor Balance Demo',
                "category" => 'vendor',
            ],
            [
                "name" => 'vendor_balance_pdf',
                'guard_name' => 'web',
                "display_name" => 'Vendor Balance Pdf',
                "category" => 'vendor',
            ],

            // cup-list ---------------------------------------------------------------
            [
                "name" => 'cupList_view',
                'guard_name' => 'web',
                "display_name" => 'CupList View',
                "category" => 'cupList',
            ],
            [
                "name" => 'cupList_store',
                'guard_name' => 'web',
                "display_name" => 'CupList Store',
                "category" => 'cupList',
            ],
            [
                "name" => 'cupList_update',
                'guard_name' => 'web',
                "display_name" => 'CupList Update',
                "category" => 'cupList',
            ],
            [
                "name" => 'cupList_delete',
                'guard_name' => 'web',
                "display_name" => 'CupList Delete',
                "category" => 'cupList',
            ],
            [
                "name" => 'cupList_details',
                'guard_name' => 'web',
                "display_name" => 'CupList Details',
                "category" => 'cupList',
            ],

            // role -----------------------------------------------------------------
            [
                "name" => 'role_view',
                'guard_name' => 'web',
                "display_name" => 'Role View',
                "category" => 'role',
            ],
            [
                "name" => 'role_store',
                'guard_name' => 'web',
                "display_name" => 'Role Store',
                "category" => 'role',
            ],
            [
                "name" => 'role_update',
                'guard_name' => 'web',
                "display_name" => 'Role Update',
                "category" => 'role',
            ],
            [
                "name" => 'role_delete',
                'guard_name' => 'web',
                "display_name" => 'Role Delete',
                "category" => 'role',
            ],

            // payment --------------------------------------------------------------
            [
                "name" => 'payment_view',
                'guard_name' => 'web',
                "display_name" => 'Payment View',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_store',
                'guard_name' => 'web',
                "display_name" => 'Payment Store',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_update',
                'guard_name' => 'web',
                "display_name" => 'Payment Update',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_delete',
                'guard_name' => 'web',
                "display_name" => 'Payment Delete',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_import',
                'guard_name' => 'web',
                "display_name" => 'Payment Import',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_export',
                'guard_name' => 'web',
                "display_name" => 'Payment Export',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_demo',
                'guard_name' => 'web',
                "display_name" => 'Payment Demo',
                "category" => 'payment',
            ],
            [
                "name" => 'payment_pdf',
                'guard_name' => 'web',
                "display_name" => 'Payment Pdf',
                "category" => 'payment',
            ],
        ];

        Permission::insert($permissions);

        $adminRole = Role::where('name','admin')->first();
        $userRole = Role::where('name','user')->first();

        $adminRole->givePermissionTo([
            'admin_dashboard',
        ]);

        $userRole->givePermissionTo([
            'admin_dashboard',
        ]);

    }
}
