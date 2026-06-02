<?php

namespace App\Services;

use App\Models\LoanApplication;

class LoanDashboardService
{
    public function stats(): array
    {
        return [
            'total_loans' => LoanApplication::count(),
            'pending_loans' => LoanApplication::where('status', 'submitted_for_evaluation')->count(),
            'documents_generated' => LoanApplication::where('status', 'documents_generated')->count(),
            'documents_uploaded' => LoanApplication::where('status', 'documents_uploaded')->count(),
            'submitted_for_evaluation' => LoanApplication::where('status', 'submitted_for_evaluation')->count(),
            'reviewed_loans' => LoanApplication::where('status', 'reviewed')->count(),
            'approved_loans' => LoanApplication::where('status', 'approved')->count(),
            'released_loans' => LoanApplication::where('status', 'released')->count(),
            'rejected_loans' => LoanApplication::where('status', 'rejected')->count(),
            'total_amount_requested' => LoanApplication::sum('amount_requested'),
            'total_amount_approved' => LoanApplication::whereIn('status', ['approved', 'released'])
                ->sum('amount_requested'),
            'total_net_proceeds' => LoanApplication::whereIn('status', ['approved', 'released'])
                ->sum('net_proceeds'),
        ];
    }
}
