<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->ignore($this->route('role')),
            ],
            'permissions' => [
                'nullable',
                'array'
            ],
            'permissions.*' => [
                'required',
                'string',
                'exists:permissions,name'
            ],
        ];
    }
}
