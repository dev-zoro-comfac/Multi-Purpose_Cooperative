<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $loan->application_no }}</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
        }

        .document-logo {
            display: block;
            width: 150px;
            margin: 0 auto 10px;
        }

        h1 {
            font-size: 20px;
            margin-bottom: 4px;
        }

        h2 {
            font-size: 15px;
            margin-top: 24px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 6px;
        }

        .muted {
            color: #666;
        }

        .row {
            margin-bottom: 8px;
        }

        .label {
            font-weight: bold;
            width: 180px;
            display: inline-block;
        }

        .status {
            font-weight: bold;
            text-transform: uppercase;
        }

        .log {
            border-left: 4px solid #999;
            padding-left: 10px;
            margin-bottom: 12px;
        }
    </style>
</head>
<body>
    <img class="document-logo" src="{{ public_path('images/cornersteel-logo.png') }}" alt="Cornersteel Cooperative">

    <h1>Loan Application</h1>
    <div class="muted">{{ $loan->application_no }}</div>

    <h2>Borrower Information</h2>
    <div class="row"><span class="label">Borrower:</span> {{ $loan->borrower_name ?? '—' }}</div>
    <div class="row"><span class="label">Address:</span> {{ $loan->borrower_address ?? '—' }}</div>
    <div class="row"><span class="label">Age:</span> {{ $loan->borrower_age ?? '—' }}</div>
    <div class="row"><span class="label">Civil Status:</span> {{ $loan->borrower_civil_status ?? '—' }}</div>
    <div class="row"><span class="label">Employer:</span> {{ $loan->borrower_employer ?? '—' }}</div>

    <h2>Credit Committee Computation</h2>
    <div class="row"><span class="label">Amount Requested:</span> ₱{{ number_format((float) $loan->amount_requested, 2) }}</div>
    <div class="row"><span class="label">Interest Rate:</span> {{ $loan->annual_rate ?? 0 }}%</div>
    <div class="row"><span class="label">Payment Frequency:</span> {{ str_replace('_', ' ', $loan->payment_frequency ?? '—') }}</div>
    <div class="row"><span class="label">Preferred Payment Method:</span> {{ str_replace('_', ' ', $loan->preferred_payment_method ?? '—') }}</div>
    <div class="row"><span class="label">Number of Paydays:</span> {{ $loan->number_of_paydays ?? '—' }}</div>
    <div class="row"><span class="label">Amortization Per Pay Period:</span> ₱{{ number_format((float) ($loan->amortization_per_payday ?? 0), 2) }}</div>
    <div class="row"><span class="label">Total Amount Payable:</span> ₱{{ number_format((float) ($loan->total_amount_payable ?? 0), 2) }}</div>
    <div class="row"><span class="label">Net Proceeds:</span> ₱{{ number_format((float) ($loan->net_proceeds ?? 0), 2) }}</div>
    <div class="row"><span class="label">Status:</span> <span class="status">{{ str_replace('_', ' ', $loan->status) }}</span></div>
    <div class="row"><span class="label">Submitted At:</span> {{ optional($loan->submitted_at)->format('M d, Y h:i A') ?? '—' }}</div>
    <div class="row"><span class="label">Approved At:</span> {{ optional($loan->approved_at)->format('M d, Y h:i A') ?? '—' }}</div>
    <div class="row"><span class="label">Rejected At:</span> {{ optional($loan->rejected_at)->format('M d, Y h:i A') ?? '—' }}</div>
    <div class="row"><span class="label">Accounting Notes:</span> {{ $loan->accounting_notes ?? '—' }}</div>

    <h2>Co-maker Information</h2>
    <div class="row"><span class="label">Co-maker:</span> {{ $loan->co_maker_name ?? '—' }}</div>
    <div class="row"><span class="label">Address:</span> {{ $loan->co_maker_address ?? '—' }}</div>
    <div class="row"><span class="label">Employer:</span> {{ $loan->co_maker_employer ?? '—' }}</div>

    <h2>Activity Logs</h2>

    @forelse ($loan->activityLogs as $log)
        <div class="log">
            <div><strong>{{ ucwords(str_replace('_', ' ', $log->action)) }}</strong></div>
            <div class="muted">
                By: {{ $log->user->email ?? 'System' }}
                |
                {{ optional($log->created_at)->format('M d, Y h:i A') }}
            </div>

            @if ($log->notes)
                <div>{{ $log->notes }}</div>
            @endif
        </div>
    @empty
        <div class="muted">No activity logs yet.</div>
    @endforelse
</body>
</html>