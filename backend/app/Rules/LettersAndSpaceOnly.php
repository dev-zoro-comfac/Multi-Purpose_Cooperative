<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class LettersAndSpaceOnly implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !preg_match('/^[\p{L}\s]+$/u', $value)) {
            $fail('The :attribute may only contain letters and spaces.');
        }
    }
}
