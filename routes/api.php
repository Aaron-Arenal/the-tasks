<?php

use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\Auth\ApiRegisterController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

//Registro (API)
Route::post('/register', [ApiRegisterController::class, 'register'])->name('api.register');

//Login y logout (API)
Route::post('/login', [ApiAuthController::class, 'issueToken'])->name('api.login');
Route::post('/logout', [ApiAuthController::class, 'revokeToken'])->middleware('auth:sanctum')->name('api.logout');

//Rutas protegidas para Admin Users
Route::middleware(['auth:sanctum', EnsureUserIsAdmin::class])->prefix('/admin')->group(function () {
    Route::get('/users', [AdminUserController::class, 'getAllUsers'])->name('admin.users.index');
    Route::get('/users/{id}', [AdminUserController::class, 'getUserById'])->name('admin.users.show');
    Route::put('/users/{id}', [AdminUserController::class, 'editUser'])->name('admin.users.update');
    Route::delete('/users/{id}', [AdminUserController::class, 'deleteUser'])->name('admin.users.destroy');
});

//Rutas protegidas para Tasks
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/summary', [TaskController::class, 'summary'])->name('tasks.summary');
    Route::get('/tasks/{id}', [TaskController::class, 'show'])->where('id', '[0-9]+')->name('tasks.show');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('/tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});