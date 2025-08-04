<?php

namespace Database\Seeders;

use App\Models\CupListDetail;
use App\Models\CupListMaster;
use App\Models\Transaction;
use App\Models\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CupListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cup_list_master = [
            [
                "id" => 1,
                "vendor_id" => 1,
                "entry_at" => "2024-05-07 10:00",
                "total_cups" => 1,
                "total_amount" => 10,
                "remark" => null,
                "created_by" => 1,
            ],
            [
                "id" => 2,
                "vendor_id" => 1,
                "entry_at" => "2024-05-09 10:00",
                "total_cups" => 2,
                "total_amount" => 20,
                "remark" => null,
                "created_by" => 1,
            ],
            [
                "id" => 3,
                "vendor_id" => 1,
                "entry_at" => "2024-05-10 10:00",
                "total_cups" => 3,
                "total_amount" => 30,
                "remark" => null,
                "created_by" => 1,
            ],
        ];

        CupListMaster::insert($cup_list_master);

        $cup_list_details = [
              [
                "id" => 1,
                'cup_list_master_id' => 1,
                "product_id" => 1,
                "price" => 10,
                "cups" => 1,
                "created_by" => 1,
              ],
              [
                "id" => 2,
                'cup_list_master_id' => 2,
                "product_id" => 1,
                "price" => 10,
                "cups" => 2,
                "created_by" => 1,
              ],
              [
                "id" => 3,
                'cup_list_master_id' => 3,
                "product_id" => 1,
                "price" => 10,
                "cups" => 3,
                "created_by" => 1,
              ],
        ];

        CupListDetail::insert($cup_list_details);

        $transaction = [
            [
                "id" => 1,
                "vendor_id" => 1,
                "credit" => 0.0,
                "debit" => 10.0,
                "balance" => -10.0,
                "transaction_at" => "2024-05-07 10:00",
                "type" => 0,
                "type_id" => 1,
            ],
            [
                "id" => 2,
                "vendor_id" => 1,
                "credit" => 0.0,
                "debit" => 20.0,
                "balance" => -30.0,
                "transaction_at" => "2024-05-09 10:00",
                "type" => 0,
                "type_id" => 2,
            ],
            [
                "id" => 3,
                "vendor_id" => 1,
                "credit" => 0.0,
                "debit" => 30.0,
                "balance" => -60.0,
                "transaction_at" => "2024-05-10 10:00",
                "type" => 0,
                "type_id" => 3,
            ],
        ];

        Transaction::insert($transaction);

        Vendor::where('id',1)->update(['balance' => -60]);

    }
}
