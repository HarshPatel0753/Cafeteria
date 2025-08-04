<?php

namespace App\Exports;

use App\Models\Transaction;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionsExport implements FromCollection,WithHeadings,WithColumnWidths,WithStyles,WithStrictNullComparison
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {

        $query = Transaction::join('vendors','vendors.id','=','transactions.vendor_id')->select([
            'transactions.id',
            'vendors.name',
            'transactions.credit',
            'transactions.debit',
            'transactions.balance',
            DB::raw('IF(transactions.type = 0,"CupList","Payment") as type'),
            'transactions.transaction_at',
            'transactions.type_id',
        ])->get();

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Vendor ID',
            'Credit',
            'Debit',
            'Balance',
            'Type',
            'Transaction At',
            'Type Id'
        ];
    }

    public function columnWidths(): array
    {
        return[
            'G'=>25
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return[
            '1'=>['font'=>['bold'=>true]]
        ];
    }
}
