<?php

namespace App\Http\Controllers\Api;

use App\Enums\TaskCategory;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->search;
            $status = $request->status;
            $category = $request->category;
            $isUrgent = $request->is_urgent === 'true' ? true : false;

            $query = Auth::user()->tasks();
            $searchTerms = explode(' ', $search);
            $fields = ['title', 'description'];

            $query->when($request->filled('search'), function ($q) use ($searchTerms, $fields) {
                foreach ($searchTerms as $term) {
                    $q->where(function ($innerQuery) use ($term, $fields) {
                        foreach ($fields as $field) {
                            $innerQuery->orWhereRaw("LOWER(tasks.$field) LIKE ?", ['%' . strtolower($term) . '%']);
                        }
                    });
                }
            })
            ->when($request->filled('status'), function($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($request->filled('category'), function($q) use ($category) {
                $q->where('category', $category);
            })
            ->when($request->filled('is_urgent'), function($q) use ($isUrgent) {
                $q->where('is_urgent', $isUrgent);
            });

            $query->orderBy('is_urgent', 'desc');

            $tasks = $query->get();

            return response()->json([
                'data' => TaskResource::collection($tasks),
                'message' => 'Lista de tareas obtenida con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener tareas: ' . $e->getMessage() . ' ' . $e->getLine(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $task = Auth::user()->tasks()->find($id);

            if (!$task || $task->user_id !== Auth::user()->id) {
                return response()->json([
                    'message' => 'Tarea no encontrada o sin acceso'
                ], 404);
            }

            return response()->json([
                'data' => new TaskResource($task),
                'message' => 'Tarea obtenida con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la tarea: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => ['required', Rule::in(TaskStatus::values())],
            'is_urgent' => 'nullable|boolean',
            'category' => ['required', Rule::in(TaskCategory::values())]
        ]);

        try {
            $task = Auth::user()->tasks()->create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'due_date' => $request->input('due_date'),
                'status' => $request->input('status'),
                'is_urgent' => $request->input('is_urgent'),
                'category' => $request->input('category')
            ]);

            return response()->json([
                'data' => new TaskResource($task),
                'message' => 'Tarea creada con éxito'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la tarea: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'due_date' => 'sometimes|date',
            'status' => ['sometimes', Rule::in(TaskStatus::values())],
            'is_urgent' => 'sometimes|boolean',
            'category' => ['sometimes', Rule::in(TaskCategory::values())]
        ]);

        try {
            $task = Auth::user()->tasks()->find($id);

            if (!$task || $task->user_id !== Auth::user()->id) {
                return response()->json([
                    'message' => 'Tarea no encontrada o sin acceso'
                ], 404);
            }

            $task->update($request->only([
                'title',
                'description',
                'due_date',
                'status',
                'is_urgent',
                'category' 
            ]));

            return response()->json([
                'data' => new TaskResource($task),
                'message' => 'Tarea actualizada con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la tarea: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $task = Auth::user()->tasks()->find($id);

            if (!$task || $task->user_id !== Auth::user()->id) {
                return response()->json([
                    'message' => 'Tarea no encontrada o sin acceso'
                ], 404);
            }

            $task->delete();

            return response()->json([
                'message' => 'Tarea eliminada con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la tarea: ' . $e->getMessage()
            ], 500);
        }
    }

    public function summary()
    {
        try {
            $tasks = Auth::user()->tasks;

            $totalTasks = $tasks->count();
            $completedTasks = $tasks->where('status', TaskStatus::COMPLETED)->count();
            $inProgressTasks = $tasks->where('status', TaskStatus::IN_PROGRESS)->count();
            $pendingTasks = $tasks->where('status', TaskStatus::PENDING)->count();
            $urgentTasks = $tasks->where('is_urgent', true)->count();

            $categories = TaskCategory::cases();
            $categoryCounts = [];
            foreach ($categories as $category) {
                $categoryCounts[$category->value] = $tasks->where('category', $category->value)->count();
            }

            return response()->json([
                'data'=> [
                    'total_tasks' => $totalTasks,
                    'completed_tasks' => $completedTasks,
                    'in_progress_tasks' => $inProgressTasks,
                    'pending_tasks' => $pendingTasks,
                    'urgent_tasks' => $urgentTasks,
                    'category_counts' => $categoryCounts
                ],
                'message' => 'Resumen de tareas obtenido exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los datos: ' . $e->getMessage()
            ], 500);
        }
    }
}
