<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Vendor;
use Carbon\Carbon;

class TransactionService
{

    public function createTransaction(Vendor $vendor, Carbon $date, float $amount, int $type, int $type_id)
    {
        $balance = 0;

        if ($amount != 0) {
            // check old data available in this vendor
            $isExists = Transaction::where('vendor_id', $vendor->id)
                ->where('transaction_at','>', $date)
                ->orderBy('transaction_at')
                ->exists();

            if ($isExists) {
                // get particular filtered data of this vendor
                $transactions = Transaction::where('vendor_id', $vendor->id)
                ->where('transaction_at','>', $date)
                ->orderBy('transaction_at')
                ->get();

                $previousRow = Transaction::where('vendor_id', $vendor->id)
                ->where('transaction_at','<=', $date)
                ->select('balance')
                ->orderBy('transaction_at','DESC')
                ->orderBy('id','DESC')
                ->first();

                // store balance
                $balance = (isset($previousRow->balance) ? $previousRow->balance : 0) + $amount;

                // update transaction balance
                foreach ($transactions as $row) {
                    $row->balance += $amount;
                    $row->save();
                }
            } else {
                // store balance
                $balance = $vendor->balance + $amount;
            }

            $transaction = new Transaction();
            $transaction->fill([
                "vendor_id" => $vendor->id,
                "credit" => $amount >= 0 ? $amount : 0,
                "debit" => abs($amount < 0 ? $amount : 0),
                "balance" => $balance,
                "type" => $type,
                "type_id" => $type_id,
                "transaction_at" => $date,
            ])->save();

            // change the vendor balance
            $vendor->balance += $amount;
            $vendor->save();
        }
    }
}
