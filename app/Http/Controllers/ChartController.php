<?php

namespace App\Http\Controllers;

use App\Models\CupListDetail;
use App\Models\CupListMaster;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Vendor;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ChartController extends Controller
{
    function loadPieChartData(): JsonResponse
    {
        try {
            DB::beginTransaction();


            $all_products = Product::leftJoin('cup_list_details', 'products.id', '=', 'cup_list_details.product_id')
                ->select('products.name', DB::raw('SUM(IFNULL(cup_list_details.cups ,0)) as cups'))
                ->groupBy('products.name')
                ->get();

            // dd($all_products->toArray());

            DB::commit();
            return Response()->json([
                "product_list" => $all_products
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function dashboardData()
    {
        // vendors
        // cups
        // today expence
        try {

            $data = [];
            $totalVendors = Vendor::count();

            $now = now()->endOfDay();
            $startDate = now()->startOfMonth()->startOfDay();
            $thisMonthExpense = CupListMaster::query()
            ->whereBetween('entry_at', [$startDate,$now])
            ->select(DB::raw('SUM(total_amount) as total_amount'))
            ->get();

            $start =new Carbon('first day of last month');
            $end = new Carbon('last day of last month');

            $lastMonthExpense = CupListMaster::query()
            ->whereBetween('entry_at', [$start->startOfDay(),$end->endOfDay()])
            ->select(DB::raw('SUM(total_amount) as total_amount'))
            ->get();

            $lastPayment = Payment::select('amount')->orderBy('id','DESC')->first();

            $data = [
                'totalVendors' => $totalVendors,
                'thisMonthExpense' => $thisMonthExpense[0]->total_amount,
                'lastMonthExpense' => $lastMonthExpense[0]->total_amount,
                'lastPayment' => $lastPayment->amount,
            ];

            return Response()->json($data);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function loadVendorData() {
        try {

            $now = now()->endOfDay();
            $startDate = now()->subMonth()->startOfDay();
            $chartLabel = $now->englishMonth."-".$now->year;
            $data = [];

            $cupList = CupListMaster::query()
            ->whereBetween('entry_at', [$startDate,$now])
            ->select([
                DB::raw('SUM(total_amount) as total_amount'),
                DB::raw("DATE_FORMAT(entry_at, '%Y-%m-%d') as entry_at"),
                ])
            ->groupByRaw("DATE_FORMAT(entry_at, '%Y-%m-%d')")
            ->get();

            foreach (CarbonPeriod::create($startDate, $now) as $day) {
                $data['label'][] = $day->format('Y-m-d');
                $data['data'][$day->format('Y-m-d')] = 0;
            }

            foreach ($cupList as $key => $row) {
                $data['data'][$row->entry_at] = $row->total_amount;
            }
            $data['chartLabel'] = $chartLabel;

            return Response()->json($data);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
