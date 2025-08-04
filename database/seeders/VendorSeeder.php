<?php

namespace Database\Seeders;

use App\Models\DeliveryPerson;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors_row = [
            [
                'name' => "Ankit Tea",
                'mobile_number' => "9987654321",
                'email' => "ankit@example.com",
                'address' => "kalol",
            ],
            [
                'name' => "Ravji Tea",
                'mobile_number' => "9987654322",
                'email' => "ravji@example.com",
                'address' => "kadi",
            ],
            [
                'name' => "Jay Coffee",
                'mobile_number' => "9987654323",
                'email' => "jay@example.com",
                'address' => "gandhinagar",
            ],
            [
                'name' => "Ajay Coffee",
                'mobile_number' => "9987654324",
                'email' => "ajay@example.com",
                'address' => "ahmedabad",
            ],
            [
                'name' => "Lalbhai Tea",
                'mobile_number' => "9987654325",
                'email' => "lalbhai@example.com",
                'address' => "maheshana",
            ],
        ];

        Vendor::insert($vendors_row);

        $delivery_persons_row = [
            [
                'name' => "Akshay",
                'mobile_number' => "9987654321",
                'vendor_id' => '1'
            ],
            [
                'name' => "Balgopal",
                'mobile_number' => "",
                'vendor_id' => '1'
            ],
            [
                'name' => "Jayesh",
                'mobile_number' => "9987654322",
                'vendor_id' => '2'
            ],
            [
                'name' => "Kalpesh",
                'mobile_number' => "9987654323",
                'vendor_id' => '3'
            ],
            [
                'name' => "Paresh",
                'mobile_number' => "",
                'vendor_id' => '3'
            ],
            [
                'name' => "Abhay",
                'mobile_number' => "9987654324",
                'vendor_id' => '4'
            ],
            [
                'name' => "Harsh",
                'mobile_number' => "",
                'vendor_id' => '4'
            ],
            [
                'name' => "Vinit",
                'mobile_number' => "9987654324",
                'vendor_id' => '4'
            ],
            [
                'name' => "Jaymin",
                'mobile_number' => "9987654325",
                'vendor_id' => '5'
            ],
        ];

        DeliveryPerson::insert($delivery_persons_row);

        $products_row = [
            [
                'name' => "Tea",
                'price' => 10,
                'vendor_id' => '1'
            ],
            [
                'name' => "Coffee",
                'price' => 15,
                'vendor_id' => '1'
            ],
            [
                'name' => "Cold-Coffee",
                'price' => 20,
                'vendor_id' => '1'
            ],
            [
                'name' => "Coffee",
                'price' => 15,
                'vendor_id' => '2'
            ],
            [
                'name' => "Cold-Coffee",
                'price' => 20,
                'vendor_id' => '2'
            ],
            [
                'name' => "Tea",
                'price' => 10,
                'vendor_id' => '3'
            ],
            [
                'name' => "Tea",
                'price' => 10,
                'vendor_id' => '4'
            ],
            [
                'name' => "Cold-Coffee",
                'price' => 20,
                'vendor_id' => '4'
            ],
            [
                'name' => "Coffee",
                'price' => 15,
                'vendor_id' => '5'
            ],
        ];

        Product::insert($products_row);
    }
}
