<?php

namespace App\Filters;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class NumberRangeFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $unmatchableValue = PHP_INT_MAX;

        if (is_numeric($value)) {
            $query->where($property, '>=', $value);
        } elseif (is_array($value) && count($value) === 2) {
            $startValue = null;
            $endValue = null;

            if (!empty($value[0]) && is_numeric($value[0])) {
                $startValue = $value[0];
            }
            if (!empty($value[1]) && is_numeric($value[1])) {
                $endValue = $value[1];
            }

            if (!$startValue && !$endValue) {
                $query->where($property, '>=', $unmatchableValue);
            } elseif ($startValue && $endValue) {
                $query->whereBetween($property, [$startValue, $endValue]);
            } elseif ($startValue) {
                $query->where($property, '>=', $startValue);
            } elseif ($endValue) {
                $query->where($property, '<=', $endValue);
            }
        } else {
            $query->where($property, '>=', $unmatchableValue);
        }
    }
}
