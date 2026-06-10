<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Promissory Note</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
            line-height: 1.6;
        }

        .document-logo {
            display: block;
            width: 150px;
            margin: 0 auto 10px;
        }

        h1 {
            text-align: center;
            font-size: 20px;
            margin-bottom: 24px;
        }

        .line {
            display: inline-block;
            border-bottom: 1px solid #111827;
            min-width: 220px;
            padding: 0 6px;
        }

        .signature {
            margin-top: 60px;
            width: 45%;
            text-align: center;
            display: inline-block;
        }

        .signature-right {
            float: right;
        }
    </style>
</head>
<body>
    <img class="document-logo" src="{{ public_path('images/cornersteel-logo.png') }}" alt="Cornersteel Cooperative">

    <h1>Promissory Note</h1>

    <p>
        For value received, I,
        <span class="line">{{ $loan->borrower_name ?? 'Borrower Name' }}</span>,
        promise to pay Cornersteel Cooperative the total amount of PHP
        <strong>{{ number_format($loan->total_amount_payable ?? 0, 2) }}</strong>
        for loan application <strong>{{ $loan->application_no }}</strong>.
    </p>

    <p>
        Payment shall be made in
        <strong>{{ $loan->number_of_paydays ?? '—' }}</strong>
        {{ str_replace('_', ' ', $loan->payment_frequency ?? 'pay period') }}
        installments at PHP
        <strong>{{ number_format($loan->amortization_per_payday ?? 0, 2) }}</strong>
        per pay period, subject to the approved cooperative loan computation and policies.
    </p>

    <p>
        Co-maker:
        <span class="line">{{ $loan->co_maker_name ?? 'Co-maker Name' }}</span>
    </p>

    <div class="signature">
        <div class="line"></div><br>
        Maker's Name and Signature
    </div>

    <div class="signature signature-right">
        <div class="line"></div><br>
        Co-Maker's Name and Signature
    </div>
</body>
</html>