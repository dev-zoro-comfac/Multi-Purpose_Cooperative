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
    <h1>Loan Application</h1>
    <div class="muted">{{ $loan->application_no }}</div>

    <h2>Borrower Information</h2>
    <div class="row"><span class="label">Borrower:</span> {{ $loan->borrower_name ?? '—' }}</div>
    <div class="row"><span class="label">Address:</span> {{ $loan->borrower_address ?? '—' }}</div>
    <div class="row"><span class="label">Age:</span> {{ $loan->borrower_age ?? '—' }}</div>
    <div class="row"><span class="label">Civil Status:</span> {{ $loan->borrower_civil_status ?? '—' }}</div>
    <div class="row"><span class="label">Employer:</span> {{ $loan->borrower_employer ?? '—' }}</div>

    <h2>Loan Information</h2>
    <div class="row"><span class="label">Amount Requested:</span> ₱{{ number_format((float) $loan->amount_requested, 2) }}</div>
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