<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class PermissionFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereHas('roles.permissions', function (Builder $query) use ($value) {
            $query->where('name', 'LIKE', "%{$value}%");
        });
    }
}
