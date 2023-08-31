import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AllData, ApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AllDataService {
  constructor(private httpClient:HttpClient) { }

  get endPointUrl(): string {
    return "allRessoucres";
  }

  getAll(): Observable<ApiResponse<AllData>> {
    const apiUrl = `${environment.api.baseUrl}${this.endPointUrl}`;
    return this.httpClient.get<ApiResponse<AllData>>(apiUrl).pipe(
      tap(response => {
        console.log('Données reçues:', response);
      }),
      catchError(error => {
        console.error('Une erreur s\'est produite:', error);
        return throwError(()=>new Error("Erreur lors de la récupération des données."));
      })
    );
  }
}
