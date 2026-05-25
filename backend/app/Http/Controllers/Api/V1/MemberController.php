<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return response()->json(Member::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
          'member_no' => 'required|unique:members',
          'first_name' => 'required',
          'last_name' => 'required',

          'email' => 'nullable|email|unique:users,email',
          'create_account' => 'nullable|boolean',
          'password' => 'nullable|min:6',
        ]);

        $member = Member::create([
            ...$request->all(),
            ...$validated,
        ]);

        if ($request->boolean('create_account')) {

        $user = User::create([
        ' name' =>
            $member->first_name . ' ' . $member->last_name,

        'email' => $request->email,

        'password' => Hash::make(
            $request->password ?? 'password123'
        ),
    ]);

    if (method_exists($user, 'assignRole')) {
        $user->assignRole('member');
    }

    $member->update([
        'user_id' => $user->id,
    ]);
}

        return response()->json($member, 201);
    }

    public function show(Member $member)
    {
        return response()->json($member);
    }

    public function update(Request $request, Member $member)
    {
        $member->update($request->all());

        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully',
        ]);
    }
}