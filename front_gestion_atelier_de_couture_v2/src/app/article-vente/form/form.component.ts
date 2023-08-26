import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  articleVenteFormGroup!: FormGroup;

  promoChecked = false;
  coutFabrication!:number;


  constructor(private fb: FormBuilder){
    this.articleVenteFormGroup = this.fb.group({
      id: [0],
      libelle: ["", [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9 ]*')]], // ,[this.uniqueLibelleValidator.bind(this)]
      prix: ["", [Validators.required, Validators.min(10), Validators.max(1000000)]],
      stock: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      promotion: [false],
      pourcentage_val_promo: [],
      marge: ["", [Validators.required, this.validateMarge.bind(this)]],
      reference: ["REF-"],
      photo: [null, [Validators.required, this.validateImage.bind(this),Validators.min(1), Validators.max(99)]],
      categorie: [, [Validators.required, Validators.min(1)]],
      cout_fabrigation:[this.coutFabrication],
    });
  }


  onPromoCheckboxChange(event: Event) {
      this.promoChecked = (event.target! as HTMLInputElement).checked;

      if (this.promoChecked) {
        this.articleVenteFormGroup.get('pourcentage_val_promo')?.setValidators([Validators.required]);
      } else {
        this.articleVenteFormGroup.get('pourcentage_val_promo')?.clearValidators();
      }
      this.articleVenteFormGroup.get('pourcentage_val_promo')?.updateValueAndValidity();
  }

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

}
