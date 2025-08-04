<?php

namespace App\Http\Controllers;

use App\Exports\PaymentExport;
use App\Http\Requests\PaymentFormRequest;
use App\Imports\PaymentImport;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Vendor;
use App\Services\PaymentService;
use App\Services\TransactionService;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PaymentController extends Controller
{

    function index(): Response
    {
        return Inertia::render('payment/Index');
    }

    function export()
    {
        return Excel::download(new PaymentExport, 'payments.xlsx');
    }

    function import(Request $request)
    {
        try {
            DB::beginTransaction();
            $request->validate([
                'file' => 'required',
            ]);
            Excel::import(new PaymentImport, $request->file('file'));
            DB::commit();
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'errors' => $e->failures(),
            ], status: 422);
        }

        return response()->json('Payments successfully imported.');
    }

    function getPdf()
    {
        $payments  = Payment::with(['Vendors:id,name'])->get();
        $html = view('payment/download_payment', ['payments' => $payments, 'date' => Carbon::now()->toDateString()]);

        $date = Carbon::now()->toDateString();
        $pdf = new Dompdf();

        $pdf->loadHtml($html);
        $pdf->render();
        $canvas = $pdf->getCanvas();
        $canvas->page_text(560, 17, "{PAGE_NUM} / {PAGE_COUNT}", null, 12, array(0, 0, 0));
        $pdf->stream("payments_{$date}.pdf", array("Attachment" => false));
    }

    //get vendors from vendors table
    function getVendors()
    {
        try {
            DB::beginTransaction();

            $vendors = Vendor::all()->select('id', 'name', 'balance');

            DB::commit();
            return response()->json($vendors);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    //get payment data from the payment table
    function loadData(Request $request): JsonResponse
    {
        //type =  [
        // 0 => All ,
        // 1 => month ,
        // 2 => year ,
        // ]

        try {
            DB::beginTransaction();
            $query = Payment::with(['vendors:id,name', 'users:id,username'])
                ->select([
                    'id',
                    'vendor_id',
                    'type',
                    'amount',
                    'remark',
                    'created_by',
                    'payment_at',
                    DB::raw("DATE_FORMAT(payment_at, '%a, %b %d, %Y, %h:%i %p') as display_payment_at")
                ])
                ->orderBy(DB::raw("DATE_FORMAT(payment_at,'%d-%m-%Y')"), 'DESC')
                ->orderBy('payment_at', 'DESC');

            $request->vendor_id != 0 && $query = $query->where('vendor_id', $request->vendor_id);

            $request->payment_type != 2 && $query = $query->where('type', $request->payment_type);

            $request->type == 1 && $query = $query->whereMonth('payment_at', now()->month)
                ->whereYear('payment_at', now()->year);

            $request->type == 2 && $query = $query->whereYear('payment_at', now()->year);

            $payment_lists = $query->get();

            DB::commit();

            return response()->json([
                'payment_lits' => $payment_lists
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function loadDesktopData(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // $sortingColumns = $request->sorting_columns;
            $searchRows = $request->search_fields;

            $payment = Payment::query()
            ->with(['vendors:id,name', 'users:id,username'])
            ->select([
                'id',
                'vendor_id',
                'type',
                'amount',
                'remark',
                'created_by',
                DB::raw("DATE_FORMAT(payment_at, '%a, %b %d, %Y, %h:%i %p') as payment_at")
            ])
            ->when($searchRows, function (Builder $query, array $searchRows) {
                foreach ($searchRows as $key => $value) {
                    $query->orWhere($value['name'] , 'LIKE' , "%".$value['text']."%");
                }
            })
            // ->when($sortingColumns, function (Builder $query, array $sortingColumns) {
            //     foreach ($sortingColumns as $key => $value) {
            //         $query->orderBy($key, $value);
            //     }
            // })
            ->orderBy(DB::raw("DATE_FORMAT(payment_at,'%d-%m-%Y')"), 'DESC')
            ->orderBy('id', 'DESC')
            ->paginate(perPage: $request->per_page_number, page: $request->page_number);

            // $payment = Payment::with(['vendors:id,name', 'users:id,username'])
            //     ->select([
            //         'id',
            //         'vendor_id',
            //         'type',
            //         'amount',
            //         'remark',
            //         'created_by',
            //         DB::raw("DATE_FORMAT(payment_at, '%a, %b %d, %Y, %h:%i %p') as payment_at")
            //     ])
            //     ->orderBy(DB::raw("DATE_FORMAT(payment_at,'%d-%m-%Y')"), 'DESC')
            //     ->orderBy('id', 'DESC')
            //     ->paginate(perPage: $request->per_page_number, page: $request->page_number);

            // dd($payment->toArray());
            DB::commit();

            return response()->json($payment);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function storeOrUpdate(PaymentFormRequest $request, Payment $payment, TransactionService $transactionService, PaymentService $paymentService): JsonResponse
    {
        try {
            DB::beginTransaction();

            $paymentService->storeOrUpdatePayment($request);

            // $vendor = Vendor::findOrFail($request->vendor_id);

            //store payment details

            // if payment is exist the do this or do else portion


            // New Transaction Created
            // if (!$payment->exists) {
            //     $payment->fill($request->fields())->save();

            //     $transactionService->createTransaction(
            //         vendor: $vendor,
            //         date: Carbon::parse($payment->payment_at),
            //         amount: $payment->amount * ($payment->type == 0 ? 1 : -1),
            //         type: Transaction::TYPE['payment'],
            //         type_id: $payment->id
            //     );
            // } else {
            //     if ($payment->vendor_id !== intval($request->vendor_id)) {
            //         // old vendor transaction updated
            //         $amount = $payment->amount * ($payment->type == 0 ? -1 : 1);
            //         $newTransaction = true;
            //     } else {
            //         $amount = ($request->amount * ($request->type == 0 ? 1 : -1)) - ($payment->amount * ($payment->type == 0 ? 1 : -1));
            //     }

            //     $transactionService->createTransaction(
            //         $thisVendor,
            //         Carbon::parse($payment->payment_at),
            //         $amount,
            //         Transaction::TYPE['payment'],
            //         $payment->id
            //     );

            //     $payment->fill($request->fields())->save();

            //     // new vendor transaction created
            //     $newTransaction && $transactionService->createTransaction(
            //         $vendor,
            //         Carbon::parse($payment->payment_at),
            //         $payment->amount * ($payment->type == 0 ? 1 : -1),
            //         Transaction::TYPE['payment'],
            //         $payment->id
            //     );
            // }

            // if (!$payment->exists) {
            //     $payment->fill($request->fields())->save();

            //     $transactionService->createTransaction(
            //         vendor: $vendor,
            //         date: Carbon::parse($payment->payment_at),
            //         amount: $payment->amount * ($payment->type == 0 ? 1 : -1),
            //         type: Transaction::TYPE['payment'],
            //         type_id: $payment->id
            //     );
            // } else {
            //     if ($payment->vendor_id != $request->vendor_id) {
            //         // old vendor transaction updated
            //         $old_vendor = Vendor::find($payment->vendor_id);

            //         $transactionService->createTransaction(
            //             $old_vendor,
            //             Carbon::parse($payment->payment_at),
            //             $payment->amount * ($payment->type == 0 ? -1 : 1),
            //             Transaction::TYPE['payment'],
            //             $payment->id
            //         );

            //         $payment->fill($request->fields())->save();

            //         // new vendor transaction created
            //         $transactionService->createTransaction(
            //             $vendor,
            //             Carbon::parse($payment->payment_at),
            //             $payment->amount * ($payment->type == 0 ? 1 : -1),
            //             Transaction::TYPE['payment'],
            //             $payment->id
            //         );
            //     } else {
            //         //  vendor transaction updated
            //         $amount = ($request->amount * ($request->type == 0 ? 1 : -1)) - ($payment->amount * ($payment->type == 0 ? 1 : -1));

            //         $transactionService->createTransaction(
            //             $vendor,
            //             Carbon::parse($payment->payment_at),
            //             $amount,
            //             Transaction::TYPE['payment'],
            //             $payment->id
            //         );

            //         $payment->fill($request->fields())->save();
            //     }
            // }

            DB::commit();

            return response()->json([
                "message" => "Payment {$request->action()} Successfully"
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function destroy(Payment $payment, TransactionService $transactionService): JsonResponse
    {
        try {

            DB::beginTransaction();

            // transaction flow of backup amount when delete
            $vendor = Vendor::find($payment->vendor_id);

            $transactionService->createTransaction(
                $vendor,
                Carbon::now(),
                $payment->amount * ($payment->type == 0 ? -1 : 1),
                Transaction::TYPE['payment'],
                $payment->id
            );

            // delete payment record
            $payment->delete();
            DB::commit();
            return response()->json([
                "message" => "Payment deleted successfully",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
