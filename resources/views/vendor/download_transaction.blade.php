<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        @page {
            margin: 0cm 0cm;
        }

        /** Define now the real margins of every page in the PDF **/
        body {
            margin-top: 2cm;
            margin-left: 2cm;
            margin-right: 2cm;
            margin-bottom: 2cm;
        }

        /** Define the header rules **/
        header {
            position: fixed;
            top: 0cm;
            left: 0cm;
            right: 0cm;
            height: 2cm;
            margin-left: 10px;
            margin-right: 10px;
        }

        table {
            width: 100%;
        }

        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 10px;
        }

        .headerLeft {
            position: absolute;
            top: 15%;
            left: 3%;
        }

        .headerCenter {
            position: absolute;
            top: 15%;
            right: 43.5%;
        }

        .vendorName {

            text-align: center;
        }
    </style>
</head>

<body>
    <header>
        <h4 class="headerLeft">{{ $date }}</h4>
        <h3 class="headerCenter">Transactions</h3>
    </header>
    <h2 class="vendorName">{{ $vendorName }}</h2>
    <table>
        <thead>
            <tr>
                <th>Sr. No</th>
                <th>Date</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Balance</th>
                <th>Type</th>
            </tr>
        </thead>
        <tbody>
            {{ $totalCredit = 0 }}
            {{ $totalDebit = 0 }}
            @foreach ($transactions as $index => $transaction)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $transaction->transaction_at }}</td>
                    <td style="text-align: right;">{{ $transaction->credit }}</td>
                    <td style="text-align: right;">{{ $transaction->debit }}</td>
                    <td style="text-align: right;">{{ $transaction->balance }}</td>
                    <td>{{ $transaction->type == 0 ? 'Cup List' : 'Payment' }}
                    </td>
                </tr>
                {{ $totalCredit += $transaction->credit, $totalDebit += $transaction->debit }}
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="2" style="text-align: center;"><b> Total </b></th>
                <th style="text-align: right;">{{ $totalCredit }}</th>
                <th style="text-align: right;">{{ $totalDebit }}</th>
                <th style="text-align: right;">{{ $totalCredit - $totalDebit }}</th>
                <th></th>
            </tr>
        </tfoot>
    </table>
</body>

</html>
