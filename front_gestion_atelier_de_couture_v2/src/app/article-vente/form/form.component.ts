import { Component, ElementRef, EventEmitter, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabArticleConfComponent } from './tab-article-conf/tab-article-conf.component';
import { Categorie } from 'src/app/shared/interfaces/categorie';
import { ArticleVente } from 'src/app/shared/interfaces/article-vente';
import { ArticleConfection } from 'src/app/shared/interfaces/article-confection';
import { AllData } from 'src/app/shared/interfaces/api-response';
import { TabaItems } from 'src/app/shared/interfaces/utils';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent{
  @ViewChild(TabArticleConfComponent, {static: false}) childTabArticles: TabArticleConfComponent = <TabArticleConfComponent>{};
  @ViewChild('msgInfo') msgInfo!: ElementRef;


  @Output() onSubmitEventEmmitter: EventEmitter<ArticleVente> = new EventEmitter<ArticleVente>();

  articleVenteFormGroup!: FormGroup;

  categories!:Categorie[];
  articleVentes!: ArticleVente[];
  articleConfection!: ArticleConfection[];

  url:string | ArrayBuffer = "";
  selectedImage!: File;

  coutFabrication!:number;
  validFormChild:boolean =false;

  libRef:string = "";
  catRef:string = "";
  numRef:string = "";

  // nbElemsTabArticle = this.childTabArticles.getLines;

  constructor(private fb: FormBuilder){
    this.articleVenteFormGroup = this.fb.group({
      id: [0],
      libelle: ["", [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9 ]*'), this.validateUniqueLibelle.bind(this)]], // ,[this.uniqueLibelleValidator.bind(this)]
      prix: [{value: null, disabled: true}, [Validators.required, Validators.min(10), Validators.max(1000000)]],
      stock: [, [Validators.required, Validators.min(1), Validators.max(10000)]],
      promotion: [false],
      pourcentage_val_promo: [{value: '', disabled: true}],
      marge: [, [Validators.required, this.validateMarge.bind(this)]],
      reference: [{value: "REF-", disabled: true}],
      photo: [null, [Validators.required, this.validateImage.bind(this)]],
      cout_fabrigation:[{value: this.coutFabrication, disabled: true}],
      categorie: [0, [Validators.required, Validators.min(1)]],
      article_confections:this.childTabArticles.form,
      quantites:[]
    });
  }

  ngOninit(): void {}

  
  onPromoCheckboxChange(event: Event) {
      const promoChecked = (event.target! as HTMLInputElement).checked;

      const pourcentageValPromoControl = this.articleVenteFormGroup.get('pourcentage_val_promo');

      if (promoChecked) {
        pourcentageValPromoControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(99)
        ]);
        pourcentageValPromoControl?.enable();
      } else {
        pourcentageValPromoControl?.clearValidators();
        pourcentageValPromoControl?.setValue("");
        pourcentageValPromoControl?.disable();
      }

      pourcentageValPromoControl?.updateValueAndValidity();
  }

  saveData(){
    // const article: ArticleVente = this.articleVenteFormGroup.value;  //ne donne pas les disabled
    const article: ArticleVente = this.articleVenteFormGroup.getRawValue();
    if(article.promotion){
      article.promotion = 1;
      article.pourcentage_val_promo /= 100;
    }else{
      article.promotion = 0;
    }
    if(this.selectedImage){
      article.photo = this.selectedImage
    }
    this.onSubmitEventEmmitter.emit(article);   
  }

//validation
  validateImage(control: any) {
    const file = control.value;
    if (file) {
      const allowedFormats = ['jpeg', 'png', 'jpg', 'gif'];
      const maxFileSize = 2048; // en octets
      
      const fileExtension = file.split('.').pop().toLowerCase();
      // const fileExtension = file.name.split('.').pop().toLowerCase();
      const fileSize = file.size;
      
      if (!allowedFormats.includes(fileExtension)) {
        return { invalidFormat: true };
      }
      
      if (fileSize > maxFileSize) {
        return { fileSizeExceeded: true };
      }
    }
    
    return null; // Validation réussie
  }

  validateMarge(control: any) {
    const marge = +control.value;
    const coutFabrication = this.coutFabrication;
    
    const coutFabricationMin = 500;
    const coutFabricationMax = +coutFabrication / 3;
    
    if (marge < coutFabricationMin || marge > coutFabricationMax) {
      return { invalidMarge: true };
    }

    this.articleVenteFormGroup.get("prix")?.setValue(this.coutFabrication+marge);
  
    return null;
  }

  validateUniqueLibelle(control: any) {
    const libelle = control.value.trim().toLowerCase();
    if(this.articleVentes?.some(article => article.libelle.toLowerCase() === libelle)){
      return { invalidUniq: true};
    }
    return null;
  }


  setAllData(allData: AllData){
    this.categories = allData.categories;
    this.articleConfection = allData.articleConfection;
    this.articleVentes = allData.articleVentes;
    this.childTabArticles.setArticleConfections(allData.articleConfection);
  }

  onCoutFabricationTotalChanged(cout: number) {
    this.coutFabrication = cout;
    this.articleVenteFormGroup.get("cout_fabrigation")?.setValue(this.coutFabrication)
    
  }

  onItemsArticleConfChanged(tabArticles: TabaItems){
    this.validFormChild = tabArticles.valid;
    this.articleVenteFormGroup.get('article_confections')?.setValue(tabArticles.ids);
    this.articleVenteFormGroup.get('quantites')?.setValue(tabArticles.quantites);
  }

  onLibelleChange(event: Event){
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = target.value.trim();
      this.libRef = (value.substring(0, 5));
      this.articleVenteFormGroup.get('reference')?.setValue(setRefererence(this.libRef, this.catRef, this.numRef));
      
    }

  }

  onCategoryChange(event:Event){
    const target = event.target as HTMLInputElement;
    if (target) {
      const idCategory = +target.value
      const categorie = getCategoryById(idCategory, this.categories);
      if (categorie) {
        this.catRef = categorie!.libelle;
        this.numRef = (nobrOcCategorieInArticle(idCategory, this.articleConfection)+1).toString();
        this.articleVenteFormGroup.get('reference')?.setValue(setRefererence(this.libRef, this.catRef, this.numRef));
      }  
    }
  }

  onImageChange(event: Event): void {
    const selectedFile = (event.target as HTMLInputElement).files![0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      this.selectedImage = selectedFile;
      // this.articleVenteFormGroup.get('photo')?.setValue(this.selectedImage);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e: any) => {
        this.url = e.target.result;
      };
      
    } else {
      alert('Choix incorrect');
    }
  }
}


function  setRefererence(libRef:string, categoryRef:string, numRef:string){

  return ("REF-" + (libRef ?? "") + "-" + (categoryRef ?? "") + "-" + (numRef ?? "")).toUpperCase();
}


function getCategoryById(id:number, categories:Categorie[]): Categorie|undefined{
  for (const iterator of categories) {
    if (iterator.id === id) return iterator;
  }
  return undefined;
}

function  nobrOcCategorieInArticle(val:number, articles:ArticleConfection[]): number{
  let count = 0;
  for (const iterator of articles) {
    if((iterator.categorie as Categorie).id === val) count++;
  }
  return count;
}