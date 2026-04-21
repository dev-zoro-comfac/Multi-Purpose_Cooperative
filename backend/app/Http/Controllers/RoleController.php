<?php

namespace App\Http\Controllers;

use Exception;
use App\Services\RoleService;
use App\Enums\RoleEnum;
use App\Enums\Permissions\RolePermissionEnum;
use App\Http\Requests\Role\UpdateRoleRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Spatie\Permission\Middleware\PermissionMiddleware;


class RoleController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware(PermissionMiddleware::using(RolePermissionEnum::ViewOne->value), only: ['show']),
            new Middleware(PermissionMiddleware::using(RolePermissionEnum::ViewMany->value), only: ['index']),
            new Middleware(PermissionMiddleware::using(RolePermissionEnum::Create->value), only: ['store']),
            new Middleware(PermissionMiddleware::using(RolePermissionEnum::Update->value), only: ['update']),
            new Middleware(PermissionMiddleware::using(RolePermissionEnum::HardDelete->value), only: ['destroy']),
        ];
    }

    public function index(
        Request $request,
        RoleService $roleService
    ) {
        $isSuperAdmin = $request->user()->hasRole(RoleEnum::SuperAdmin->value);

        $roles = $roleService->list($isSuperAdmin);

        return response()->json(
            [
                'success' => true,
                'message' => 'Roles fetched successfully',
                'data' => $roles
            ],
            200
        );
    }

    public function store(
        Request $request,
        RoleService $roleService
    ) {

        try {
            $validated = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:roles,name'
                ]
            ]);

            $role = $roleService->storeOrFail($validated['name']);

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Role created successfully',
                    'data' => $role
                ],
                201
            );
        } catch (Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage(),
                ],
                400
            );
        }
    }

    public function show(
        string $roleId,
        RoleService $roleService
    ) {

        $role = $roleService->showOrFail($roleId);

        return response()->json(
            [
                'success' => true,
                'message' => 'Role fetched successfully',
                'data' => $role
            ],
            200
        );
    }

    public function update(
        UpdateRoleRequest $request,
        string $roleId,
        RoleService $roleService
    ) {
        $validated = $request->validated();

        $roleService->updateOrFail(
            $validated,
            $roleId
        );

        return response()->json(
            [
                'success' => true,
                'message' => 'Role updated successfully',
            ],
            200
        );
    }

    public function destroy(
        string $roleId,
        RoleService $roleService
    ) {
        $roleService->destroyOrFail($roleId);

        return response()->json(
            [
                'success' => true,
                'message' => 'Role deleted successfully',
            ],
            200
        );
    }
}
