<?php

namespace App\Services;

use App\Models\LoanApplication;
use App\Models\User;
use App\Notifications\LoanNotification;

class LoanWorkflowService
{
    private const ACTIONABLE_STATUSES = [
        'submitted_for_evaluation',
        'reviewed',
        'pending',
        'created',
    ];

    public function review(LoanApplication $loanApplication, ?string $userId): array
    {
        if ($loanApplication->status !== 'submitted_for_evaluation') {
            return [
                'success' => false,
                'message' => 'Loan is not ready for review.',
                'status' => 422,
            ];
        }

        $loanApplication->update([
            'status' => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => $userId,
        ]);

        $loanApplication->activityLogs()->create([
            'user_id' => $userId,
            'action' => 'reviewed',
            'notes' => 'Loan application reviewed.',
        ]);

        return [
            'success' => true,
            'message' => 'Loan reviewed successfully.',
            'loan' => $loanApplication,
        ];
    }

    public function approve(LoanApplication $loanApplication, ?string $userId): array
    {
        if (! in_array($loanApplication->status, self::ACTIONABLE_STATUSES, true)) {
            return [
                'success' => false,
                'message' => 'Loan is not ready for approval.',
                'status' => 422,
            ];
        }

        $loanApplication->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $userId,
        ]);

        $loanApplication->activityLogs()->create([
            'user_id' => $userId,
            'action' => 'approved',
            'notes' => 'Loan application was approved.',
        ]);

        $this->notifyBorrower(
            $loanApplication,
            'Your loan application has been approved by accounting.',
            'loan_approved'
        );

        return [
            'success' => true,
            'message' => 'Loan application approved.',
            'loan' => $loanApplication,
        ];
    }

    public function reject(LoanApplication $loanApplication, ?string $userId, ?string $notes = null): array
    {
        if (! in_array($loanApplication->status, self::ACTIONABLE_STATUSES, true)) {
            return [
                'success' => false,
                'message' => 'Loan is not ready for rejection.',
                'status' => 422,
            ];
        }

        $loanApplication->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'accounting_notes' => $notes,
        ]);

        $loanApplication->activityLogs()->create([
            'user_id' => $userId,
            'action' => 'rejected',
            'notes' => $notes ?: 'Loan application was rejected.',
        ]);

        $this->notifyBorrower(
            $loanApplication,
            'Your loan application was rejected. Please check the loan details for accounting notes.',
            'loan_rejected',
            false
        );

        return [
            'success' => true,
            'message' => 'Loan application rejected.',
            'loan' => $loanApplication,
        ];
    }

    public function release(LoanApplication $loanApplication, ?string $userId): array
    {
        if ($loanApplication->status !== 'approved') {
            return [
                'success' => false,
                'message' => 'Loan is not approved yet.',
                'status' => 422,
            ];
        }

        $loanApplication->update([
            'status' => 'released',
            'released_at' => now(),
        ]);

        $loanApplication->activityLogs()->create([
            'user_id' => $userId,
            'action' => 'released',
            'notes' => 'Loan proceeds were released to the borrower.',
        ]);

        $this->notifyBorrower(
            $loanApplication,
            'Your loan proceeds have been released.',
            'loan_released'
        );

        return [
            'success' => true,
            'message' => 'Loan released successfully.',
            'loan' => $loanApplication,
        ];
    }

    private function notifyBorrower(
        LoanApplication $loanApplication,
        string $message,
        string $type,
        bool $success = true
    ): void {
        $loanApplication->loadMissing('member');

        $memberUserId = $loanApplication->member?->user_id;

        if (! $memberUserId) {
            return;
        }

        User::find($memberUserId)?->notify(new LoanNotification(
            $message,
            $type,
            $success,
            [
                'loan_id' => $loanApplication->id,
                'application_no' => $loanApplication->application_no,
            ]
        ));
    }
}
