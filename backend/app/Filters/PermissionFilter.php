<?php

namespace App\Filters;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class PermissionFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereHas('roles.permissions', function (Builder $query) use ($value) {
            $query->where('name', 'LIKE', "%{$value}%");
        });
    }
}
