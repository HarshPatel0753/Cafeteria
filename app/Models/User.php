<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'users';
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'date:d/m/Y',
    ];

    public function role(): Role
    {
        return $this->roles()->first();
    }

    public function profileImage(): HasOne
    {
        return $this->hasOne(ProfileImage::class,'user_id');
    }

    public function getProfileImagePathAttribute(): string
    {
        if (isset($this->profileImage->path) && $this->profileImage->path != '') {
            return 'storage'.$this->profileImage->path;
        }
        return 'storage/images/profile/default-profile.jpeg';
    }

    public function getJoiningDateAttribute(): string
    {
        return $this->created_at->format('d-m-Y');
    }

    public function getRoleNameAttribute(): string
    {
        return $this->role()->display_name;
    }
}
