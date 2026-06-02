<?php

namespace App\Services;

use App\Models\LoanApplication;

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

        return [
            'success' => true,
            'message' => 'Loan released successfully.',
            'loan' => $loanApplication,
        ];
    }
}
