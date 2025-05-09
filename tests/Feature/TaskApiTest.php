<?php

namespace Tests\Feature;

use App\Enums\TaskCategory;
use App\Enums\TaskStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_a_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = $user->tasks()->create([
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => now()->addDays(7)->toDateString(),
            'is_urgent' => false,
            'category' => TaskCategory::PERSONAL->value,
        ]);

        $response = $this->getJson("/api/tasks/{$task->id}");
        
        $response->assertStatus(200);
        $response->assertJsonFragment(['title' => 'Tarea de prueba']);
    }

    public function test_user_can_get_their_tasks()
    {
        $user = User::factory()->hasTasks(3)->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_user_can_get_their_summary()
    {
        $user = User::factory()->hasTasks(3)->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/tasks/summary');

        $response->assertStatus(200);
        $response->assertJsonFragment(['total_tasks' => 3]);
    }

    public function test_user_can_create_a_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $dueDate = now()->addDays(7)->format('Y-m-d');
        $dueDateForDB = "$dueDate 00:00:00";

        $taskData = [
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => $dueDate,
            'is_urgent' => false,
            'category' => TaskCategory::PERSONAL->value,
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => $dueDateForDB,
            'is_urgent' => 0,
            'category' => TaskCategory::PERSONAL->value,
        ]);
    }

    public function test_user_can_update_a_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $dueDate = now()->addDays(3)->format('Y-m-d');
        $dueDateForDB = "$dueDate 00:00:00";

        $task = $user->tasks()->create([
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => now()->addDays(7)->toDateString(),
            'category' => TaskCategory::PERSONAL->value,
        ]);

        $updatedData = [
            'title' => 'Tarea actualizada',
            'description' => 'Descripción de la tarea actualizada',
            'status' => TaskStatus::COMPLETED->value,
            'due_date' => $dueDate,
            'category' => TaskCategory::WORK->value,
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updatedData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', array_merge(['id' => $task->id], [
            'title' => 'Tarea actualizada',
            'description' => 'Descripción de la tarea actualizada',
            'status' => TaskStatus::COMPLETED->value,
            'due_date' => $dueDateForDB,
            'category' => TaskCategory::WORK->value,
        ]));
    }

    public function test_user_can_delete_a_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = $user->tasks()->create([
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => now()->addDays(7)->toDateString(),
            'is_urgent' => false,
            'category' => TaskCategory::PERSONAL->value,
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_unauthenticated_user_cannot_access_tasks()
    {
        $response = $this->getJson('/api/tasks');
        $response->assertStatus(401);
    }

    public function test_unautehnticated_user_cannot_access_summary()
    {
        $response = $this->getJson('api/tasks/summary');
        $response->assertStatus(401);
    }

    public function test_user_cannot_get_other_users_tasks()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user);

        $task = $otherUser->tasks()->create([
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => now()->addDays(7)->toDateString(),
            'is_urgent' => false,
            'category' => TaskCategory::PERSONAL->value,
        ]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(404);
    }

    public function test_user_cannot_update_other_users_tasks()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user);

        $task = $otherUser->tasks()->create([
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => now()->addDays(7)->toDateString(),
            'is_urgent' => false,
            'category' => TaskCategory::PERSONAL->value,
        ]);

        $updatedData = [
            'title' => 'Tarea actualizada',
            'description' => 'Descripción de la tarea actualizada',
            'status' => TaskStatus::COMPLETED->value,
            'due_date' => now()->addDays(3)->toDateString(),
            'is_urgent' => true,
            'category' => TaskCategory::WORK->value,
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updatedData);

        $response->assertStatus(404);
    }

    public function test_user_cannot_delete_other_users_tasks()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user);

        $task = $otherUser->tasks()->create([
            'title' => 'Tarea de prueba',
            'description' => 'Descripción de la tarea de prueba',
            'status' => TaskStatus::PENDING->value,
            'due_date' => now()->addDays(7)->toDateString(),
            'is_urgent' => false,
            'category' => TaskCategory::PERSONAL->value,
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(404);
    }
}
