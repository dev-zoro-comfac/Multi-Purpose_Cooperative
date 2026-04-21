<?php

namespace App\Services;

use App\Enums\RoleEnum;
use App\Exports\UserImportTemplate;
use App\Exports\UsersExport;
use App\Models\User;
use App\Filters\RoleFilter;
use App\Filters\DateRangeFilter;
use App\Filters\FullnameFilter;
use App\Filters\PermissionFilter;
use App\Http\Resources\UserInfiniteResource;
use App\Http\Resources\UserResource;
use App\Imports\UsersFirstSheetImport;
use App\Imports\UsersImport;
use App\Jobs\User\NotifyUserExportStatus;
use App\Policies\UserPolicy;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\QueryBuilderRequest;

class UserService
{
    const DEFAULT_PAGE = 1;
    const DEFAULT_PER_PAGE = 10;

    public function __construct(
        protected UserPolicy $userPolicy,
    ) {}

    public function listQuery($customQuery = null)
    {
        if ($customQuery) {
            $customRequest = app(QueryBuilderRequest::class)->merge($customQuery);
        }

        $query = QueryBuilder::for(User::class, $customRequest ?? request())
            ->allowedIncludes([
                'profile',
                'roles',
                'permissions',
            ])
            ->allowedFilters([
                AllowedFilter::partial('id'),
                AllowedFilter::partial('email'),
                AllowedFilter::partial('last_name', 'profiles.last_name'),
                AllowedFilter::custom('full_name', new FullnameFilter()),
                AllowedFilter::partial('first_name', 'profiles.first_name'),
                AllowedFilter::partial('middle_name', 'profiles.middle_name'),
                AllowedFilter::partial('contact_number', 'profiles.contact_number'),
                AllowedFilter::custom('created_on', new DateRangeFilter, 'users.created_at'),
                AllowedFilter::custom('updated_on', new DateRangeFilter, 'users.updated_at'),
                AllowedFilter::custom('deleted_on', new DateRangeFilter, 'users.deleted_at'),
                AllowedFilter::custom('role', new RoleFilter()),
                AllowedFilter::custom('permission', new PermissionFilter()),
                AllowedFilter::trashed()
            ])
            ->defaultSort('-updated_at')
            ->allowedSorts([
                AllowedSort::field('email', 'email'),
                AllowedSort::field('created_on', 'created_at'),
                AllowedSort::field('updated_on', 'updated_at'),
                AllowedSort::field('deleted_on', 'deleted_at'),
                AllowedSort::field('first_name',  'profiles.first_name'),
                AllowedSort::field('middle_name',  'profiles.middle_name'),
                AllowedSort::field('contact_number',  'profiles.contact_number'),
                AllowedSort::field('last_name',  'profiles.last_name'),
            ])
            ->select('users.*')
            ->leftJoin('profiles', 'profiles.user_id', '=', 'users.id');

        return $query;
    }

    public function list(
        int $page = self::DEFAULT_PAGE,
        int $perPage = self::DEFAULT_PER_PAGE,
        User $requester
    ) {
        $customRequest = request()->query();

        $users = $this
            ->listQuery($customRequest)
            ->paginate(
                perPage: $perPage,
                page: $page
            );

        $users = UserResource::collection($users)
            ->response()
            ->getData(true);

        return response()->json([
            'success' => true,
            'message' => 'Users fetched successfully.',
            'data' => $users
        ]);
    }

