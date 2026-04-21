<?php

namespace App\Helpers;

use DivisionByZeroError;
use InvalidArgumentException;

class NumberHelper
{
    public static function validateIsNumeric(mixed $mixed): void
    {
        if (! is_numeric($mixed)) {
            throw new InvalidArgumentException("Value must be numeric.");
        }
    }

    public static function validateNumericStringFormat(mixed $mixed): void
    {
        if (!preg_match('/^-?\d+(\.\d+)?$/', $mixed)) {
            throw new InvalidArgumentException("Invalid numeric format.");
        }
    }

    public static function validateNotZero(mixed $mixed): void
    {
        if (bccomp($mixed, '0') === 0) {
            throw new DivisionByZeroError("Division by zero.");
        }
    }

    public static function validateOperandsFormat(string $num1, string $num2): void
    {
        self::validateNumericStringFormat($num1);
        self::validateNumericStringFormat($num2);
    }
}
