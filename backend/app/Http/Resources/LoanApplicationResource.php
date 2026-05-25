<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'application_no' => $this->application_no,

            'borrower_name' => $this->borrower_name,
            'borrower_address' => $this->borrower_address,
            'borrower_age' => $this->borrower_age,

            'amount_requested' => $this->amount_requested,

            'annual_rate' => $this->annual_rate,
            'number_of_paydays' => $this->number_of_paydays,
            'amortization_per_payday' => $this->amortization_per_payday,
            'monthly_amortization' => $this->monthly_amortization,
            'total_interest' => $this->total_interest,
            'total_amount_payable' => $this->total_amount_payable,
            'processing_fee' => $this->processing_fee,
            'net_proceeds' => $this->net_proceeds,

            'status' => $this->status,

            'submitted_at' => $this->submitted_at,
            'approved_at' => $this->approved_at,
            'rejected_at' => $this->rejected_at,

            'documents' => $this->documents,

            'activity_logs' => $this->whenLoaded('activityLogs', function () {
    return $this->activityLogs->map(function ($log) {
        return [
            'id' => $log->id,
            'action' => $log->action,
            'notes' => $log->notes,
            'created_at' => $log->created_at,
            'user' => $log->user ? [
                'id' => $log->user->id,
                'name' => $log->user->name ?? $log->user->email,
                'email' => $log->user->email,
            ] : null,
        ];
    });
}),

            'created_at' => $this->created_at,
        ];
    }
}