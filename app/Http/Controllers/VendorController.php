<?php

namespace App\Http\Controllers;

use App\Exports\TransactionsExport;
use App\Http\Requests\VendorFormRequest;
use App\Imports\TransactionsImport;
use App\Models\DeliveryPerson;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Vendor;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class VendorController extends Controller
{

    function index(): Response
    {
        return Inertia::render('vendor/Index');
    }

    function form(): Response
    {
        return Inertia::render('vendor/Form');
    }

    // get vendors form the vendors table
    function loadData($per_page_number, $page_number): JsonResponse
    {
        try {
            DB::beginTransaction();

            $vendors = Vendor::query()->with(['deliveryPersons:id,vendor_id,name,mobile_number', 'products:id,vendor_id,name,price'])
                ->select(
                    'id',
                    'name',
                    'email',
                    'mobile_number',
                    'address',
                    'gst_number',
                    'balance'
                )
                ->paginate(perPage: $per_page_number, page: $page_number);

            DB::commit();
            return response()->json($vendors);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    // get transaction from the transaction table
    function getTransactions(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $transactions = Transaction::query()
                ->where('vendor_id', $request->id)
                ->when($request->range, function ($transactions) use ($request) {
                    $transactions->whereBetween('transaction_at', [$request->range['start'],$request->range['end']]);
                })
                ->select(
                    'id',
                    'credit',
                    'debit',
                    'balance',
                    'type',
                    'type_id',
                    DB::raw("DATE_FORMAT(transaction_at, '%d-%b-%Y %h:%i %p') as transaction_at")
                )
                ->orderByDesc(DB::raw("DATE_FORMAT(transaction_at,'%Y-%m-%d %H:%i')"))
                ->orderByDesc('id')
                ->paginate(perPage: $request->per_page_number, page: $request->page_number);

            DB::commit();
            return response()->json($transactions);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function viewIndex()
    {
        try {
            return View('index');
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function downloadTransactions($id)
    // : JsonResponse
    {
        try {


            $transactions = Transaction::query()
                ->where('vendor_id', $id)
                ->select(
                    'id',
                    'credit',
                    'debit',
                    'balance',
                    'type',
                    'type_id',
                    DB::raw("DATE_FORMAT(transaction_at, '%b %d, %Y - %h:%i %p') as transaction_at")
                )
                ->orderByDesc(DB::raw("DATE_FORMAT(transaction_at,'%Y-%m-%d %H:%i')"))
                ->orderByDesc('id')
                ->get();

            $vendorName = Vendor::find($id)->name;
            $date = now()->toDayDateTimeString();

            $html = view('vendor.download_transaction', ['transactions' => $transactions, 'vendorName' => $vendorName, 'date' => $date]);

            $dompdf = new Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->render();

            $canvas = $dompdf->getCanvas();
            $fontMetrics = $dompdf->getFontMetrics();
            $font = $fontMetrics->getFont('helvetica', 'bold');

            $canvas->page_text(
                560,
                25,
                "{PAGE_NUM} / {PAGE_COUNT}",
                $font,
                12,
                array(0, 0, 0)
            );

            $fileName = "{$vendorName} Transaction-" . now()->toDateString() . '.pdf';
            $dompdf->stream($fileName, array('Attachment' => false));
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    // edit vendor form
    function updateForm($id): Response
    {
        $vendor = Vendor::where('id', $id)->with(['deliveryPersons:id,vendor_id,name,mobile_number', 'products:id,vendor_id,name,price'])
            ->first([
                'id',
                'name',
                'email',
                'mobile_number',
                'address'
            ]);

        return Inertia::render('vendor/Form', ['vendor' => $vendor]);
    }

    function storeOrUpdate(VendorFormRequest $request, Vendor $vendor): JsonResponse
    {
        try {
            DB::beginTransaction();
            // store vendor data
            $vendor->fill($request->fields())->save();

            // delivery persons flow stats

            //remove delivery persons whose id not in request
            // (!empty($request->filterDeliveryPersons())) &&
            DeliveryPerson::where("vendor_id", $vendor->id)->whereNotIn('id', $request->filterDeliveryPersons())->delete();

            // store delivery persons
            foreach ($request->delivery_persons as $delivery_person) {
                $delivery_person_obj = DeliveryPerson::find($delivery_person['id']) ?? new DeliveryPerson();

                $delivery_person_obj->fill([
                    "name" => $delivery_person['name'],
                    "mobile_number" => $delivery_person['mobile_number'],
                    "vendor_id" => $vendor->id,
                ])->save();
            }
            // delivery persons flow end

            // product flow starts

            // remove product whose not in request array
            // (!empty($request->filterProducts())) &&
            Product::where("vendor_id", $vendor->id)->whereNotIn('id', $request->filterProducts())->delete();

            // store products;
            foreach ($request->products as $product_data) {
                $product_obj = Product::find($product_data['id']) ?? new Product();

                $product_obj->fill([
                    "name" => $product_data['name'],
                    "price" => $product_data['price'],
                    "vendor_id" => $vendor->id,
                ])->save();
            }
            // product flow end

            DB::commit();

            return response()->json([
                'message' => "User - {$vendor->name} has been {$request->action()} successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function destroy(Vendor $vendor): JsonResponse
    {
        try {
            DB::beginTransaction();

            // delete vendor records
            $vendor->deliveryPersons()->delete();
            $vendor->products()->delete();
            $vendor->delete();
            DB::commit();

            return response()->json([
                'message' => "User - {$vendor->name} has been Deleted successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function transactionExport()
    {
        $date = Carbon::now()->toDateString();
        return Excel::download(new TransactionsExport, "transaction_{$date}.xlsx");
    }

    public function transactionImport(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'transaction_file' => 'bail|file|mimes:xlsx'
            ]);

            Excel::import(new TransactionsImport, $request->file('transaction_file'));

            DB::commit();
            return response()->json([
                'message' => 'Data Imported'
            ]);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'errors' => $e->failures(),
            ], status: 422);
        }
    }
}
