<?php

namespace App\Imports;

use App\Models\Payment;
use App\Services\PaymentService;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

// use Maatwebsite\Excel\Concerns\WithValidation;

class PaymentImport implements ToCollection, WithHeadingRow ,WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */

    function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {
            $row['type'] = $row['type'] == 'debit' ? 1 : 0;
            $row['payment_at'] = Carbon::parse($row['payment_at'])->format('Y-m-d h:i');

            $payment = json_decode(json_encode($row), FALSE);

            (new PaymentService())->storeOrUpdatePayment($payment);
        }
    }

    public function rules(): array
    {
        return [
            'vendor_id' => ['required'],
            'payment_at' => ['required'],
            'type' => ['required'],
            'amount' => ['required'],
        ];
    }

}
