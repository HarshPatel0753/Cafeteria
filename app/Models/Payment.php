<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    use HasFactory;

    protected $table = "payments";
    protected $guarded = [];

    public function vendors(): HasOne
    {
        return $this->hasOne(Vendor::class,'id',"vendor_id");
    }

    public function users(): HasOne
    {
        return $this->hasOne(User::class, 'id', "created_by");
    }
}
