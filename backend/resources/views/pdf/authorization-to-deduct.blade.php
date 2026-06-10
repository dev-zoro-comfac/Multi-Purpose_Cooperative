<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Authorization To Deduct</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            line-height: 1.4;
            margin: 24px 36px;
        }

        h1 {
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            margin: 0 0 12px;
            text-transform: uppercase;
        }

        .line {
            display: inline-block;
            border-bottom: 1px solid #000;
            height: 11px;
            vertical-align: baseline;
            text-align: center;
        }

        .name-line {
            min-width: 210px;
        }

        .employer-line {
            min-width: 180px;
        }

        .amount-line {
            min-width: 70px;
        }

        .loan-line {
            min-width: 120px;
        }

        .signature-right {
            width: 100%;
            margin-top: 26px;
            border-collapse: collapse;
        }

        .signature-cell {
            width: 260px;
            text-align: left;
        }

        .signature-line {
            display: inline-block;
            border-bottom: 1px solid #000;
            width: 210px;
            height: 12px;
        }

        .id-line {
            display: inline-block;
            border-bottom: 1px solid #000;
            width: 92px;
            height: 12px;
        }

        p {
            margin: 0;
            text-align: justify;
        }
    </style>
</head>
<body>
    <h1>Authorization To Deduct</h1>

    <p>
        I,
        <span class="line name-line">{{ $loan->borrower_name ?? '' }}</span>,
        hereby authorize the Accounting Department/Cashier of
        <span class="line employer-line">{{ $loan->borrower_employer ?? '' }}</span>
        to deduct from my salary the amount of PHP
        <span class="line amount-line">{{ number_format($loan->amortization_per_payday ?? 0, 2) }}</span>
        every pay day in payment of my loan amounting to P
        <span class="line loan-line">{{ number_format($loan->total_amount_payable ?? 0, 2) }}</span>
        including interest.
    </p>

    <table class="signature-right">
        <tr>
            <td></td>
            <td class="signature-cell">
                <span class="signature-line"></span><br>
                Borrower's Name and Signature<br>
                I.D. No. <span class="id-line"></span>
            </td>
        </tr>
    </table>
</body>
</html>