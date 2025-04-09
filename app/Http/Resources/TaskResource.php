<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category->label(),
            'status' => $this->status->label(),
            'due_date' => $this->due_date,
            'created_at' => $this->created_at,
            'is_urgent' => $this->is_urgent
        ];
    }
}
