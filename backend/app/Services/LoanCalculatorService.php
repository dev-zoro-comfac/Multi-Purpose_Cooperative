<?php

namespace App\Services;

class LoanCalculatorService
{
    public function calculate(array $data): array
    {
        $loanAmount = (float) ($data['loan_amount'] ?? $data['amount_requested'] ?? 0);
        $annualRate = (float) ($data['annual_rate'] ?? 15);
        $numberOfPaydays = (int) ($data['number_of_paydays'] ?? 24);
        $processingFee = (float) ($data['processing_fee'] ?? 50);

        $paymentFrequency = $data['payment_frequency'] ?? 'semi_monthly';

        $periodsPerYear = match ($paymentFrequency) {
            'monthly' => 12,
            'weekly' => 52,
            default => 24,
        };

        $periodicRate = ($annualRate / 100) / $periodsPerYear;

        $amortizationPerPayday = $this->pmt($periodicRate, $numberOfPaydays, $loanAmount);

        $balance = $loanAmount;
        $schedule = [];
        $totalInterest = 0;
        $totalPrincipal = 0;
        $totalAmortization = 0;

        for ($i = 1; $i <= $numberOfPaydays; $i++) {
            $interest = $balance * $periodicRate;
            $principal = $amortizationPerPayday - $interest;

            if ($i === $numberOfPaydays) {
                $principal = $balance;
                $amortization = $principal + $interest;
            } else {
                $amortization = $amortizationPerPayday;
            }

            $balance -= $principal;

            $totalInterest += $interest;
            $totalPrincipal += $principal;
            $totalAmortization += $amortization;

            $schedule[] = [
                'payday_no' => $i,
                'amortization' => round($amortization, 2),
                'interest' => round($interest, 2),
                'principal' => round($principal, 2),
                'balance' => round(max($balance, 0), 2),
            ];
        }

        return [
            'loan_amount' => round($loanAmount, 2),
            'annual_rate' => round($annualRate, 2),
            'number_of_paydays' => $numberOfPaydays,
            'payment_frequency' => $paymentFrequency,
            'periods_per_year' => $periodsPerYear,
            'periodic_rate' => round($periodicRate, 6),
            'amortization_per_payday' => round($amortizationPerPayday, 2),
            'monthly_amortization' => round($amortizationPerPayday * 2, 2),
            'total_interest' => round($totalInterest, 2),
            'total_principal' => round($totalPrincipal, 2),
            'total_amount_payable' => round($totalAmortization, 2),
            'processing_fee' => round($processingFee, 2),
            'net_proceeds' => round($loanAmount - $processingFee, 2),
            'schedule' => $schedule,
        ];
    }

    private function pmt(float $rate, int $periods, float $presentValue): float
    {
        if ($rate == 0) {
            return $presentValue / $periods;
        }

        return ($rate * $presentValue) / (1 - pow(1 + $rate, -$periods));
    }
}
