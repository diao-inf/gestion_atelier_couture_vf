import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AllData } from 'src/app/shared/interfaces/api-response';
import { ArticleVente } from 'src/app/shared/interfaces/article-vente';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent {
  @ViewChild('msgInfo') msgInfo!: ElementRef;

  @Output() deleteArticleEvent: EventEmitter<ArticleVente> = new EventEmitter<ArticleVente>();

  articles!:ArticleVente[];

  setAllData(data: AllData){
    this.articles = data.articleVentes;
  }

  recevoirArticleDelete(article: ArticleVente){
    this.deleteArticleEvent.emit(article);
  }
}
