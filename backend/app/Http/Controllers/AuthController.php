<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'The provided credentials do not match our records.',
                ],
                401
            );
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully!',
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully!',
        ], 200);
    }

    public function authenticate(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 200);
        }

        $roles = $user->roles->pluck('name');
        $permissions = $user->getAllPermissions()->pluck('name');
        $member = Member::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'data' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->profile?->full_name ?? $user->email,
                'permissions' => $permissions,
                'roles' => $roles,
                'member' => $member ? [
                    'id' => $member->id,
                    'member_no' => $member->member_no,
                    'first_name' => $member->first_name,
                    'last_name' => $member->last_name,
                ] : null,
            ],
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => false,
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => __($status),
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->numbers()->symbols()],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                    'password_changed_at' => now(),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'success' => false,
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => __($status),
        ]);
    }
}
