import { CategorieType } from "../enums/enums";
import { AbstractModel } from "./abstract-model";

export interface Categorie extends AbstractModel {
    libelle: string,
    type: CategorieType
}
