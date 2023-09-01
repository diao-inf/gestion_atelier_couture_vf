import { Categorie } from "./categorie"

export interface AbstractModel {
    id?: number
}


export interface AbstractModelArticle extends AbstractModel {
    libelle: string
    prix: number
    stock: number
    reference: string
    photo: string | File
    categorie: Categorie | number
}

export interface Paginate {
    current_page: number,
    first_page_url?:string, 
    last_page: number,
    last_page_url?: string,
    per_page: number,
    total: number
}
