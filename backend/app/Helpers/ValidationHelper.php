<?php

namespace App\Helpers;

use App\Enums\DateFormat;
use Carbon\Carbon;
use InvalidArgumentException;

class ValidationHelper
{
    public static function isValidDateString(string $dateString, string $format)
    {
        if (! Carbon::hasFormat($dateString, $format)) {
            throw new InvalidArgumentException("Invalid date string format. Expected format: {$format}");
        }
    }

    public static function isValidTimeString(string $timeString)
    {
        self::isValidDateString($timeString, DateFormat::TIME_24H->value);
    }

    public static function isValidDateTimeString(string $dateTimeString)
    {
        self::isValidDateString($dateTimeString, DateFormat::DATETIME->value);
    }
}
