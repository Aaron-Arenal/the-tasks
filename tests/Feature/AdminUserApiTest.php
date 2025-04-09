<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserApiTest extends TestCase
{
    use RefreshDatabase;

    private function createAdminUser() {
        return User::factory()->admin()->create();
    }

    private function createNormalUser() {
        return User::factory()->user()->create();
    }

    public function test_admin_can_get_all_users()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        User::factory(3)->create();

        $response = $this->getJson('/api/admin/users');
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'email', 'role']
            ]
        ]);
        $response->assertJsonCount(4, 'data');
    }

    public function test_normal_user_cannot_access_admin_routes()
    {
        $user = $this->createNormalUser();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_get_specific_user()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        $user = User::factory()->create();

        $response = $this->getJson("/api/admin/users/{$user->id}");
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
                'data' => ['id', 'name', 'email', 'role'],
        ]);
        $response->assertJsonFragment(['email' => $user->email]);
    }

    public function test_returns_404_if_user_not_found()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/users/9999');
        $response->assertStatus(404);
    }

    public function test_admin_can_update_user()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        $user = User::factory()->create();
        $updateData = [
            'name' => 'Nuevo nombre',
            'email' => 'nuevo@email.com',
            'role' => 'admin'
        ];

        $response = $this->putJson("/api/admin/users/{$user->id}", $updateData);
        
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => 'Nuevo nombre',
            'email' => 'nuevo@email.com',
            'role' => 'admin'
        ]);
        
        $this->assertDatabaseHas('users', $updateData);
    }

    public function test_validates_data_when_updating_user()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        $user = User::factory()->create();
        
        // Email inválido y rol no permitido
        $response = $this->putJson("/api/admin/users/{$user->id}", [
            'email' => 'correo-invalido',
            'role' => 'rol-invalido'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'role']);
    }

    public function test_admin_can_delete_user()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        $user = User::factory()->create();

        $response = $this->deleteJson("/api/admin/users/{$user->id}");
        
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Usuario eliminado con éxito']);
        
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_cannot_delete_nonexistent_user()
    {
        $admin = $this->createAdminUser();
        Sanctum::actingAs($admin);

        $response = $this->deleteJson('/api/admin/users/9999');
        $response->assertStatus(404);
    }
}
