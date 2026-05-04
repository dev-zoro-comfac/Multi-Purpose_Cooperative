<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Loan Supporting Documents</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #000;
        }

        .center { text-align: center; }
        .bold { font-weight: bold; }
        .section-title {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            margin-top: 28px;
            margin-bottom: 18px;
        }

        .line {
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 220px;
            height: 14px;
        }

        .short-line {
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 100px;
            height: 14px;
        }

        .long-line {
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 430px;
            height: 14px;
        }

        .box {
            border: 1px solid #000;
            padding: 10px;
            margin-top: 25px;
        }

        .row { margin-bottom: 8px; }

        .signature-right {
            margin-top: 45px;
            text-align: right;
        }

        .signature-line {
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 260px;
            height: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            vertical-align: top;
        }

        .footer-box {
            border: 1px solid #000;
            padding: 12px;
            margin-top: 35px;
        }
    </style>
</head>
<body>

    <div class="center">
        <div class="bold">Multi-Purpose Cooperative</div>
        <div>536 Catbayog Street, Mandaluyong City</div>
    </div>

    <div class="section-title">AUTHORIZATION TO DEDUCT</div>

    <p>
        I,
        <span class="line">{{ $loan->borrower_name }}</span>,
        hereby authorize the Accounting Department/Cashier of
        <span class="line">{{ $loan->borrower_employer }}</span>,
        to deduct from my salary the amount of PHP
        <span class="short-line">{{ number_format($loan->amount_requested, 2) }}</span>
        every pay day in payment of my loan amounting to PHP
        <span class="short-line">{{ number_format($loan->amount_requested, 2) }}</span>
        including interest.
    </p>

    <div class="signature-right">
        <span class="signature-line"></span><br>
        Borrower's Name and Signature<br>
        I.D. No. <span class="short-line"></span>
    </div>

    <div class="box">
        <div class="row">
            Name of Co-Maker:
            <span class="line">{{ $loan->co_maker_name }}</span>
            Age:
            <span class="short-line">{{ $loan->co_maker_age }}</span>
            Civil Status:
            <span class="short-line">{{ $loan->co_maker_civil_status }}</span>
        </div>

        <div class="row">
            Address:
            <span class="long-line">{{ $loan->co_maker_address }}</span>
        </div>

        <div class="row">
            Employer:
            <span class="line">{{ $loan->co_maker_employer }}</span>
        </div>

        <div class="row">
            Length of Service:
            <span class="line">{{ $loan->co_maker_length_of_service }}</span>
        </div>

        <div class="row">
            Coop Member Since:
            <span class="line"></span>
        </div>

        <div class="row">
            Total Contribution to Date: PHP
            <span class="line"></span>
            Total Outstanding Loan to Date: PHP
            <span class="line"></span>
        </div>
    </div>

    <div class="section-title">PROMISSORY NOTE</div>

    <table>
        <tr>
            <td>Date: <span class="line"></span></td>
            <td style="text-align: right;">
                For: PHP <span class="line">{{ number_format($loan->amount_requested, 2) }}</span>
            </td>
        </tr>
    </table>

    <p>
        FOR VALUE RECEIVED, WE JOINTLY and SEVERALLY promise to pay the
        Comfac Group of Companies Employees Multi-Purpose Cooperative the sum of
        <span class="long-line"></span>
        pesos (PHP <span class="short-line">{{ number_format($loan->amount_requested, 2) }}</span>)
        including interest.
    </p>

    <table style="margin-top: 60px;">
        <tr>
            <td>
                <span class="signature-line"></span><br>
                Maker's Name and Signature<br>
                I.D. No. <span class="short-line"></span>
            </td>
            <td style="text-align: right;">
                <span class="signature-line"></span><br>
                Co-Maker's Name and Signature<br>
                I.D. No. <span class="short-line"></span>
            </td>
        </tr>
    </table>

    <div class="footer-box">
        <table>
            <tr>
                <td>
                    Verified by: <span class="line"></span><br><br>
                    Date: <span class="line"></span>
                </td>
                <td>
                    Approved by: <span class="line"></span><br><br>
                    Date: <span class="line"></span>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>