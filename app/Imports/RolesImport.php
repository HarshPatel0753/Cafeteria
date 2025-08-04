<?php

namespace App\Imports;

use App\Models\Role;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Spatie\Permission\Models\Role as ModelsRole;

class RolesImport implements ToCollection, WithValidation, WithHeadingRow
{
    // ToModel
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    private $created = 0;
    private $updated = 0;

    public function collection(Collection $roles)
    {
        foreach ($roles as $row) {

            $data = ModelsRole::updateOrCreate([
                'id' => $row['id'],
            ], [
                'name' => $row['name'],
                'display_name' => $row['display_name'],
            ]);

            $data->wasRecentlyCreated ? $this->created++ : $this->updated++;

            // $role->fill([
            //     // 'id' => $row['id'],
            //     'name' => $row['name'],
            //     'display_name' => $row['display_name'],
            // ])->save();
        }
        // dd($this->created,$this->updated);
    }

    public function getUPdatedOrCreatedCount()
    {
        return "{$this->created} Record Created And {$this->updated} Record Updated";
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'alpha',
            ],
            'display_name' => [
                'required',
                'string',
                'alpha',
            ],
        ];
    }

    public function customValidationMessages()
    {
        return [
            'name.required' => 'Required',
            'name.string' => 'Only String Accepted',
            'name.alpha' => 'Only Contains Letters',
            'display_name.required' => 'Required',
            'display_name.string' => 'Only String Accepted',
            'display_name.alpha' => 'Only Contains Letters',
        ];
    }
    // public function model(array $row)
    // {
    //     return new ModelsRole([

    //     ]);
    // }
}
