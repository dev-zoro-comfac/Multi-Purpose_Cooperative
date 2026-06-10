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
            'borrower_contact_number' => ['nullable', 'string', 'max:50'],
            'borrower_address' => ['nullable', 'string', 'max:255'],
            'borrower_age' => ['nullable', 'integer', 'min:18'],
            'borrower_civil_status' => ['nullable', 'string', 'max:50'],
            'borrower_employer' => ['nullable', 'string', 'max:255'],
            'borrower_position' => ['nullable', 'string', 'max:255'],
            'borrower_length_of_service' => ['nullable', 'string', 'max:100'],

            'member_id' => ['nullable', 'integer', 'exists:members,id'],
            'declared_member_status' => ['nullable', 'string', 'in:member,new_applicant'],
            'declared_member_no' => ['nullable', 'string', 'max:100'],
            'loan_type' => ['nullable', 'string', 'max:100'],
            'payment_frequency' => ['nullable', 'string', 'max:100'],
            'preferred_payment_method' => ['nullable', 'string', 'in:salary_deduction,cash,online_transfer'],
            'computation_method' => ['nullable', 'string', 'in:diminishing_balance,add_on_rate,simple_interest'],
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
            'co_maker_email' => ['nullable', 'email', 'max:255'],
            'co_maker_contact_number' => ['nullable', 'string', 'max:50'],
            'co_maker_address' => ['nullable', 'string', 'max:255'],
            'co_maker_age' => ['nullable', 'integer', 'min:18'],
            'co_maker_civil_status' => ['nullable', 'string', 'max:50'],
            'co_maker_employer' => ['nullable', 'string', 'max:255'],
            'co_maker_length_of_service' => ['nullable', 'string', 'max:100'],
        ];
    }

    
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $requiresCoMaker =
                $this->input('loan_type') === 'non_member' ||
                (float) $this->input('amount_requested', 0) > 10000;

            if (! $requiresCoMaker) {
                return;
            }

            if (! filled($this->input('co_maker_name'))) {
                $validator->errors()->add(
                    'co_maker_name',
                    'Co-maker name is required for non-member loans or loans above PHP 10,000.'
                );
            }

            if (! filled($this->input('co_maker_contact_number'))) {
                $validator->errors()->add(
                    'co_maker_contact_number',
                    'Co-maker contact number is required for non-member loans or loans above PHP 10,000.'
                );
            }
        });
    }
}