    public function infiniteList(
        int $page = self::DEFAULT_PAGE,
        int $perPage = self::DEFAULT_PER_PAGE,
    ) {
        $users = QueryBuilder::for(User::class)
            ->allowedFilters([
                AllowedFilter::partial('id'),
                AllowedFilter::custom('full_name', new FullnameFilter()),

                AllowedFilter::custom('role', new RoleFilter()),
                AllowedFilter::custom('permission', new PermissionFilter()),
                AllowedFilter::trashed()
            ])
            ->defaultSort('first_name')
            ->allowedSorts([
                AllowedSort::field('first_name',  'profiles.first_name'),
                AllowedSort::field('middle_name',  'profiles.middle_name'),
                AllowedSort::field('last_name',  'profiles.last_name'),
            ])
            ->selectRaw("
                users.id as id,
                CONCAT(profiles.first_name, ' ', profiles.last_name) as full_name
            ")
            ->leftJoin('profiles', 'profiles.user_id', '=', 'users.id')
            ->paginate(
                perPage: $perPage,
                page: $page
            );

        return UserInfiniteResource::collection($users)
            ->response()
            ->getData(true);
    }

    public function listOptions()
    {
        return QueryBuilder::for(User::class)
            ->allowedFilters([
                AllowedFilter::custom('role', new RoleFilter()),
                AllowedFilter::custom('permission', new PermissionFilter()),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->whereRaw("CONCAT(profiles.first_name, ' ', profiles.last_name) LIKE ?", ["%{$value}%"])
                        ->orWhere('users.id', $value);
                }),
            ])
            ->defaultSort('first_name')
            ->selectRaw("users.id as id, CONCAT(profiles.first_name, ' ', profiles.last_name) as full_name")
            ->leftJoin('profiles', 'profiles.user_id', '=', 'users.id')
            ->limit(100)
            ->get();
    }

    public function show(
        User $user,
        User $requester
    ) {
        if (! $this->userPolicy->view($requester, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to view this user.',
            ], 403);
        }

        $user = QueryBuilder::for(User::class)
            ->allowedIncludes([
                'roles',
                'permissions',
                'profile',
            ])
            ->findOrFail($user->id);

        return response()->json([
            'success' => true,
            'message' => 'User fetched successfully.',
            'data' => new UserResource($user)
        ], 200);
    }

    public function store(
        array $data,
        User $requester
    ) {
        $roles = $data['roles'] ?? [];

        if (
            Arr::where(
                $roles,
                fn($role) => $role === RoleEnum::SuperAdmin->value
            ) &&
            ! $requester->hasRole(RoleEnum::SuperAdmin->value)
        ) {
            return [
                'success' => false,
                'message' => 'Insufficient permissions: You are not authorized to add a Super Admin.'
            ];
        }

        $user = DB::transaction(function () use ($data, $roles) {
            $createdUser = User::create(
                [
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                ]
            );

            $createdUser->profile()->create(
                Arr::only(
                    $data,
                    [
                        'first_name',
                        'middle_name',
                        'last_name',
                        'contact_number',
                        'gender'
                    ]
                )
            );

            $createdUser->syncRoles($roles);

            return $createdUser;
        });

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => new UserResource($user)
        ], 201);
    }


    public function update(
        User $user,
        array $data,
        User $requester
    ) {
        if (! $this->userPolicy->update($requester, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to update this user.',
            ], 403);
        }

        DB::transaction(function () use ($user, $data) {
            if (isset($data['roles'])) {
                $user->syncRoles($data['roles']);
            }

            if (isset($data['password'])) {
                $data['password_changed_at'] = now();
            }

            $user->updateOrFail($data);
        });

        $user->refresh();

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => new UserResource($user)
        ], 200);
    }


    public function destroy(
        User $user,
        User $requester
    ) {
        $user->deleteOrFail();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
            'data' => new UserResource($user)
        ], 200);
    }

    public function restore(
        string $userId,
        User $requester
    ) {
        $user = User::onlyTrashed()->findOrFail($userId);

        $user->restore();

        return response()->json([
            'success' => true,
            'message' => 'User restored successfully.',
            'data' => new UserResource($user)
        ], 200);
    }

    public function import($file, User $requester)
    {
        $userService = app(UserService::class);

        // return (new UsersImport)->import($file);
        return (new UsersFirstSheetImport($requester, $userService))->queue($file);
        // return (new SchedulesImport($authenticatedUserId, $userService))->queue($file);
    }

    public function export(User $requester)
    {
        $timestamp = date('Ymd_His');
        $filename = "users{$timestamp}.xlsx";
        $filepath = "exports/users/{$filename}";

        $userExport = new UsersExport($requester->id);

        return $userExport
            ->queue($filepath, 'private')
            ->chain([
                new NotifyUserExportStatus(
                    $requester->id,
                    $filename
                ),
            ]);
    }

    public function downloadExportFile(string $filename)
    {
        $filepath = "exports/users/{$filename}";

        if (!Storage::disk('private')->exists($filepath)) {
            return response()->json([
                'success' => false,
                'message' => 'File has already expired',
            ], 404);
        }

        $filepath = Storage::disk('private')->path($filepath);

        return response()->download($filepath);
    }

    public function downloadImportTemplate()
    {
        return (new UserImportTemplate)->download('user_import_template.xlsx');
    }
}
