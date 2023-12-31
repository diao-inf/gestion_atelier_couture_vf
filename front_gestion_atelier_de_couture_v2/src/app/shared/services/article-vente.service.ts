import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ArticleVente, ArticleVentePaginate } from '../interfaces/article-vente';
import { ApiResponse } from '../interfaces/api-response';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleVenteService {

  constructor(private httpClient:HttpClient) { }

  get endPointUrl(): string {
    return `${environment.api.baseUrl}artcle_ventes`;
  }

  add(article: ArticleVente): Observable<ApiResponse<ArticleVente>> {
    const apiUrl = `${this.endPointUrl}`;
    
    const formData = objectToFormData(article);

    return this.httpClient.post<ApiResponse<ArticleVente>>(apiUrl, formData).pipe(
      tap(response => {
        console.log('Données reçues aprés insertion:', response);
      }),
      catchError(error => {
        console.error('Une erreur s\'est produite:', error);
        return throwError(()=>new Error("Erreur lors de l'insertion des données."));
      })
    );
  }

  delete(articleId: number): Observable<ApiResponse<ArticleVente>> {
    const apiUrl = `${this.endPointUrl}/${articleId}`; 
    return this.httpClient.delete<ApiResponse<ArticleVente>>(apiUrl);
  }

  update(article: ArticleVente): Observable<ApiResponse<ArticleVente>> {
    const apiUrl = `${this.endPointUrl}/${article.id}`;
    const formData = objectToFormData(article);
    formData.append('_method', 'PUT');
    
    return this.httpClient.post<ApiResponse<ArticleVente>>(apiUrl, formData);
  }

  paginate(id: number): Observable<ApiResponse<ArticleVentePaginate>> {
    const apiUrl = `${this.endPointUrl}/paginations?page=${id}`;
    
    return this.httpClient.get<ApiResponse<ArticleVentePaginate>>(apiUrl).pipe(
      tap(response => {
        console.log('Données reçues :', response);
      }),
      catchError(error => {
        console.error('Une erreur s\'est produite:', error);
        return throwError(()=>new Error("Erreur lors de l'insertion des données."));
      })
    );
  }
  
}

function objectToFormData(obj: any, separateurTab:string=","): FormData {
  const formData = new FormData();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, value.map(number => number.toString()).join(separateurTab));
      
    } else if(typeof value === 'number') {
      formData.append(key, value.toString());
      
    }else if(typeof value === 'string') {

      formData.append(key, value);
    }
  });
  
  if (obj.photo) {
    formData.append('photo', obj.photo);
  }
  return formData;
}

