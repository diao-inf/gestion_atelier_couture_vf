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
