<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();
        $settings = Setting::all()->groupBy('group');
        $flatSettings = [];

        foreach ($settings as $group => $items) {
            foreach ($items as $item) {
                $key = $item->key;

                if ($locale === 'en' && str_ends_with($key, '_en')) {
                    $baseKey = substr($key, 0, -3);
                    $flatSettings[$baseKey] = $item->value;
                } elseif (!str_ends_with($key, '_en')) {
                    $flatSettings[$key] = $item->value;
                }
            }
        }

        return response()->json($flatSettings);
    }

    public function update(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Setting::set($key, $value);
        }
        return response()->json(['message' => 'Settings updated successfully']);
    }
}