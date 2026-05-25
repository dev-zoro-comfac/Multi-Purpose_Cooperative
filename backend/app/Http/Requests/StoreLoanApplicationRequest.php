<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
        'borrower_name' => ['required', 'string', 'max:255'],
        'borrower_email' => ['nullable', 'email', 'max:255'],
        'borrower_address' => ['nullable', 'string', 'max:255'],
        'borrower_age' => ['nullable', 'integer', 'min:18'],
        'borrower_civil_status' => ['nullable', 'string', 'max:50'],
        'borrower_employer' => ['nullable', 'string', 'max:255'],
        'borrower_position' => ['nullable', 'string', 'max:255'],
        'borrower_length_of_service' => ['nullable', 'string', 'max:100'],

        'member_id' => ['nullable', 'integer'],
        'loan_type' => ['nullable', 'string', 'max:100'],
        'payment_frequency' => ['nullable', 'string', 'max:100'],
        'purpose' => ['nullable', 'string', 'max:1000'],

        'amount_requested' => ['required', 'numeric', 'min:1'],
        'annual_rate' => ['nullable', 'numeric', 'min:0'],
        'number_of_paydays' => ['nullable', 'integer', 'min:1'],
        'processing_fee' => ['nullable', 'numeric', 'min:0'],

        'total_contribution' => ['nullable', 'numeric', 'min:0'],
        'outstanding_loan_balance' => ['nullable', 'numeric', 'min:0'],

        'take_home_pay_15' => ['nullable', 'numeric', 'min:0'],
        'take_home_pay_30' => ['nullable', 'numeric', 'min:0'],

        'is_coop_member' => ['nullable', 'boolean'],
        'member_since' => ['nullable', 'date'],

        'co_maker_name' => ['nullable', 'string', 'max:255'],
        'co_maker_address' => ['nullable', 'string', 'max:255'],
        'co_maker_age' => ['nullable', 'integer', 'min:18'],
        'co_maker_civil_status' => ['nullable', 'string', 'max:50'],
        'co_maker_employer' => ['nullable', 'string', 'max:255'],
        'co_maker_length_of_service' => ['nullable', 'string', 'max:100'],
    ];
    }
}