import { ArticleConfection } from "./article-confection"
import { ArticleVente, ArticleVentePaginate } from "./article-vente"
import { Categorie } from "./categorie"
import { Fournisseur } from "./fournisseur"

export interface ApiResponse<T> {
    status: number
    message: string
    data: T
}

export interface AllData {
    categories: Categorie[]
    fournisseurs: Fournisseur[]
    articleConfection: ArticleConfection[]
    articleVentes: ArticleVente[]
    articleVentesPaginate: ArticleVentePaginate
}