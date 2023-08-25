<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_de_ventes', function (Blueprint $table) {
            $table->id();
            $table->string("libelle", 50)->unique()->min(5);
            $table->string("reference")->unique();
            $table->boolean("promotion");
            $table->decimal('pourcentage_val_promo', 10, 5)->min(0.00005)->max(1);
            $table->decimal('prix', 10, 2);
            $table->integer("stock");
            $table->decimal('cout_fabrigation', 10, 2);
            $table->decimal('marge', 10, 2);
            $table->string('photo')->nullable();
            $table->foreignId('categorie_id')->constrained('categories');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('article_confection_vente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->onDelete('cascade');
            $table->foreignId('article_de_vente_id')->constrained('article_de_ventes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_de_ventes');
    }
};
