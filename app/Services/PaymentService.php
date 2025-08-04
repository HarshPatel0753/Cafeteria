<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PaymentService
{

    public function storeOrUpdatePayment (object $request)
    {

        $payment = Payment::find($request->id);
        $vendor = Vendor::findOrFail($request->vendor_id);

        if (!$payment) {
            $payment = Payment::create($this->fields($request));

            (new TransactionService())->createTransaction(
                vendor: $vendor,
                date: Carbon::parse($payment->payment_at),
                amount: $payment->amount * ($payment->type == 0 ? 1 : -1),
                type: Transaction::TYPE['payment'],
                type_id: $payment->id
            );
        } else {
            if ($payment->vendor_id != $request->vendor_id) {
                // old vendor transaction updated
                $old_vendor = Vendor::find($payment->vendor_id);

                (new TransactionService())->createTransaction(
                    $old_vendor,
                    Carbon::parse($payment->payment_at),
                    $payment->amount * ($payment->type == 0 ? -1 : 1),
                    Transaction::TYPE['payment'],
                    $payment->id
                );

                $payment->fill($this->fields($request))->save();

                // new vendor transaction created
                (new TransactionService())->createTransaction(
                    $vendor,
                    Carbon::parse($payment->payment_at),
                    $payment->amount * ($payment->type == 0 ? 1 : -1),
                    Transaction::TYPE['payment'],
                    $payment->id
                );
            } else {
                //  vendor transaction updated
                $amount = ($request->amount * ($request->type == 0 ? 1 : -1)) - ($payment->amount * ($payment->type == 0 ? 1 : -1));

                (new TransactionService())->createTransaction(
                    $vendor,
                    Carbon::parse($payment->payment_at),
                    $amount,
                    Transaction::TYPE['payment'],
                    $payment->id
                );

                $payment->fill($this->fields($request))->save();
            }
        }
    }

    public function fields($request)
    {
        $fields = [
            "vendor_id" => $request->vendor_id,
            "payment_at" => Carbon::parse($request->payment_at)->format('y-m-d h:m:s'),
            "type" => $request->type,
            "amount" => $request->amount,
            "remark" => $request->remark,
        ];
        !$request->id && $fields["created_by"] = Auth::user()->id;

        return $fields;
    }

}
?>
