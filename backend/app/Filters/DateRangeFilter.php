<?php

namespace App\Filters;

use Exception;
use Carbon\Carbon;
use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class DateRangeFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $unmatchableDate = Carbon::create(9999, 12, 31);

        if (is_string($value)) {

            try {
                $startDate = Carbon::parse(trim($value))->startOfDay();
                $query->where($property, '>=', $startDate->toDateString());
            } catch (Exception $e) {
                $query->where($property, '>=', $unmatchableDate->toDateString());
            }
        } elseif (is_array($value) && count($value) === 2) {
            $startDate = null;
            $endDate = null;

            try {
                $startDate = !empty($value[0]) ? Carbon::parse(trim($value[0]))->startOfDay() : null;
                $endDate = !empty($value[1]) ? Carbon::parse(trim($value[1]))->endOfDay() : null;
            } catch (Exception $e) {
            }


            if (!$startDate && !$endDate) {
                $query->where($property, '>=', $unmatchableDate->toDateString());
            } elseif ($startDate && $endDate) {
                $query->whereBetween($property, [$startDate, $endDate]);
            } elseif ($startDate) {
                $query->where($property, '>=', $startDate);
            } elseif ($endDate) {
                $query->where($property, '<=', $endDate);
            }
        } else {
            $query->where($property, '>=', $unmatchableDate->toDateString());
        }
    }
}
