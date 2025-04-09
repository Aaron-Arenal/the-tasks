<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(4)->hasTasks(3)->user()->create();
        User::factory(2)->admin()->create();
        User::factory(1)->hasTasks(3)->admin()->create([
            'name' => 'Admin Usuario',
            'email' => 'admin@prueba.com',
            'password' => Hash::make('admin123'),
        ]);
        User::factory()->hasTasks(3)->user()->create([
            'name' => 'Usuario Normal',
            'email' => 'usuario@prueba.com',
            'password' => Hash::make('password123'),
        ]);
    }
}
