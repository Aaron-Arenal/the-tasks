<?php

namespace App\Enums;

enum TaskCategory: string
{
    case WORK = 'trabajo';
    case STUDY = 'estudio';
    case HOME = 'casa';
    case PERSONAL = 'personal';
    case FINANCE = 'finanzas';
    case HEALTH = 'salud';
    case TRAVEL = 'viaje';
    case SOCIAL = 'social';
    case TECHNOLOGY = 'tecnología';

    public function label(): string {
        return ucfirst($this->value);
    }

    public static function values(): array {
        return array_column(self::cases(), 'value');
    }
}
