<?php


namespace App\Filters;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class FullnameFilter implements Filter
{
    public function __construct(protected ?string $alias = null) {}

    public function __invoke(Builder $query, $value, string $property): Builder
    {
        $alias = $this->alias ?? $this->resolveProfileAlias($property);

        return $query->where(function ($query) use ($alias, $value) {
            $query->where("{$alias}.first_name", 'LIKE', "%{$value}%")
                ->orWhere("{$alias}.middle_name", 'LIKE', "%{$value}%")
                ->orWhere("{$alias}.last_name", 'LIKE', "%{$value}%")
                ->orWhereRaw("CONCAT_WS(' ', {$alias}.first_name, {$alias}.middle_name) LIKE ?", ["%{$value}%"])
                ->orWhereRaw("CONCAT_WS(' ', {$alias}.middle_name, {$alias}.last_name) LIKE ?", ["%{$value}%"])
                ->orWhereRaw("CONCAT_WS(' ', {$alias}.first_name, {$alias}.last_name) LIKE ?", ["%{$value}%"])
                ->orWhereRaw("CONCAT_WS(' ', {$alias}.first_name, {$alias}.middle_name, {$alias}.last_name) LIKE ?", ["%{$value}%"]);
        });
    }

    protected function resolveProfileAlias(string $property): string
    {
        return match ($property) {
            default => 'profiles', // fallback
        };
    }
}
