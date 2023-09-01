import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllDataService } from '../shared/services/all-data.service';
import { AllData, ApiResponse } from '../shared/interfaces/api-response';
import { FormComponent } from './form/form.component';
import { ArticleVente } from '../shared/interfaces/article-vente';
import { ArticleVenteService } from '../shared/services/article-vente.service';
import { ListeComponent } from './liste/liste.component';
import { Mode } from '../shared/enums/enums';

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
    if(this.childForm.modeEtat === Mode.AJOUT){
      this.articleVenteService.add(article).subscribe({
        next: 
        (response:ApiResponse<ArticleVente>) => {
          if(response.status == 200){
            this.childListe.articles.data.unshift(response.data);
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
    }else{
      this.articleVenteService.update(article).subscribe({
        next: 
        (response:ApiResponse<ArticleVente>) => {
          if(response.status == 200){
            // this.childListe.articles.unshift(response.data);
            replaceObjectInArray(this.childListe.articles.data,article, response.data);
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
    
  }

  recevoirArticleOnDeleteOrUpdate(article: ArticleVente | number){
    if(typeof article == "number"){
      this.articleVenteService.delete(article).subscribe(
        {
          next: 
          (response:ApiResponse<ArticleVente>) => {
            if(response.status == 200){
              afficherMessage(this.childListe.msgInfo, response.message, "alert-success");
              this.childListe.articles.data = this.childListe.articles.data.filter(item => item.id !== response.data.id);
            }else{
              afficherMessage(this.childForm.msgInfo, response.message, "alert-danger");
            }
          },
          error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
          complete: () => console.log('Observer got a complete notificationcool tout ok'),
        }
      )
    }else if (article as ArticleVente){
      this.childForm.chargerArticleVenteFormGroup(article);
    }
    
  }

  paginationEmitte(page:number){

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

function replaceObjectInArray(arr: any[], oldObject: any, newObject: any): void {
  const index = arr.findIndex(obj => obj.id === oldObject.id);

  if (index !== -1) {
    arr[index] = newObject;
  }
}
