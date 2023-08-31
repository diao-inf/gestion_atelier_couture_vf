import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ArticleVenteComponent } from './article-vente/article-vente.component';
import { FormComponent } from './article-vente/form/form.component';
import { TabArticleConfComponent } from './article-vente/form/tab-article-conf/tab-article-conf.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListeComponent } from './article-vente/liste/liste.component';
import { ItemComponent } from './article-vente/liste/item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleVenteComponent,
    FormComponent,
    TabArticleConfComponent,
    ListeComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
