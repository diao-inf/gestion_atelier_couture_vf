import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabArticleConfComponent } from './tab-article-conf/tab-article-conf.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @ViewChild('childTabArticles', {static: true}) childTabArticles!: TabArticleConfComponent;

  articleVenteFormGroup!: FormGroup;

  coutFabrication!:number;


  constructor(private fb: FormBuilder){
    this.articleVenteFormGroup = this.fb.group({
      id: [0],
      libelle: ["", [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9 ]*')]], // ,[this.uniqueLibelleValidator.bind(this)]
      prix: ["", [Validators.required, Validators.min(10), Validators.max(1000000)]],
      stock: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      promotion: [false],
      pourcentage_val_promo: [{value: '', disabled: true}],
      marge: ["", [Validators.required, this.validateMarge.bind(this)]],
      reference: ["REF-"],
      photo: [null, [Validators.required, this.validateImage.bind(this)]],
      cout_fabrigation:[this.coutFabrication],
      categorie: [, [Validators.required, Validators.min(1)]],
      article_confections:[this.childTabArticles.getLines(), [this.validateAllArticleTypes]]
    });
  }


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
    alert("send-12");
  }

//validation
  validateImage(control: any) {
    const file = control.value;
    
    if (file) {
      const allowedFormats = ['jpeg', 'png', 'jpg', 'gif'];
      const maxFileSize = 2048; // en octets
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
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
    const marge = control.value;
    const coutFabrication = this.coutFabrication;
    
    const coutFabricationMin = 5000;
    const coutFabricationMax = coutFabrication / 3;
    
    if (marge < coutFabricationMin || marge > coutFabricationMax) {
      return { invalidMarge: true };
    }
    
    return null;
  }

  validateAllArticleTypes() {
    if(!(this.childTabArticles.getLines().length >= 3)){
      return { invalidArticleConf: true };
    }
    return null;
  }
}
