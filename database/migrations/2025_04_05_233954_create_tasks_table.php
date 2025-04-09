<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['pendiente', 'en progreso', 'completada'])->default('pendiente');
            $table->date('due_date')->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->enum('category', ['trabajo', 'estudio', 'casa', 'personal', 'finanzas', 'salud', 'viaje', 'social', 'tecnología']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
