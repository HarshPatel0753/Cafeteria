<?php

namespace App\Http\Controllers;

use App\Http\Requests\CupListFormRequest;
use App\Models\CupListDetail;
use App\Models\CupListMaster;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\Vendor;
use App\Services\TransactionService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use PHPUnit\Event\Telemetry\Duration;

class CupListController extends Controller
{

    private const DURATION_TYPES = [
        'all' => 0,
        'month' => 1,
        'year' => 2,
    ];

    function index(): Response
    {
        return Inertia::render('cup-list/Index');
    }

    // get cup list data
    function loadData(Request $request): JsonResponse
    {
        //type =  [
        // 0 => All ,
        // 1 => month ,
        // 2 => year ,
        // ]

        try {
            DB::beginTransaction();

            $query = DB::table('cup_list_details');

            $query->join('cup_list_master', 'cup_list_master.id', '=', 'cup_list_details.cup_list_master_id')
                ->join('vendors', 'vendors.id', '=', 'cup_list_master.vendor_id')
                ->join('users', 'users.id', '=', 'cup_list_master.created_by');

            $query->select([
                'cup_list_master.id',
                DB::raw("DATE_FORMAT(cup_list_master.entry_at, '%b %d %Y, %h:%i %p') as entry_at"),
                'cup_list_master.remark',
                'vendors.id as vendor_id',
                'vendors.name as vendor_name',
                'users.id as user_id',
                'users.username as user_name',
                DB::raw("SUM(cup_list_details.cups) as total_cups"),
                DB::raw("SUM(cup_list_details.cups * cup_list_details.price) as total_price"),
            ]);

            if (!empty($request->vendor)) {
                $query->where('cup_list_master.vendor_id', $request->vendor);
            }

            if (!empty($request->product)) {
                $query->where('cup_list_details.product_id', $request->product);
            }

            if (in_array($request->integer('type'), [self::DURATION_TYPES['month'], self::DURATION_TYPES['year']])) {
                $query->whereYear('cup_list_master.entry_at', '=', now()->year)
                    ->when($request->integer('type') === self::DURATION_TYPES['month'], function ($subQuery) {
                        $subQuery->whereMonth('cup_list_master.entry_at', now()->month);
                    });
            }

            $cup_list = $query->groupBy('cup_list_master.id')
                ->orderBy(DB::raw("DATE_FORMAT(entry_at,'%Y-%m-%d %H:%i')"), 'DESC')
                ->paginate(
                    perPage: $request->per_page,
                    page: $request->page
                );

            DB::commit();

            return response()->json([
                'cup_list' => $cup_list
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

            $cup_list = CupListMaster::query()
                ->with(['cupList:id,cup_list_master_id,product_id,price,cups', 'cupList.products:id,name', 'vendors:id,name', 'users:id,username'])
                ->select([
                    'id',
                    'vendor_id',
                    'total_cups',
                    'total_amount',
                    'remark',
                    'is_editable',
                    'created_by',
                    DB::raw("DATE_FORMAT(entry_at, '%a, %b %d, %Y, %h:%i %p') as entry_at")
                ])
                ->when($request->range, function ($cup_list) use ($request) {
                    $cup_list->whereBetween('entry_at', [$request->range['start'],$request->range['end']]);
                })
                ->when($searchRows, function (Builder $query, array $searchRows) {
                    foreach ($searchRows as $key => $value) {
                        $query->orWhere($value['name'], 'LIKE', "%" . $value['text'] . "%");
                    }
                })
                // ->when($sortingColumns, function (Builder $query, array $sortingColumns) {
                //     foreach ($sortingColumns as $key => $value) {
                //         $query->orderBy($key, $value);
                //     }
                // })
                ->orderBy(DB::raw("DATE_FORMAT(entry_at,'%Y-%m-%d %H:%i')"), 'DESC')
                ->paginate(perPage: $request->per_page_number, page: $request->page_number);

            DB::commit();

            return response()->json($cup_list);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function latestCupList(): JsonResponse
    {
        try {

            $cup_list = CupListMaster::with(['cupList:id,cup_list_master_id,product_id,price,cups', 'vendors:id,name', 'vendors.products:id,vendor_id,price,name'])
                ->latest()
                ->select([
                    'id',
                    'vendor_id',
                    'total_cups',
                    'total_amount',
                    'remark',
                    'created_by as user_id',
                    'entry_at',
                ])
                ->first();

            if($cup_list){
                $cup_list->id = null;
                $cup_list_data = $data = [];

                foreach ($cup_list->vendors->products as $key => $product) {
                    $cup_list_data[$product->id] = [
                        "id" => null,
                        "product_id" => $product->id,
                        "name" => $product->name,
                        'cups' => 0,
                        "price" => $product->price,
                    ];
                }

                foreach ($cup_list->cupList as $key => $row) {
                    $cup_list_data[$row->product_id]['cups'] = $row->cups;
                }
                foreach ($cup_list_data as $key => $value) {
                    $data[] = $value;
                }

                $cup_list->unsetRelation('cupList');
                $cup_list->cup_list = $data;
                return response()->json(['data' => $cup_list]);
            }

            return response()->json(['data' => null]);

        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function getCupList($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $cup_list = CupListMaster::with(['cupList:id,cup_list_master_id,product_id,price,cups', 'vendors:id,name'])
                ->select([
                    'id',
                    'vendor_id',
                    'total_cups',
                    'total_amount',
                    'remark',
                    'created_by as user_id',
                    'entry_at',
                ])
                ->where('id', $id)
                ->first();

            $cup_list_data = $cup_list->toArray();

            $products = $this->getProducts($cup_list->vendor_id);

            foreach ($products->original as $key => $product) {
                $product->product_id = $product->id;
                unset($product->id);
                foreach ($cup_list->cupList as $key => $cup) {
                    if ($product->product_id == $cup->product_id) {
                        $product->id = $cup->id;
                        $product->cups = $cup->cups;
                    }
                }
                if (!$product->id) {
                    $product->cups = 0;
                    $product->id = null;
                }
            }

            $cup_list_data['cup_list'] = $products->original->toArray();

            DB::commit();
            return response()->json($cup_list_data);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function storeOrUpdate(CupListFormRequest $request, CupListMaster $cup_list_master, TransactionService $transactionService): JsonResponse
    {
        try {
            DB::beginTransaction();
            $vendor = Vendor::findOrFail($request->vendor_id);
            // new logic start

            // if cup-list-master are exist than do this or do else part
            if (!$cup_list_master->exists) {
                $cup_list_master->fill($request->getFields())->save();

                $transactionService->createTransaction(
                    $vendor,
                    Carbon::parse($cup_list_master->entry_at),
                    $cup_list_master->total_amount * -1,
                    Transaction::TYPE['cup_list'],
                    $cup_list_master->id
                );
            } else {
                if ($cup_list_master->vendor_id !== $request->integer('vendor_id')) {
                    // Old Transaction Updated
                    $old_vendor = Vendor::find($cup_list_master->vendor_id);

                    $transactionService->createTransaction(
                        $old_vendor,
                        Carbon::parse($cup_list_master->entry_at),
                        $cup_list_master->total_amount,
                        Transaction::TYPE['cup_list'],
                        $cup_list_master->id
                    );

                    $cup_list_master->fill($request->getFields())->save();
                    // $amount = $cup_list_master->total_amount * -1;
                    $transactionService->createTransaction(
                        $vendor,
                        Carbon::parse($request->entry_at),
                        $cup_list_master->total_amount * -1,
                        Transaction::TYPE['cup_list'],
                        $cup_list_master->id
                    );

                    // deleted old cup-list details data
                    $cup_list_master->cupList()->delete();
                } else {
                    // update the data of save vendor
                    $amount = ($request->total_amount * -1) + $cup_list_master->total_amount;
                    $transactionService->createTransaction(
                        $vendor,
                        Carbon::parse($request->entry_at),
                        $amount,
                        Transaction::TYPE['cup_list'],
                        $cup_list_master->id
                    );
                    $cup_list_master->fill($request->getFields())->save();
                }
            }
            // new logic end

            //starts cup list details code
            $cup_list_detail_ids = [];

            foreach ($request->cup_list as $cup_list_data_id) {
                isset($cup_list_data_id['id']) && array_push($cup_list_detail_ids, $cup_list_data_id['id']);
            }

            CupListDetail::where("cup_list_master_id", $cup_list_master->id)
                ->whereNotIn('id', $cup_list_detail_ids)
                ->delete();

            //store details in cup-list details table
            foreach ($request->cup_list as $cup_list_data) {
                $cup_list_detail_obj = CupListDetail::find($cup_list_data['id']) ?? new CupListDetail();

                $cup_list_detail_obj->fill([
                    "cup_list_master_id" => $cup_list_master->id,
                    "product_id" => $cup_list_data['product_id'],
                    "price" => $cup_list_data['price'],
                    "cups" => $cup_list_data['cups'],
                    "created_by" => $cup_list_master->created_by,
                ])->save();
            }
            // end cup list details code

            DB::commit();

            return response()->json([
                'message' => "Cup List has been {$request->getAction()} successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function destroy(CupListMaster $cup_list_master, TransactionService $transactionService): JsonResponse
    {
        try {
            DB::beginTransaction();
            // dd($cup_list_master->toArray());
            $old_vendor = Vendor::find($cup_list_master->vendor_id);

            $transactionService->createTransaction(
                $old_vendor,
                Carbon::now(),
                $cup_list_master->total_amount,
                Transaction::TYPE['cup_list'],
                $cup_list_master->id
            );

            // perform delete action
            $cup_list_master->cupList()->delete();
            $cup_list_master->delete();

            DB::commit();

            return response()->json([
                "message" => "Cup List  Entry has been Deleted successfully."
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    // get vendors form the vendors table
    function getVendors()
    {
        try {
            DB::beginTransaction();

            $vendors = Vendor::all()->select('id', 'name');

            DB::commit();
            return response()->json($vendors);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    // get Products form the Products table
    function getProducts($vendor)
    {
        try {
            DB::beginTransaction();

            $products = Product::where('vendor_id', $vendor)->get(['id', 'name', 'price']);

            DB::commit();
            return response()->json($products);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
