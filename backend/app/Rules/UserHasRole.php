<?php

namespace App\Rules;

use Closure;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;

class UserHasRole implements ValidationRule
{
    protected array $requiredRoles;

    /**
     * Accepts either a string or an array of roles.
     *
     * @param  string|array  $roles
     */
    public function __construct(string|array $roles)
    {
        $this->requiredRoles = is_array($roles) ? $roles : [$roles];
    }

    /**
     * Validation logic.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::find($value);

        if (!$user || $user == null) {
            $fail("The selected user does not exist.");
            return;
        }

        if ($user->hasRole('super-admin')) {
            return;
        }

        if (!$user || !$user->hasAnyRole($this->requiredRoles)) {
            $fail("The selected user must have one of the following roles: " . implode(', ', $this->requiredRoles) . ".");
        }
    }
}
