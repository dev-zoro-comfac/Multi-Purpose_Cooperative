<?php

namespace App\Http\Resources;

use App\Enums\Permissions\UserPermissionEnum;
use App\Helpers\AuthHelper;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $authenticatedUser = User::find($request->user()->id);

        $isOwner = $authenticatedUser && $this->user_id === $authenticatedUser->id;

        $hasPermissionToViewProtectedData = $authenticatedUser->hasAnyPermission([
            UserPermissionEnum::ViewProtectedData->value,
            UserPermissionEnum::ViewOwn->value,
        ]);

        $canViewProtectedData = $isOwner || $hasPermissionToViewProtectedData;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'middle_name' => $this->middle_name,
            'gender' => $this->gender,
            'contact_number' => $this->contact_number,
            'created_at' => $this->when($canViewProtectedData, $this->created_at),
            'updated_at' => $this->when($canViewProtectedData, $this->updated_at),
            'deleted_at' => $this->when($canViewProtectedData, $this->deleted_at),
        ];
    }
}
