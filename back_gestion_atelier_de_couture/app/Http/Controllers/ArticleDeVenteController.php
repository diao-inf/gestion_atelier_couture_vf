<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleDeVentesRequest;
use App\Http\Traits\ImageTrait;
use App\Models\Article;
use App\Models\ArticleDeVentes;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleDeVenteController extends Controller
{

    use ImageTrait;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $articlesDeVentes = ArticleDeVentes::all();
            return $this->myResponse($articlesDeVentes, "les données on été recupéreé avec succées", "200");
        } catch (Exception $e) {
            return $this->myResponse($e, "les données n'on pas été recupéreé avec succées", "500");
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ArticleDeVentesRequest $request)
    {
        try {
            $article_conception_ids = explode(",",$request->article_conception_ids);
            $article_conception_ids = array_map('intval', $article_conception_ids);
            $reference = $request->reference;

            $articlesDeConfection = Article::whereIn('id', $article_conception_ids)->get();

            $coutFabricationTotal = $this->findCoutFabricationTotal($articlesDeConfection);

            DB::BeginTransaction();
            $article = new ArticleDeVentes();
            $article->libelle = $request->libelle;
            $article->reference = $reference;
            $article->promotion = $request->promotion;
            $article->pourcentage_val_promo = $request->pourcentage_val_promo;
            $article->marge = $request->marge;

            if($request->promotion  && $request->promotion >0){
                $article->prix = $coutFabricationTotal + $request->marge;
                $article->prix = $article->prix - $request->promotion*$article->prix;
            }else{
                $article->prix = $coutFabricationTotal + $request->marge;
            }

            $article->stock = $request->stock;
            $article->cout_fabrigation =  $coutFabricationTotal;
            $article->categorie_id = $request->categorie_id;
            $article->photo = $this->upload($request->photo, $reference);
            $article->save();

            // $article->categorie()->associate($request->input('categorie_id'));
            $article->articles()->sync($article_conception_ids);

            DB::commit();
            return $this->myResponse($article, "les données on été inséré avec succées", "200");
        } catch (Exception $e) {
            DB::rollBack();
            return $this->myResponse($e, "les données n'on pas été inséré", "500");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ArticleDeVentes $articleDeVentes)
    {
        try {
            return $this->myResponse($articleDeVentes, "les données on été recupéreé avec succées", "200");
        } catch (Exception $e) {
            return $this->myResponse($e, "les données n'on pas été recupéreé avec succées", "500");
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ArticleDeVentesRequest $request, ArticleDeVentes $article)
    {
        try {
            $article_conception_ids = explode(",", $request->article_conception_ids);
            $article_conception_ids = array_map('intval', $article_conception_ids);
            $reference = $request->reference;
    
            $articlesDeConfection = Article::whereIn('id', $article_conception_ids)->get();
    
            $coutFabricationTotal = $this->findCoutFabricationTotal($articlesDeConfection);
    
            DB::beginTransaction();
    
            $article->libelle = $request->libelle;
            $article->reference = $reference;
            $article->promotion = $request->promotion;
            $article->pourcentage_val_promo = $request->pourcentage_val_promo;
            $article->marge = $request->marge;
            
            if($request->promotion  && $request->promotion >0){
                $article->prix = $coutFabricationTotal + $request->marge;
                $article->prix = $article->prix - $request->promotion*$article->prix;
            }else{
                $article->prix = $coutFabricationTotal + $request->marge;
            }
            
            $article->stock = $request->stock;
            $article->cout_fabrigation = $coutFabricationTotal;
            $article->categorie_id = $request->categorie_id;
    
            if ($request->hasFile('photo')) {
                $article->photo = $this->upload($request->file('photo'), $reference);
            }
    
            $article->save();
    
            $article->articles()->sync($article_conception_ids);
    
            DB::commit();
    
            return $this->myResponse($article, "Les données ont été mises à jour avec succès", "200");
        } catch (Exception $e) {
            DB::rollBack();
            return $this->myResponse($e, "Les données n'ont pas été mises à jour", "500");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ArticleDeVentes $article)
    {
        try {
            DB::beginTransaction();
    
            $article->articles()->detach(); 

            if ($article->photo) {
                $this->deletePhoto($article->photo);
            }
    
            $article->delete();
    
            DB::commit();
    
            return $this->myResponse(null, "L'article a été supprimé avec succès", "200");
        } catch (Exception $e) {
            DB::rollBack();
            return $this->myResponse($e, "Une erreur est survenue lors de la suppression de l'article", "500");
        }
    }



    
    private function findCoutFabricationTotal($articlesDeConfection){
        $coutFabricationTotal = 0;

        foreach ($articlesDeConfection as $articleDeConfection) {
            $coutFabricationTotal += $articleDeConfection->stock * $articleDeConfection->prix;
        }

        return $coutFabricationTotal;
    }

    private function deletePhoto($photoPath){
        $fullPath = public_path($photoPath);

        if (file_exists($fullPath)) {
            unlink($fullPath); 
        }
    }

}
