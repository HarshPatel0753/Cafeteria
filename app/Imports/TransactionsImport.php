<?php

namespace App\Imports;

use App\Models\Transaction;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class TransactionsImport implements ToCollection,WithValidation,WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */

    public function collection(Collection $transactions)
    {

        // dd($transactions->toArray());
        foreach ($transactions as $row) {
            $transaction = Transaction::where('id', $row['id'])->first();
            if ($transaction) {
                $transaction->update([
                    'vendor_id' => $row['vendor_id'],
                    'credit' => $row['credit'],
                    'debit' => $row['debit'],
                    'balance' => $row['balance'],
                    'type' => $row['type'],
                    // 'transaction_at' => $row['transaction_at'],
                    'type_id' => $row['type_id'],
                ]);
            } else {
                Transaction::create([
                    // 'id' => $row['id'],
                    'vendor_id' => $row['vendor_id'],
                    'credit' => $row['credit'],
                    'debit' => $row['debit'],
                    'balance' => $row['balance'],
                    'type' => $row['type'],
                    // 'transaction_at' => $row['transaction_at'],
                    'type_id' => $row['type_id'],
                ]);
            }
        }
    }

    public function rules(): array
    {
        return[
            'vendor_id'=>['required'],
            'credit'=>['required'],
            'debit'=>['required'],
            'balance'=>['required'],
            'type'=>['required'],
            // 'transaction_at'=>['required'],
            'type_id'=>['required'],
        ];
    }

    public function customValidationMessages(){
        return[
            'vendor_id.required'=> 'Required',
            // 'vendor_id.numeric'=> 'Only Number Accepted',
            'credit.required'=> 'Required',
            // 'credit.numeric'=> 'Only Number Accepted',
            'debit.required'=> 'Required',
            // 'debit.numeric'=> 'Only Number Accepted',
            'balance.required'=> 'Required',
            // 'balance.numeric'=> 'Only Number Accepted',
            'type.required'=> 'Required',
            // 'type.numeric'=> 'Only Number Accepted',
            // 'transaction_at.required'=> 'Required',
            'type_id.required'=> 'Required',
            // 'type_id.numeric'=> 'Only Number Accepted',
        ];
    }

    // public function model(array $row)
    // {
    //     return new Transaction([
    //         //
    //     ]);
    // }
}
