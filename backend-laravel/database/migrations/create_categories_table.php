<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('icon')->nullable();
                $table->string('image')->nullable();
                $table->text('description')->nullable();
                $table->json('translations')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('products', 'category_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->unsignedBigInteger('category_id')
                    ->nullable()
                    ->after('category')
                    ->index();
            });

            // Add FK only if the DB user has the REFERENCES privilege
            // Wrapped in try/catch so a permission error doesn't abort the migration
            try {
                Schema::table('products', function (Blueprint $table) {
                    $table->foreign('category_id')
                        ->references('id')->on('categories')
                        ->nullOnDelete();
                });
            } catch (\Throwable $e) {
                // Gracefully continue without the FK constraint
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'category_id')) {
            Schema::table('products', function (Blueprint $table) {
                try {
                    $table->dropForeign(['category_id']);
                } catch (\Throwable $e) {
                    // ignore if FK was never created
                }
                $table->dropColumn('category_id');
            });
        }

        Schema::dropIfExists('categories');
    }
};