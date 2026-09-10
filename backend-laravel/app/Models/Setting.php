<?php
// app/Models/Setting.php
namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['group', 'key', 'value', 'type', 'options'];
    
    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }
    
    public static function set($key, $value)
    {
        $setting = static::where('key', $key)->first();
        if ($setting) {
            $setting->update(['value' => $value]);
        } else {
            static::create(['key' => $key, 'value' => $value]);
        }
    }
}