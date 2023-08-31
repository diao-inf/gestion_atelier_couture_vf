import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllDataService } from '../shared/services/all-data.service';
import { AllData, ApiResponse } from '../shared/interfaces/api-response';
import { FormComponent } from './form/form.component';
import { ArticleVente } from '../shared/interfaces/article-vente';
import { ArticleVenteService } from '../shared/services/article-vente.service';
import { ListeComponent } from './liste/liste.component';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})
export class ArticleVenteComponent implements OnInit {
  @ViewChild(FormComponent, {static: false}) childForm: FormComponent = <FormComponent>{};
  @ViewChild(ListeComponent, {static: false}) childListe: ListeComponent = <ListeComponent>{};

  // allData!: AllData;

  constructor(private allDataService: AllDataService, private articleVenteService: ArticleVenteService){}

  ngOnInit() {
    this.allDataService.getAll().subscribe({
      next: 
      (response:ApiResponse<AllData>) => {
        // this.allData = response.data;
        this.childForm.setAllData(response.data);
        this.childListe.setAllData(response.data);
      },
      error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
      complete: () => console.log('Observer got a complete notificationcool tout ok'),
    });
  };



  onSubmitEventEmmitter(article: ArticleVente){
    this.articleVenteService.add(article).subscribe({
      next: 
      (response:ApiResponse<ArticleVente>) => {
        if(response.status == 200){
          this.childListe.articles.unshift(response.data);
          this.childForm.articleVenteFormGroup.reset();
          this.childForm.url = "";
          afficherMessage(this.childForm.msgInfo, response.message, "alert-success");
        }else{
          afficherMessage(this.childForm.msgInfo, response.message, "alert-danger");
        }
      },
      error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
      complete: () => console.log('Observer got a complete notificationcool tout ok'),
    });
  }

  recevoirArticleOnDelete(article: ArticleVente){
    this.articleVenteService.delete(article.id!).subscribe(
      {
        next: 
        (response:ApiResponse<ArticleVente>) => {
          if(response.status == 200){
            this.childListe.articles = this.childListe.articles.filter(item => item.id !== response.data.id);
            afficherMessage(this.childForm.msgInfo, response.message, "alert-success");
          }else{
            afficherMessage(this.childForm.msgInfo, response.message, "alert-danger");
          }
        },
        error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
        complete: () => console.log('Observer got a complete notificationcool tout ok'),
      }
    )
  }
}


function afficherMessage(viewChild: ElementRef, texte: string, classe: string): void {
  const element: HTMLElement | null = viewChild?.nativeElement;
  if (element) {
    viewChild.nativeElement.style.display = 'block';
    viewChild.nativeElement.classList.add(classe);
    element.innerHTML = `<marquee loop="1" behavior="slide" scrollamount="150" direction="left">${texte}</marquee>`;
    setTimeout(() => {
      viewChild.nativeElement.style.display = 'none';
      viewChild.nativeElement.classList.remove(classe);
      element.innerHTML = '';
    }, 5000);
  }
}