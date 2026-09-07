// app/Models/Company.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name', 'about', 'mission', 'vision', 'location',
        'delivery_info', 'phones', 'email', 'social_links'
    ];

    protected $casts = [
        'phones' => 'array',
        'social_links' => 'array',
    ];

    public function services(): HasMany
    {
        return $this->hasMany(Service::class)->orderBy('order');
    }

    public function advantages(): HasMany
    {
        return $this->hasMany(Advantage::class)->orderBy('order');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class)->orderBy('id');
    }

    public function vehicleTypes(): HasMany
    {
        return $this->hasMany(VehicleType::class)->orderBy('order');
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class)->orderBy('order');
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(GalleryImage::class)->orderBy('order');
    }
}

// app/Models/Service.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = ['company_id', 'name', 'description', 'order'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}

// app/Models/Product.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = ['company_id', 'name', 'category', 'price', 'description', 'image'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}

// app/Models/User.php (update)
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}