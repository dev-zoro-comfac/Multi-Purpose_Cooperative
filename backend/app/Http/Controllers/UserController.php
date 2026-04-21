<?php

namespace App\Http\Controllers;

use App\Enums\Permissions\UserPermissionEnum;
use App\Http\Requests\User\ImportUserRequest;
use App\Services\UserService;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\ListUsersRequest;
use App\Http\Requests\User\UpdateUserPasswordRequest;
use App\Http\Requests\User\UpdateUserRoleRequest;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Middleware\PermissionMiddleware;

class UserController extends Controller implements HasMiddleware
{
    public function __construct(private UserService $userService) {}

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::ViewMany->value), only: ['index', 'infiniteList']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::ViewOptions->value), only: ['listOptions']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::Create->value), only: ['store']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::Update->value), only: ['update', 'updateRole', 'updatePassword']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::SoftDelete->value), only: ['destroy']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::Restore->value), only: ['restore']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::Import->value), only: ['import', 'downloadImportTemplate']),
            new Middleware(PermissionMiddleware::using(UserPermissionEnum::Export->value), only: ['export', 'downloadExportFile']),
        ];
    }

    public function index(
        ListUsersRequest $request
    ) {
        $authenticatedUser = User::findOrFail(Auth::id());

        $validatedData = $request->validated();

        return $this->userService->list(
            $validatedData['page'] ?? 1,
            $validatedData['per_page'] ?? 30,
            $authenticatedUser
        );
    }

    public function infiniteList(
        ListUsersRequest $request
    ) {
        $validated = $request->validated();

        $users = $this->userService->infiniteList(
            $validated['page'] ?? 1,
            $validated['per_page'] ?? 30
        );

        return response()->json(
            [
                'success' => true,
                'message' => 'Users fetched successfully',
                'data' => $users
            ],
            200
        );
    }

    public function listOptions()
    {
        $users = $this->userService->listOptions();

        return response()->json(
            [
                'success' => true,
                'message' => 'Users fetched successfully',
                'data' => $users
            ],
            200
        );
    }

    public function store(
        StoreUserRequest $request
    ) {
        $authenticatedUser = User::find(Auth::id());

        $validatedData = $request->validated();

        return $this->userService->store(
            $validatedData,
            $authenticatedUser
        );
    }

    public function show(
        User $user
    ) {
        $authenticatedUser = User::find(Auth::id());

        return $this->userService->show(
            $user,
            $authenticatedUser
        );
    }

    public function update(
        UpdateUserRequest $request,
        User $user
    ) {
        $authenticatedUser = User::find(Auth::id());

        $validatedData = $request->validated();

        return $this->userService->update(
            $user,
            $validatedData,
            $authenticatedUser
        );
    }

    public function updatePassword(
        UpdateUserPasswordRequest $request,
        User $user
    ) {
        $authenticatedUser = User::find(Auth::id());

        $validatedData = $request->validated();

        return $this->userService->update(
            $user,
            $validatedData,
            $authenticatedUser
        );
    }

    public function updateRole(
        UpdateUserRoleRequest $request,
        User $user
    ) {
        $authenticatedUser = User::find(Auth::id());

        $validatedData = $request->validated();

        return $this->userService->update(
            $user,
            $validatedData,
            $authenticatedUser
        );
    }

    public function destroy(
        User $user
    ) {
        $authenticatedUser = User::find(Auth::id());

        return $this->userService->destroy(
            $user,
            $authenticatedUser
        );
    }

    public function restore(
        string $userId,
    ) {
        $authenticatedUser = User::find(Auth::id());

        return $this->userService->restore(
            $userId,
            $authenticatedUser
        );
    }

    public function import(
        ImportUserRequest $request
    ) {
        $authenticatedUser = User::find(Auth::id());

        $validated = $request->validated();

        $this->userService->import($validated['users'], $authenticatedUser);

        return response()->json([
            'success' => true,
            'message' => 'Import started. You will be notified when the file is finished processing.'
        ], 200);
    }

    public function export()
    {
        $authenticatedUser = User::find(Auth::id());

        $this->userService->export($authenticatedUser);

        return response()->json([
            'success' => true,
            'message' => 'Export started. You will be notified when the file is ready to download.'
        ], 200);
    }

    public function downloadExportFile(string $filename)
    {
        return $this->userService->downloadExportFile($filename);
    }

    public function downloadImportTemplate()
    {
        return $this->userService->downloadImportTemplate();
    }
}
