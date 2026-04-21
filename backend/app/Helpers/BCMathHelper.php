<?php

namespace App\Helpers;

class BCMathHelper
{
    private const DEFAULT_ROUND_PRECISION = 2;

    public static function bcround_def(string $num): string
    {
        return bcround($num, self::DEFAULT_ROUND_PRECISION);
    }

    public static function bcmul_arr(array $numbers, ?int $scale = null): string
    {
        ArrayHelper::validateNotEmptyArray($numbers);

        $result = '1';

        $effectiveScale = $scale ?? bcscale();

        foreach ($numbers as $number) {
            $result = bcmul($result, (string) $number, $effectiveScale);
        }

        return $result;
    }


    public static function bcadd_arr(array $numbers,  ?int $scale = null): string
    {
        ArrayHelper::validateNotEmptyArray($numbers);

        $result = '0';

        $effectiveScale = $scale ?? bcscale();

        foreach ($numbers as $number) {
            $result = bcadd($result, (string) $number, $effectiveScale);
        }

        return $result;
    }
}
