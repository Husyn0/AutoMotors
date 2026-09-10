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

        // If locale is the default (fr), return the raw attribute
        if ($locale === config('app.fallback_locale', 'fr')) {
            return $this->getAttribute($field);
        }

        $translations = $this->translations ?? [];

        return $translations[$locale][$field]
            ?? $this->getAttribute($field); // fallback to default
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

        // Optionally remove raw translations to keep response clean
        unset($data['translations']);

        return $data;
    }

    /**
     * Scope: return translated model (single).
     */
    public function translated(?string $locale = null): array
    {
        return $this->toTranslatedArray($locale);
    }
}