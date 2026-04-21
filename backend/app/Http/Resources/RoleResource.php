<?php

namespace App\Http\Resources;

use App\Enums\Permissions\RolePermissionEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $authenticatedUser = User::find($request->user()->id);

        $canViewProtectedData = $authenticatedUser->hasAnyPermission([
            RolePermissionEnum::ViewProtectedData->value,
            RolePermissionEnum::ViewOwn->value,
        ]);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->when($canViewProtectedData, $this->guard_name),
            'created_at' => $this->when($canViewProtectedData, $this->created_at),
            'updated_at' => $this->when($canViewProtectedData, $this->updated_at),
            'deleted_at' => $this->when($canViewProtectedData, $this->deleted_at),
            'permissions' => PermissionResource::collection($this->whenLoaded('permissions')),
        ];
    }
}
