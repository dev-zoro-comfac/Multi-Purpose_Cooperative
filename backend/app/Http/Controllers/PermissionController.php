<?php

namespace App\Http\Controllers;

use App\Enums\Permissions\PermissionPermissionEnum;
use App\Models\Permission;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware(PermissionMiddleware::using(PermissionPermissionEnum::ViewOne->value), only: ['show']),
            new Middleware(PermissionMiddleware::using(PermissionPermissionEnum::ViewMany->value), only: ['index']),
        ];
    }
    public function index()
    {
        $permissions = QueryBuilder::for(Permission::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
            ])
            ->defaultSort('name')
            ->allowedSorts([
                AllowedSort::field('name'),
                AllowedSort::field('category'),
            ])
            ->get();

        return response()->json(
            [
                'success' => true,
                'message' => 'Permissions fetched successfully',
                'data' => $permissions
            ],
            200
        );
    }

    public function show(Permission $permission)
    {
        return response()->json([
            'success' => true,
            'message' => 'Permission fetched successfully',
            'data' => $permission
        ]);
    }
}
