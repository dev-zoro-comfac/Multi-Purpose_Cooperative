<?php

namespace App\Helpers;

use InvalidArgumentException;

class ArrayHelper
{
    public static function validateNotEmptyArray(array $arr): void
    {
        if (empty($arr)) {
            throw new InvalidArgumentException("Array must not be empty.");
        }
    }

    public static function validateArrayIsNumeric(array $arr): void
    {
        foreach ($arr as $value) {
            NumberHelper::validateNumericStringFormat($value);
        }
    }
    
    public static function validateNotEmptyNumericArray(array $arr): void
    {
        self::validateNotEmptyArray($arr);
        self::validateArrayIsNumeric($arr);
    }
}
