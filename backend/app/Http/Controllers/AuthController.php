<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
                    'message' => 'The provided credentials do not match our records.'
                ],
                401
            );
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully!'
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully!'
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

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'data' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->profile->full_name,
                'permissions' => $permissions,
                'roles' => $roles,
            ]
        ], 200);
    }
}
