<?php

namespace App\Helpers;

class ConversionHelper
{
    public const HUNDRED_CONVERSION_FACTOR = '100';

    public static function multipleByHundred(string $amount): string
    {
        return bcmul($amount, self::HUNDRED_CONVERSION_FACTOR);
    }

    public static function divideByHundred(string $amount): string
    {
        return bcdiv($amount, self::HUNDRED_CONVERSION_FACTOR);
    }

    public static function divideByHundredCastToFloat(string $amount): float
    {
        return (float) self::divideByHundred($amount);
    }

    public static function multipleByHundredCastToFloat(string $amount): float
    {
        return (float) self::multipleByHundred($amount);
    }
}
