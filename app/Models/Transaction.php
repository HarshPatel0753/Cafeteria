<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;
    protected $table = "transactions";
    protected $guarded = [];

    public const TYPE = [
        'cup_list' => 0,
        'payment' => 1,
    ];

    public function vendors(): HasMany
    {
        return $this->hasMany(Vendor::class, 'id', "vendor_id");
    }
}
