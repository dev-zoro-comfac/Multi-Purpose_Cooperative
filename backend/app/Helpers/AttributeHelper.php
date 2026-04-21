<?php

namespace App\Helpers;

use App\Enums\DateFormat;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class AttributeHelper
{
    public static function scaleByHundred(): Attribute
    {
        return Attribute::make(
            get: fn($value) => (float) ConversionHelper::divideByHundred((string) $value),
            set: fn($value) => (int) ConversionHelper::multipleByHundred((string) $value)
        );
    }

    public static function toHumanReadableTimeFormat(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value)->format(DateFormat::DATETIME_HUMAN_A->value) : null
        );
    }

    public static function toHumanReadableTimeDiffFormat(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value)->diffForHumans() : null
        );
    }
}
