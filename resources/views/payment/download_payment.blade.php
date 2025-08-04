<!DOCTYPE html>
<html lang="en">

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Payment Pdf</title>
    <style>
        @page {
            margin: 0 0;
        }

        body {
            margin: 2cm
        }

        header {
            margin-left: 6%;
            top: 0;
            left: 0;
            right: 0;
            position: fixed;
        }

        .title {
            text-align: center;
        }

        .date {
            position: absolute;
        }

        table {
            width: 100%;
        }

        table,
        th,
        td {
            border: 1 solid black;
            border-collapse: collapse;
            padding: 10;
        }

        .amount {
            text-align: right;
        }
    </style>
</head>

<body>

    <header>
        <h3 class="date">{{ $date }}</h3>
        <h3 class="title">Payments</h3>
    </header>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Vendor Id</th>
                <th>Payment At</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Remark</th>
            </tr>
        </thead>
        <tbody>
            {{ $total_balance = 0 }}
            @foreach ($payments as $index => $payment)
                <tr>
                    <td class="amount">{{ ++$index }}</td>
                    <td class="amount">{{ $payment->vendors['name'] }}</td>
                    <td>{{ $payment->payment_at }}</td>
                    <td class="amount">{{ $payment->type == 0 ? 'Credit' : 'Debit' }}</td>
                    <td class="amount">{{ $payment->amount }}</td>
                    <td>{{ $payment->remark }}</td>
                </tr>

                {{ $total_balance += $payment->amount }}
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td style="text-align: center" colspan="4"><b>Total</b></td>
                <td style="text-align: right"><b>{{ $total_balance }}</b></td>
                <td></td>
            </tr>
        </tfoot>
    </table>
</body>

</html>
