<?php

namespace App\Services;

use App\Enums\RoleEnum;
use App\Models\Member;
use App\Models\Profile;
use App\Models\User;
use App\Notifications\MemberAccountCreatedNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class LoanAccountService
{
    public function attachBorrowerMember(array $loanData): array
    {
        if (! empty($loanData['member_id']) || empty($loanData['borrower_email'])) {
            return $loanData;
        }

        $user = User::firstOrCreate(
            [
                'email' => $loanData['borrower_email'],
            ],
            [
                'password' => Hash::make(Str::password(16)),
            ]
        );

        $borrowerRole = $this->borrowerRole($loanData);

        if (! $user->hasRole($borrowerRole->value)) {
            $user->assignRole($borrowerRole->value);
        }

        [$firstName, $lastName] = $this->splitBorrowerName(
            $loanData['borrower_name'] ?? null
        );

        if ($user->wasRecentlyCreated) {
            try {
                $token = Password::broker()->createToken($user);

                $user->notify(new MemberAccountCreatedNotification(
                    $token,
                    trim("{$firstName} {$lastName}")
                ));
            } catch (\Throwable $exception) {
                Log::warning('Borrower portal account email could not be sent.', [
                    'email' => $user->email,
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        if (! $user->profile) {
            $user->profile()->save(Profile::factory()->make([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'middle_name' => null,
                'contact_number' => $loanData['borrower_contact_number'] ?? null,
            ]));
        }

        $member = Member::firstOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'member_no' => $this->nextMemberNumber(),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'middle_name' => null,
                'email' => $loanData['borrower_email'],
                'contact_number' => $loanData['borrower_contact_number'] ?? null,
                'address' => $loanData['borrower_address'] ?? null,
                'status' => 'active',
            ]
        );

        $loanData['member_id'] = $member->id;
        $loanData['is_coop_member'] = $borrowerRole === RoleEnum::Member;

        return $loanData;
    }

    private function borrowerRole(array $loanData): RoleEnum
    {
        $declaredMemberStatus = $loanData['declared_member_status'] ?? null;
        $loanType = $loanData['loan_type'] ?? null;

        if ($declaredMemberStatus === 'new_applicant' || $loanType === 'non_member') {
            return RoleEnum::NonMember;
        }

        return RoleEnum::Member;
    }

    private function splitBorrowerName(?string $borrowerName): array
    {
        $nameParts = collect(explode(' ', $borrowerName ?? ''))
            ->filter()
            ->values();

        return [
            $nameParts->first() ?: 'Member',
            $nameParts->count() > 1 ? $nameParts->last() : 'Borrower',
        ];
    }

    private function nextMemberNumber(): string
    {
        return 'MEM-'.str_pad((string) (Member::count() + 1), 6, '0', STR_PAD_LEFT);
    }
}
