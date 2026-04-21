<?php

namespace App\Http\Resources;

use App\Enums\Permissions\PermissionPermissionEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $canViewProtectedData = $request->user()?->can(PermissionPermissionEnum::ViewProtectedData->value) ?? false;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'guard_name' => $this->when($canViewProtectedData, $this->guard_name),
            'created_at' => $this->when($canViewProtectedData, $this->created_at),
            'updated_at' => $this->when($canViewProtectedData, $this->updated_at),
            'deleted_at' => $this->when($canViewProtectedData, $this->deleted_at),
        ];
    }
}
