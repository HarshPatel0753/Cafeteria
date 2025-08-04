<?php

namespace App\Http\Controllers;

use App\Models\CupListMaster;
use App\Models\Payment;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class MobileDashboardController extends Controller
{
    function loadLastMonthDetails(): JsonResponse
    {
        try {
            $start =new Carbon('first day of last month');
            $end = new Carbon('last day of last month');

            $lastMonthExpense = CupListMaster::query()
            ->whereBetween('entry_at', [$start->startOfDay(),$end->endOfDay()])
            ->select(DB::raw('SUM(total_amount) as total_amount'))
            ->get();

            $lastPayment = Payment::select('amount')->orderBy('id','DESC')->first();

            return Response()->json([
                'lastMonthExpense' => $lastMonthExpense[0]->total_amount,
                'lastPayment' => $lastPayment->amount,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function loadCupListTotal(Request $request): JsonResponse
    {
        // [
        // 0 => week ,
        // 1 => month ,
        // ]

        try {

            $request->type == 0 && $query = CupListMaster::
            whereBetween('entry_at', [Carbon::now()->startOfWeek(Carbon::SUNDAY), Carbon::now()->endOfWeek(Carbon::SATURDAY)])->get();

            $request->type == 1 && $query = CupListMaster::
                whereMonth('entry_at', \Carbon\Carbon::now()->month)
                ->whereYear('entry_at', \Carbon\Carbon::now()->year);

                $total_cups = $query->sum('total_cups');
                $total_amount = $query->sum('total_amount');

            return Response()->json([
                'total_cups' => $total_cups,
                'total_amount' => $total_amount
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function loadLast7DaysRecord()
    {
        try {
            DB::beginTransaction();

            $last_7_days =  CupListMaster::with(['vendors:id,name', 'users:id,username'])
                ->whereDate('entry_at', '>=', now()->subDays(7))
                ->orderBy('entry_at', 'DESC')
                ->get();

            DB::commit();

            return Response()->json([
                'last_7_days' => $last_7_days
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function ChartData(): JsonResponse
    {
        try {
            DB::beginTransaction();

            $end = now()->endOfMonth()->endOfDay()->toDateTimeString();
            $start = now()->subMonth(2)->startOfMonth()->startOfDay()->toDateTimeString();

            $vendors = Vendor::query()
            ->addSelect([
                'name',
                'expense' => CupListMaster::query()
                    ->select(DB::raw("IFNULL(SUM(total_amount),0) as expense"))
                    ->whereBetween('entry_at', [$start,$end])
                    ->whereColumn('vendor_id','vendors.id')
                    ->latest(),
                'payment' => Payment::query()
                    ->select(DB::raw("IFNULL(SUM(IF(type = 0 , amount, amount *-1)),0) as payment"),)
                    ->whereBetween('payment_at', [$start,$end])
                    ->whereColumn('vendor_id','vendors.id')
                    ->latest(),
                ])
            ->get();

            $data = [];
            foreach ($vendors as $key => $value) {
               $data[] = ['label' => $value->name, 'value' => $value->expense ];
               $data[] = ['value' => abs($value->payment) ];
            }

            DB::commit();

            return Response()->json(['data' => $data]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
