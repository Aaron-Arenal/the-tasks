<?php

namespace App\Enums;

enum TaskStatus: string
{
    case PENDING = 'pendiente';
    case IN_PROGRESS = 'en progreso';
    case COMPLETED = 'completada';

    public function label(): string {
        return ucfirst($this->value);
    }

    public static function values(): array {
        return array_column(self::cases(), 'value');
    }
}
