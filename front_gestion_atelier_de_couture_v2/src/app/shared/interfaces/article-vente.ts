import { AbstractModelArticle, Paginate } from "./abstract-model"
import { ArticleConfection } from "./article-confection"

export interface ArticleVente extends AbstractModelArticle {
  promotion: number
  pourcentage_val_promo: number
  marge: number
  cout_fabrigation: number
  quantites?: number[]
  article_confections: ArticleConfection[] | number[]
}

export interface ArticleVentePaginate extends Paginate{
  data: ArticleVente[]
}
