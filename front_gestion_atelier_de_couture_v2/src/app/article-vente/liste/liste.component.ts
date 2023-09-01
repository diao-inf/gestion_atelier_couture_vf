import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AllData } from 'src/app/shared/interfaces/api-response';
import { ArticleVente, ArticleVentePaginate } from 'src/app/shared/interfaces/article-vente';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent {
  @ViewChild('msgInfo') msgInfo!: ElementRef;

  @Output() deleteOrUpdateArticleEventOnItem: EventEmitter<ArticleVente | number> = new EventEmitter<ArticleVente | number>();
  @Output() paginationEmitter: EventEmitter<number> = new EventEmitter<number>();

  articles!:ArticleVentePaginate;

  // currentPage: number = 1;
  // totalElements: number = 0;
  // totalPages: number = 0;
  pages: number[] = []; 

  setAllData(data: AllData){
    this.articles = data.articleVentesPaginate;
    // this.pages = Array.from({ length: this.articles.total }, (_, i) => i + 1);
    this.pages = Array.from({ length: this.articles.last_page }, (_, i) => i + 1);
  }

  recevoirArticleDelete(article: ArticleVente | number){
    this.deleteOrUpdateArticleEventOnItem.emit(article);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.articles.total) {
      // const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
      // if (selectAllCheckbox.checked){
        //   selectAllCheckbox.checked = false;
        // }
        // this.fetchCategories();
      this.paginationEmitter.emit(pageNumber);
      this.articles.current_page = pageNumber;
    }
}
}
