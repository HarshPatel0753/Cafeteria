<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CupListDetail extends Model
{
    use HasFactory;
    protected $table = "cup_list_details";
    // protected $with = "products";
    protected $guarded = [];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Product::class,'product_id','id');
    }

    // public function cupLisMaster():BelongsTo
    // {
    //     return $this->belongsTo(CupListMaster::class);
    // }
}
