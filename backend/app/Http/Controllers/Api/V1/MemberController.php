<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    private function authorizeMemberManager(): void
    {
        abort_unless(
            auth()->user()?->hasAnyRole([
                RoleEnum::Admin->value,
                RoleEnum::Accounting->value,
            ]),
            403,
            'You are not allowed to manage members.'
        );
    }

    public function index()
    {
        $this->authorizeMemberManager();

        return response()->json(Member::latest()->get());
    }

    public function store(Request $request)
    {
        $this->authorizeMemberManager();

        $validated = $request->validate([
            'member_no' => ['required', 'string', 'max:255', Rule::unique('members', 'member_no')],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:50'],
            'civil_status' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', Rule::requiredIf($request->boolean('create_account')), 'email', 'max:255', Rule::unique('members', 'email'), Rule::unique('users', 'email')],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'employment_status' => ['nullable', 'string', 'max:100'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'share_capital' => ['nullable', 'numeric', 'min:0'],
            'total_contribution' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
            'create_account' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $createAccount = (bool) ($validated['create_account'] ?? false);
        $password = $validated['password'] ?? null;
        unset($validated['create_account'], $validated['password']);

        $member = Member::create($validated);

        if ($createAccount) {

            $user = User::create([
                'email' => $member->email,

                'password' => Hash::make(
                    $password ?? Str::password(16)
                ),
            ]);

            if (method_exists($user, 'assignRole')) {
                $user->assignRole(RoleEnum::Member->value);
            }

            $member->update([
                'user_id' => $user->id,
            ]);

            Password::sendResetLink([
                'email' => $user->email,
            ]);
        }

        return response()->json($member, 201);
    }

    public function show(Member $member)
    {
        $this->authorizeMemberManager();

        return response()->json($member);
    }

    public function update(Request $request, Member $member)
    {
        $this->authorizeMemberManager();

        $validated = $request->validate([
            'member_no' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('members', 'member_no')->ignore($member->id)],
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:50'],
            'civil_status' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('members', 'email')->ignore($member->id)],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'employment_status' => ['nullable', 'string', 'max:100'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'share_capital' => ['nullable', 'numeric', 'min:0'],
            'total_contribution' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $member->update($validated);

        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        $this->authorizeMemberManager();

        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully',
        ]);
    }

    public function sendPasswordSetup(Member $member)
    {
        $this->authorizeMemberManager();

        $user = $member->user_id
            ? User::find($member->user_id)
            : User::where('email', $member->email)->first();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'This member does not have a login account yet.',
            ], 422);
        }

        $status = Password::sendResetLink([
            'email' => $user->email,
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => false,
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password setup link sent successfully.',
        ]);
    }
}
