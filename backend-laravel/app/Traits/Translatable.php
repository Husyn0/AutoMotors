<?php

namespace App\Traits;

use Illuminate\Support\Facades\App;

trait Translatable
{
    /**
     * Relations (that also use Translatable) that should be
     * expanded by toTranslatedArray(). Override in the model.
     */
    protected function translatableRelations(): array
    {
        return [];
    }

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

        // Expand requested translatable relations (e.g. Product->category)
        foreach ($this->translatableRelations() as $relation) {
            if ($this->relationLoaded($relation) && $this->{$relation}) {
                $related = $this->{$relation};
                $data[$relation] = method_exists($related, 'toTranslatedArray')
                    ? $related->toTranslatedArray($locale)
                    : $related->toArray();
            }
        }
        // Auto-expose image URLs for any raw path columns the model declares.
        if (method_exists($this, 'imageColumns') && method_exists($this, 'imageUrlFor')) {
            foreach ($this->imageColumns() as $col) {
                $raw = $data[$col] ?? $this->getAttribute($col);
                $data[$col . '_url'] = $this->imageUrlFor($raw);
            }
        }

        return $data;
    }
}