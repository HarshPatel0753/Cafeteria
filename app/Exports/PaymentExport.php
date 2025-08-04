<?php

namespace App\Exports;

use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PaymentExport implements FromCollection, WithHeadings, WithColumnWidths, WithMapping, WithStyles, WithStrictNullComparison
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $index = 0;

    public function collection()
    {
        return Payment::join('vendors', 'vendors.id', '=', 'payments.vendor_id')
            ->select([
                'vendors.name',
                'payments.payment_at',
                DB::raw('IF(payments.type = 0,"Credit","Debit") as type'),
                'payments.amount',
                'payments.remark',
            ])
            ->get();;
    }

    public function headings(): array
    {
        return [
            'Sr. No',
            'Vendor Id',
            'Payment At',
            'Type',
            'Amount',
            'Remark',
        ];
    }

    public function map($row): array
    {
        return array_merge([
            'Sr. No' => ++$this->index
        ], $row->toArray());
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'b' => 10,
            'c' => 20,
            'f' => 15,
        ];
    }
}
