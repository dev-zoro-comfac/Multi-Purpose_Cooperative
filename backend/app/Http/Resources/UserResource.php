<?php

namespace App\Http\Resources;

use App\Enums\Permissions\UserPermissionEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $authenticatedUser = User::find($request->user()->id);

        $isOwner = $authenticatedUser && $this->id === $authenticatedUser->id;

        $hasPermissionToViewProtectedData = $authenticatedUser->hasAnyPermission([
            UserPermissionEnum::ViewProtectedData->value,
            UserPermissionEnum::ViewOwn->value,
        ]);

        $canViewProtectedData = $isOwner || $hasPermissionToViewProtectedData;

        return [
            'id' => $this->id,
            'email' => $this->email,
            'email_verified_at' => $this->when($canViewProtectedData, $this->email_verified_at),
            'password_changed_at' => $this->when($canViewProtectedData, $this->password_changed_at),
            'created_at' => $this->when($canViewProtectedData, $this->created_at),
            'updated_at' => $this->when($canViewProtectedData, $this->updated_at),
            'deleted_at' => $this->when($canViewProtectedData, $this->deleted_at),
            'deleted_by' => $this->when($canViewProtectedData, $this->deleted_by),

            'profile' => new ProfileResource($this->whenLoaded('profile')),
            'roles' => $this->whenLoaded(
                'roles',
                fn() => RoleResource::collection($this->whenLoaded('roles'))
            ),
            'permissions' => $this->whenLoaded(
                'permissions',
                fn() => PermissionResource::collection($this->getAllPermissions())
            ),
        ];
    }
}
