<?php

namespace App\Traits;

use Illuminate\Support\Facades\App;

trait Translatable
{
    /**
     * Get a translated attribute value based on current locale.
     */
    public function translate(string $field, ?string $locale = null): ?string
    {
        $locale = $locale ?: App::getLocale();
        $fallback = config('app.fallback_locale', 'fr');

        if ($locale === $fallback) {
            return $this->getAttribute($field);
        }

        $translations = $this->translations ?? [];

        return $translations[$locale][$field]
            ?? $this->getAttribute($field);
    }

    /**
     * Return the model as array with translated fields merged in.
     */
    public function toTranslatedArray(?string $locale = null): array
    {
        $locale = $locale ?: App::getLocale();
        $data = $this->toArray();
        $translations = $this->translations ?? [];

        if (isset($translations[$locale])) {
            foreach ($translations[$locale] as $field => $value) {
                if (array_key_exists($field, $data)) {
                    $data[$field] = $value;
                }
            }
        }

        unset($data['translations']);

        return $data;
    }
}