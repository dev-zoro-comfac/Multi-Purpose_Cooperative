<?php

namespace App\Http\Requests\User;

use App\Enums\GenderEnum;
use App\Rules\LettersAndSpaceOnly;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'first_name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'last_name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'contact_number' => [
                'required',
                'string',
                // 'regex:/^(09|\+639)\d{9}$/',
                'min:11',
                'max:13'
            ],

            'gender' => [
                'nullable',
                Rule::in(array_map(fn($case) => $case->value, GenderEnum::cases())),
            ],

            'roles' => [
                'required',
                'array',
                'min:1'
            ],

            'roles.*' => [
                'required',
                Rule::exists('roles', 'name'),
            ],

            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
            ],

            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->numbers()->symbols()
            ],
        ];
    }
}
