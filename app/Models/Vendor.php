<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use HasFactory;
    protected $table = 'vendors';
    protected $guarded = [];


    public function deliveryPersons(): HasMany
    {
        return $this->hasMany(DeliveryPerson::class,'vendor_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class,'vendor_id');
    }
}
