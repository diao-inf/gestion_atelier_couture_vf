import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ArticleVenteComponent } from './article-vente/article-vente.component';
import { FormComponent } from './article-vente/form/form.component';
import { TabArticleConfComponent } from './article-vente/form/tab-article-conf/tab-article-conf.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ArticleVenteComponent,
    FormComponent,
    TabArticleConfComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
