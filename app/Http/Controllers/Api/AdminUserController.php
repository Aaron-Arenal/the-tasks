<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function getAllUsers()
    {
        try {
            $users = User::all();

            return response()->json([
                'data' => UserResource::collection($users),
                'message' => 'Lista de usuarios obtenida con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los usuarios: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserById($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            return response()->json([
                'data' => new UserResource($user),
                'message' => 'Usuario obtenido con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    public function editUser(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users',
            'role' => 'sometimes|required|in:admin,user'
        ]);

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            $user->update($request->only(['name', 'email', 'role']));

            return response()->json([
                'data' => new UserResource($user),
                'message' => 'Usuario actualizado con éxito'
            ], 200);
        } catch(\Exception $e) {
            return response()->json([
                'message' => 'Error al editar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            $user->delete();

            return response()->json([
                'message' => 'Usuario eliminado con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar usuario: ' . $e->getMessage()
            ], 500);
        }
    }
}
