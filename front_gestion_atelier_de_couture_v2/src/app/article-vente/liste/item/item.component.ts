import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleVente } from 'src/app/shared/interfaces/article-vente';
import { Categorie } from 'src/app/shared/interfaces/categorie';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() InputArticle!: ArticleVente;
  // @Output() editClicked = new EventEmitter<Article>();
  @Output() eventEmittedDelete = new EventEmitter<ArticleVente>();

  buttonText = 'Supprimer';
  showConfirmation = false;
  countdown = 3;



  editer(item: ArticleVente){
    // this.editClicked.emit(item);
    
  }

  supprimer(item: ArticleVente){
    if (this.showConfirmation) {
      this.eventEmittedDelete.emit(item)
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
      return `http://localhost:8000/public/Images${cleanImageUrl}`;
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
