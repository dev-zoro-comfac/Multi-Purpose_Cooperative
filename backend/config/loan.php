<?php

return [
    'default_annual_rate' => env('LOAN_DEFAULT_ANNUAL_RATE', 15),
    'default_number_of_paydays' => env('LOAN_DEFAULT_NUMBER_OF_PAYDAYS', 24),
    'default_processing_fee' => env('LOAN_DEFAULT_PROCESSING_FEE', 50),
    'default_payment_frequency' => env('LOAN_DEFAULT_PAYMENT_FREQUENCY', 'semi_monthly'),
    'default_computation_method' => env('LOAN_DEFAULT_COMPUTATION_METHOD', 'diminishing_balance'),
    'default_payment_method' => env('LOAN_DEFAULT_PAYMENT_METHOD', 'salary_deduction'),
];
