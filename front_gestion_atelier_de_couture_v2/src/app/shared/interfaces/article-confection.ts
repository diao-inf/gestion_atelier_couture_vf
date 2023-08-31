import { AbstractModelArticle } from "./abstract-model"
import { Fournisseur } from "./fournisseur"

export interface ArticleConfection extends AbstractModelArticle {
    fournisseurs: Fournisseur[] | number[]
}

