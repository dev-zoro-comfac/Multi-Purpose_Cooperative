<?php

namespace App\Rules;

use App\Helpers\DateHelper;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDate implements ValidationRule
{
    public function __construct(private string $format = 'Y-m-d') {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!DateHelper::isValidDate($value, $this->format)) {
            $fail("The {$attribute} must be a valid date");
        }
    }
}
