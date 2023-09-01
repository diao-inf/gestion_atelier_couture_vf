import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleVente } from 'src/app/shared/interfaces/article-vente';
import { Categorie } from 'src/app/shared/interfaces/categorie';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() InputArticle!: ArticleVente;
  // @Output() eventEmittedUpdate = new EventEmitter<ArticleVente>();
  @Output() eventEmittedDeleteOrUpdate = new EventEmitter<ArticleVente | number>();

  buttonText = 'Supprimer';
  showConfirmation = false;
  countdown = 3;



  editer(item: ArticleVente){
    // this.eventEmittedUpdate.emit(item);
    this.eventEmittedDeleteOrUpdate.emit(item)
    
  }

  supprimer(item: number){
    if (this.showConfirmation) {
      this.eventEmittedDeleteOrUpdate.emit(item)
    } else {
      this.showConfirmation = true;
      this.updateCountdown();

      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.buttonText = 'Supprimer';
          this.showConfirmation = false;
          this.countdown = 3; // Reset countdown for next click
        } else {
          this.updateCountdown();
        }
      }, 1000);
  }
}

  updateCountdown() {
    this.buttonText = `Confirmer (${this.countdown})`;
  }

  get buttonClass() {
    return {
      'confirmation-active': this.showConfirmation
    };
  }



  getFullImageUrl(relativePath: string | File): string {
    if (relativePath && typeof relativePath === 'string') {
      const cleanImageUrl = relativePath.replace('/storage', '');
    
      return `${environment.api.baseUrlImage}/${cleanImageUrl}`;
    }
    return '';
  }

  getCategorieLibelle(categorie: number | Categorie): string {
    if (typeof categorie === 'number') {
      return 'Numéro de catégorie : ' + categorie;
    } else if (categorie as Categorie) {
      return categorie.libelle;
    } else {
      return 'Categorie inconnue';
    }
  }
  
}
