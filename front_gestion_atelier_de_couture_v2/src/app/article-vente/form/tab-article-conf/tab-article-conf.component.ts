import { Component } from '@angular/core';

@Component({
  selector: 'app-tab-article-conf',
  templateUrl: './tab-article-conf.component.html',
  styleUrls: ['./tab-article-conf.component.css']
})
export class TabArticleConfComponent {
  
  lines = [
    { label: '', quantity: '' },
    { label: '', quantity: '' },
    { label: '', quantity: '' },
  ];


  addLine() {
      this.lines.push({ label: '', quantity: '' });
  }

  removeLine(index: number) {
      if(this.lines.length > 3) this.lines.splice(index, 1);
  }

  getLines(){
    return this.lines;
  }

}
