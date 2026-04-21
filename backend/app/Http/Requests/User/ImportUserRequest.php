<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ImportUserRequest extends FormRequest
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
        return  [
            'users' => 'required|file|mimes:xlsx,csv|max:10240'
        ];
    }

    public function messages(): array
    {
        return [
            'users.required' => 'Please upload a file.',
            'users.file' => 'The uploaded file is invalid.',
            'users.mimes' => 'The file must be an Excel or CSV file.',
            'users.max' => 'The file size cannot exceed 10 MB.',
        ];
    }
}
