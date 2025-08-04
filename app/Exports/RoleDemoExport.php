<?php

namespace App\Exports;

use Faker\Factory;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RoleDemoExport implements FromCollection, WithHeadings,WithColumnWidths,WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $faker = Factory::create();
        $row = [];
        for ($count = 0; $count < 38; $count++) {
            array_push($row, [
                'id' => $count,
                'name' => $faker->name(),
                'display_name' => $faker->name()
            ]);
        }

        return collect($row);
    }

    public function headings(): array
    {
        return [
            'Sr No',
            'Name',
            'Display Name'
        ];
    }

    public function columnWidths(): array
    {
        return [
            'B'=>20,
            'C' =>30
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            '1' => ['font'=>['bold'=>true]]
        ];
    }
}
