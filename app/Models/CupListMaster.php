<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CupListMaster extends Model
{
    use HasFactory;
    protected $table = "cup_list_master";
    protected $guarded = [];

    public function cupList(): HasMany
    {
        return $this->hasMany(cupListDetail::class, "cup_list_master_id");
    }

    public function vendors(): HasOne
    {
        return $this->hasOne(Vendor::class, 'id', "vendor_id");
    }

    public function users(): HasOne
    {
        return $this->hasOne(User::class, 'id', "created_by");
    }
}
