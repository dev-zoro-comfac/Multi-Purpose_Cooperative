<?php

namespace App\Helpers;

use Carbon\Carbon;
use Exception;

class DateHelper
{
    public static function isValidDate($date, $format = 'Y-m-d')
    {
        try {
            $carbonDate = Carbon::createFromFormat($format, $date);
            return $carbonDate->format($format) === $date;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function getTimesFromDateTimeString(string $dateTimeString): array
    {
        $date = Carbon::parse($dateTimeString);

        return [
            $date->hour,
            $date->minute,
            $date->second
        ];
    }

    public static function toISo8601String($date): ?string
    {
        if ($date instanceof Carbon) {
            return $date->toIso8601String();
        } elseif (is_string($date)) {
            try {
                return Carbon::parse($date)->toIso8601String();
            } catch (Exception $e) {
                return null;
            }
        }

        return null;
    }
}
