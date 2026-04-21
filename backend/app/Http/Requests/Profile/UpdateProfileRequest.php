<?php

namespace App\Http\Requests\Profile;

use App\Enums\GenderEnum;
use App\Rules\LettersAndSpaceOnly;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => [
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
                'string',
                'min:2',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'contact_number' => [
                'string',
                'regex:/^(09|\+639)\d{9}$/',
                'min:11',
                'max:13'
            ],

            'gender' => [
                'nullable',
                Rule::in(array_map(fn($case) => $case->value, GenderEnum::cases())),
            ],
        ];
    }
}
