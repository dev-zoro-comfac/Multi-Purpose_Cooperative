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
            'application_source' => $this->application_source,
            'declared_member_status' => $this->declared_member_status,
            'declared_member_no' => $this->declared_member_no,

            'borrower_name' => $this->borrower_name,
            'borrower_email' => $this->borrower_email,
            'borrower_contact_number' => $this->borrower_contact_number,
            'borrower_address' => $this->borrower_address,
            'borrower_age' => $this->borrower_age,
            'borrower_civil_status' => $this->borrower_civil_status,
            'borrower_employer' => $this->borrower_employer,
            'borrower_position' => $this->borrower_position,
            'borrower_length_of_service' => $this->borrower_length_of_service,
            'take_home_pay_15' => $this->take_home_pay_15,
            'take_home_pay_30' => $this->take_home_pay_30,
            'member_since' => $this->member_since,

            'amount_requested' => $this->amount_requested,

            'loan_type' => $this->loan_type,
            'payment_frequency' => $this->payment_frequency,
            'preferred_payment_method' => $this->preferred_payment_method,
            'computation_method' => $this->computation_method,
            'purpose' => $this->purpose,
            'total_contribution' => $this->total_contribution,
            'outstanding_loan_balance' => $this->outstanding_loan_balance,

            'co_maker_name' => $this->co_maker_name,
            'co_maker_email' => $this->co_maker_email,
            'co_maker_contact_number' => $this->co_maker_contact_number,
            'co_maker_address' => $this->co_maker_address,
            'co_maker_age' => $this->co_maker_age,
            'co_maker_civil_status' => $this->co_maker_civil_status,
            'co_maker_employer' => $this->co_maker_employer,
            'co_maker_length_of_service' => $this->co_maker_length_of_service,

            'annual_rate' => $this->annual_rate,
            'number_of_paydays' => $this->number_of_paydays,
            'amortization_per_payday' => $this->amortization_per_payday,
            'monthly_amortization' => $this->monthly_amortization,
            'total_interest' => $this->total_interest,
            'total_amount_payable' => $this->total_amount_payable,
            'processing_fee' => $this->processing_fee,
            'net_proceeds' => $this->net_proceeds,

            'status' => $this->status,
            'accounting_notes' => $this->accounting_notes,

            'submitted_at' => $this->submitted_at,
            'reviewed_at' => $this->reviewed_at,
            'approved_at' => $this->approved_at,
            'rejected_at' => $this->rejected_at,
            'released_at' => $this->released_at,
            'reviewed_by' => $this->reviewed_by,
            'approved_by' => $this->approved_by,

            'documents' => $this->documents,

            'amortizations' => $this->whenLoaded('amortizations', function () {
                return $this->amortizations->map(function ($row) {
                    return [
                        'id' => $row->id,
                        'payday_no' => $row->payday_no,
                        'amortization' => $row->amortization,
                        'interest' => $row->interest,
                        'principal' => $row->principal,
                        'balance' => $row->balance,
                    ];
                });
            }),

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
