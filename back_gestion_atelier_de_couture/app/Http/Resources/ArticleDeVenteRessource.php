<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ArticleDeVenteRessource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->photo ? Storage::url($this->photo) : null;

        return [
            "id" => $this->id,
            "libelle" => $this->libelle,
            "prix" => $this->prix,
            "stock" => $this->stock,
            "promotion" => $this->promotion,
            "pourcentage_val_promo" => $this->pourcentage_val_promo,
            "reference" => $this->reference,
            "photo" => $imageUrl,
            "marge"=>$this->marge,
            "cout_fabrigation" => $this->cout_fabrigation,
            "categorie" => $this->categorie,
            "article_confections"=>$this->articles
        ];
    }
}
