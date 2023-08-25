<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;


class ArticleDeVentesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'libelle' => 'required|unique:article_de_ventes|min:5|regex:/^[A-Za-z0-9 ]+$/',
            'reference' => 'required|unique:article_de_ventes',
            'promotion' => 'required|boolean',
            'pourcentage_val_promo' => 'required|numeric|min:0.00005|max:1',
            'stock' => 'required|integer|min:0',
            'marge' => 'required|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'categorie_id' => 'required|exists:categories,id',
            'article_conception_ids' => 'required|array|min:3',
            'article_conception_ids.*' => 'exists:articles,id',
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $data = [
            'status' => 422,
            'success' => false,
            'error' => true,
            'message' => 'Erreur de validation',
            'errorsList' => $validator->errors()
        ];
        throw new HttpResponseException(response()->json($data,422));
    }

    public function messages()
{
    return [
        'libelle.required' => 'Le champ libellé est obligatoire.',
        'libelle.unique' => 'Ce libellé est déjà utilisé.',
        'libelle.min' => 'Le libellé doit avoir au moins :min caractères.',
        'libelle.regex' => 'Le libellé ne peut contenir que des lettres, des chiffres et des espaces.',

        'reference.required' => 'Le champ référence est obligatoire.',
        'reference.unique' => 'Cette référence est déjà utilisée.',

        'promotion.required' => 'Veuillez spécifier si l\'article est en promotion.',
        'promotion.boolean' => 'La valeur de promotion doit être vraie ou fausse.',

        'pourcentage_val_promo.required' => 'Le champ pourcentage de valeur en promotion est obligatoire.',
        'pourcentage_val_promo.numeric' => 'Le pourcentage de valeur en promotion doit être numérique.',
        'pourcentage_val_promo.min' => 'Le pourcentage de valeur en promotion doit être au moins :min.',
        'pourcentage_val_promo.max' => 'Le pourcentage de valeur en promotion ne peut pas dépasser :max.',

        'stock.required' => 'Le champ stock est obligatoire.',
        'stock.integer' => 'La valeur du stock doit être un entier.',
        'stock.min' => 'Le stock ne peut pas être inférieur à :min.',

        'marge.required' => 'Le champ marge est obligatoire.',
        'marge.numeric' => 'La valeur de la marge doit être numérique.',
        'marge.min' => 'La marge ne peut pas être inférieure à :min.',

        'photo.image' => 'La photo doit être une image.',
        'photo.mimes' => 'La photo doit être au format : :values.',
        'photo.max' => 'La taille de la photo ne peut pas dépasser :max kilo-octets.',

        'categorie_id.required' => 'Veuillez sélectionner une catégorie.',
        'categorie_id.exists' => 'La catégorie sélectionnée n\'existe pas.',
        
        'article_conception_ids.required' => 'Veuillez sélectionner au moins :min articles de conception.',
        'article_conception_ids.array' => 'Les articles de conception doivent être sous forme de tableau.',
        'article_conception_ids.min' => 'Sélectionnez au moins :min articles de conception.',
        'article_conception_ids.*.exists' => 'Un des articles de conception sélectionnés n\'existe pas.',
    ];
}

}
