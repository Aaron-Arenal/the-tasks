<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tasks', function () {
        return Inertia::render('Tasks/Index');
    })->name('tasks.index');

    Route::get('tasks/{id}', function(Request $request, $id) {
        return Inertia::render('Tasks/Show', ['id' => (int) $id]);
    })->name('tasks.show')->whereNumber('id');

    Route::get('tasks/create', function () {
        return Inertia::render('Tasks/Create');
    })->name('tasks.create');

    Route::get('tasks/{id}/edit', function(Request $request, $id) {
        return Inertia::render('Tasks/Edit', ['id' => (int) $id]);
    })->name('tasks.edit')->whereNumber('id');
});

Route::middleware(['auth', 'verified', EnsureUserIsAdmin::class])->group(function() {
    Route::get('/users', function () {
        return Inertia::render('Users/Index');
    })->name('admin.users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
