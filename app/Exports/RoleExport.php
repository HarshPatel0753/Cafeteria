<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithUpserts;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Spatie\Permission\Models\Role as ModelsRole;

class RoleExport implements FromCollection,WithHeadings,WithColumnWidths,WithStyles,WithUpserts
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return ModelsRole::select(['id','name','display_name'])->get();
    }

    public function headings(): array
    {
        return [
            'Id',
            'Name',
            'Display Name'
        ];
    }

    public function columnWidths(): array
    {
        return[
            'B'=>10,
            'C'=>20,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return[
            '1'=>['font'=>['bold'=>true]]
        ];
    }

    public function uniqueBy()
    {
        return 'name';
    }
}
