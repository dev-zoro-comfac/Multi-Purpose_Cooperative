<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Loan Application Form</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
        }

        h1 {
            text-align: center;
            margin-bottom: 4px;
        }

        h2 {
            font-size: 15px;
            margin-top: 24px;
            border-bottom: 1px solid #111827;
            padding-bottom: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        td, th {
            border: 1px solid #d1d5db;
            padding: 7px;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            width: 35%;
            background: #f3f4f6;
        }

        .signature {
            margin-top: 50px;
            width: 45%;
            text-align: center;
            display: inline-block;
        }

        .line {
            border-top: 1px solid #111827;
            padding-top: 6px;
        }
    </style>
</head>
<body>
    <h1>Loan Application Form</h1>

    <p style="text-align: center;">
        Application No: <strong>{{ $loan->application_no }}</strong>
    </p>

    <h2>Borrower Information</h2>
    <table>
        <tr><td class="label">Name</td><td>{{ $loan->borrower_name }}</td></tr>
        <tr><td class="label">Email</td><td>{{ $loan->borrower_email ?? '—' }}</td></tr>
        <tr><td class="label">Contact Number</td><td>{{ $loan->borrower_contact_number ?? '—' }}</td></tr>
        <tr><td class="label">Address</td><td>{{ $loan->borrower_address ?? '—' }}</td></tr>
        <tr><td class="label">Employer</td><td>{{ $loan->borrower_employer ?? '—' }}</td></tr>
        <tr><td class="label">Position</td><td>{{ $loan->borrower_position ?? '—' }}</td></tr>
        <tr><td class="label">Length of Service</td><td>{{ $loan->borrower_length_of_service ?? '—' }}</td></tr>
    </table>

    <h2>Co-maker Information</h2>
    <table>
        <tr><td class="label">Name</td><td>{{ $loan->co_maker_name ?? '—' }}</td></tr>
        <tr><td class="label">Email</td><td>{{ $loan->co_maker_email ?? '—' }}</td></tr>
        <tr><td class="label">Contact Number</td><td>{{ $loan->co_maker_contact_number ?? '—' }}</td></tr>
        <tr><td class="label">Address</td><td>{{ $loan->co_maker_address ?? '—' }}</td></tr>
        <tr><td class="label">Employer</td><td>{{ $loan->co_maker_employer ?? '—' }}</td></tr>
        <tr><td class="label">Length of Service</td><td>{{ $loan->co_maker_length_of_service ?? '—' }}</td></tr>
    </table>

    <h2>Loan Information</h2>
    <table>
        <tr><td class="label">Loan Type</td><td>{{ str_replace('_', ' ', $loan->loan_type ?? 'Unknown') }}</td></tr>
        <tr><td class="label">Purpose</td><td>{{ $loan->purpose ?? '—' }}</td></tr>
        <tr><td class="label">Amount Requested</td><td>PHP {{ number_format($loan->amount_requested ?? 0, 2) }}</td></tr>
        <tr><td class="label">Interest Rate</td><td>{{ $loan->annual_rate ?? 0 }}%</td></tr>
        <tr><td class="label">Number of Paydays</td><td>{{ $loan->number_of_paydays ?? '—' }}</td></tr>
        <tr><td class="label">Payment Frequency</td><td>{{ str_replace('_', ' ', $loan->payment_frequency ?? '—') }}</td></tr>
        <tr><td class="label">Processing Fee</td><td>PHP {{ number_format($loan->processing_fee ?? 0, 2) }}</td></tr>
        <tr><td class="label">Total Amount Payable</td><td>PHP {{ number_format($loan->total_amount_payable ?? 0, 2) }}</td></tr>
        <tr><td class="label">Amortization Per Pay Period</td><td>PHP {{ number_format($loan->monthly_amortization ?? 0, 2) }}</td></tr>
        <tr><td class="label">Net Proceeds</td><td>PHP {{ number_format($loan->net_proceeds ?? 0, 2) }}</td></tr>
    </table>

    <h2>Amortization Schedule</h2>

@if($loan->amortizations && $loan->amortizations->count())
    <table>
        <thead>
            <tr>
                <th>Payday No.</th>
                <th>Amortization</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>
            @foreach($loan->amortizations as $row)
                <tr>
                    <td>{{ $row->payday_no }}</td>
                    <td>PHP {{ number_format($row->amortization ?? 0, 2) }}</td>
                    <td>PHP {{ number_format($row->principal ?? 0, 2) }}</td>
                    <td>PHP {{ number_format($row->interest ?? 0, 2) }}</td>
                    <td>PHP {{ number_format($row->balance ?? 0, 2) }}</td>
                </tr>
            @endforeacm
        </tbody>
    </table>
@else
    <p>No amortization schedule available.</p>
@endif

    <h2>Agreement</h2>
    <p>
        I certify that the information provided in this loan application is true and correct.
        I understand that this application is subject to review, approval, and cooperative policies.
    </p>

    <div class="signature">
        <div class="line">Borrower Signature</div>
    </div>

    <div class="signature" style="float: right;">
        <div class="line">Co-maker Signature</div>
    </div>
</body>
</html>