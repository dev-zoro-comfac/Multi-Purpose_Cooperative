<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UpdateUserPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $authenticatedUser = User::findOrFail(Auth::user()->id);

        $isAdmin = $authenticatedUser->hasRole('admin');

        return [
            'current_password' => [
                $isAdmin ? 'nullable' : 'required',
            ],

            'password' => [
                'string',
                'required',
                'confirmed',
                Password::min(8)->letters()->numbers()->symbols(),
            ],
        ];
    }
}
