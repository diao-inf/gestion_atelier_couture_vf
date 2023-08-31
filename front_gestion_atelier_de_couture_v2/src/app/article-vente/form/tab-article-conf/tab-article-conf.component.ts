import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ArticleConfection } from 'src/app/shared/interfaces/article-confection';
import { Categorie } from 'src/app/shared/interfaces/categorie';
import { TabaItems } from 'src/app/shared/interfaces/utils';

@Component({
  selector: 'app-tab-article-conf',
  templateUrl: './tab-article-conf.component.html',
  styleUrls: ['./tab-article-conf.component.css']
})
export class TabArticleConfComponent {
  form!: FormGroup;

  articleConfections!: ArticleConfection[];
  // selectedArticleConfections!: ArticleConfection[];
  @Output() coutFabricationTotalChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemsArticleConfChanged: EventEmitter<TabaItems> = new EventEmitter<TabaItems>();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    for (let index = 0; index < 3; index++) {
      this.items.push(createLine(this.formBuilder, this.validateUniqueLibelle.bind(this), this.validateQuantite.bind(this)));
    }
    // this.validateItems()
  }



  addItem() {
    this.items.push(createLine(this.formBuilder, this.validateUniqueLibelle.bind(this), this.validateQuantite.bind(this)));
  }

  removeItem(index: number) {
    if(this.items.length > 3)this.items.removeAt(index);
  }

  get items(){
    return this.form.controls["items"] as FormArray;
  }

  setArticleConfections(articles: ArticleConfection[]){
    this.articleConfections = articles;
    // this.items.setValidators(this.validateItems);
    // this.items.updateValueAndValidity();
  }

  validateUniqueLibelle(control: FormControl) {
    const libelle = control.value;
    const libelles = this.items.controls.map(line => line.get('libelle')?.value);
  
    if (libelles.filter(l => l === libelle).length > 1) {
      return { invalidUniq: true };
    }
  
    return null;
  }

  validateQuantite(control: FormControl) {
    const quantite = control.value;
    const rawFormArray = this.form.getRawValue().items;
  
    if (quantite < 1) {
      return  { invalidQuantite: true, message: 'La quantité doit être au moins 1.' };
    }
  
    const index = rawFormArray.findIndex((item: any) => item.libelle === control.parent?.get('libelle')?.value);
    const articleQuantite = this.articleConfections.find(article => article.id === control.parent?.get('libelle')?.value)?.stock;
    
    
    if (index !== -1 && articleQuantite && quantite > articleQuantite) {
      return { invalidQuantite: true, message: `La quantité doit être inférieure ou égale à ${articleQuantite}.` };
    }
  
    return null;
  }
  
  validateItems(): ValidationErrors | null {
    const ids: number[] = this.items.controls.map((control: any) => +control.get('libelle')?.value);
    

    const articlesFound = this.articleConfections.filter(article => ids.includes(article.id as number));

    const categoriesFound = articlesFound.map(article => (article.categorie as Categorie).libelle.toLowerCase());
    
    let valid: boolean = false;
    
    if (!categoriesFound.includes('tissu') || !categoriesFound.includes('bouton') || !categoriesFound.includes('fil')) {
      // this.form.markAsPending(); // Marquer le formulaire comme en attente
      valid =false;
      return { invalidItems: true, message: 'Au moins un objet de chaque type (tissu, bouton et fil) doit être sélectionné.' };
      
    }

    const quantites: number[] = this.items.controls.map((control: any) => +control.get('quantite')?.value);

    const allQuantitiesValid = quantites.every(quantite => quantite >= 1);

    if (!allQuantitiesValid) {
      // this.form.markAsPending(); // Marquer le formulaire comme en attente
      valid =false;
      return { invalidItems: true, message: 'Au moins une quantité n\'est pas valide (inférieure ou égale à 1).' };
    }
    
    let coutFabricationTotal = 0;
    for (let index = 0; index < articlesFound.length; index++) {
      coutFabricationTotal += quantites[index] * articlesFound[index].prix
    }

    valid =true;
    this.coutFabricationTotalChanged.emit(coutFabricationTotal);
    this.itemsArticleConfChanged.emit(new TabaItems(quantites,ids, valid));
    // this.form.markAsPristine();

    return null;
    ;
  }

  getBorderClasses(items: any): { [className: string]: boolean } {
    const borderClasses:{[key: string]: boolean} = {
      'border': true,
      'border-3': true
    };
  
    if (items.touched || items.dirty) {
      if (this.validateItems() != null) {
        borderClasses['border-danger'] = true;
        borderClasses['border-success'] = false;
      } else if (this.validateItems() == null) {
        borderClasses['border-danger'] = false;
        borderClasses['border-success'] = true;
      }
    } else {
      borderClasses['border-danger'] = false;
      borderClasses['border-success'] = false;
    }
  
    return borderClasses;
  }
  
}

function createLine(formBuilder: FormBuilder, validate: Validators, validateQuantite: Validators){
  const line = formBuilder.group({
    libelle: [null, [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9 ]*'), validate]],
    quantite: [null, [Validators.required, Validators.min(1), validateQuantite]]
  });
  return line;
}