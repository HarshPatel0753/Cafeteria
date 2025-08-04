<?php

namespace Database\Seeders;

use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::truncate();
        User::truncate();

        $adminRole = Role::create([
            'name' => 'admin',
            'display_name'=> 'Admin',
        ]);

        $userRole = Role::create([
            'name' => 'user',
            'display_name'=> 'User',
        ]);

        $user1 = User::create([
            'username' => 'raj',
            'first_name' => 'Raj',
            'last_name' => 'Nayak',
            'mobile_number' => 8320139615,
            'email' => 'raj@gmail.com',
            'password' => bcrypt('123456'),
        ]);

        $user1->assignRole($adminRole->name);

        $user2 = User::create([
            'username' => 'mahir',
            'first_name' => 'Mahir',
            'last_name' => 'Sherasiya',
            'mobile_number' => 9904427380,
            'email' => 'sherasiyamahir24@gmail.com',
            'password' => bcrypt('123456'),
        ]);

        $user2->assignRole($userRole->name);

    }
}
