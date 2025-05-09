<?php

namespace App\Models;

use App\Enums\TaskCategory;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'is_urgent',
        'category',
        'user_id'
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_urgent' => 'boolean',
        'user_id' => 'integer',
        'status' => TaskStatus::class,
        'category' => TaskCategory::class
    ];

    protected static function booted()
    {
        static::updating(function ($task) {
            if ($task->isDirty(['due_date', 'status'])) {
                $task->is_urgent = $task->due_date !== null 
                    && $task->due_date <= now()->addHours(48)
                    && $task->status !== TaskStatus::COMPLETED;
            }
        });

        static::creating(function ($task) {
            $task->is_urgent = $task->due_date !== null 
                    && $task->due_date <= now()->addHours(48)
                    && $task->status !== TaskStatus::COMPLETED;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
