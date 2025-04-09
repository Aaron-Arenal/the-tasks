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
}
