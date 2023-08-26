import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabArticleConfComponent } from './tab-article-conf.component';

describe('TabArticleConfComponent', () => {
  let component: TabArticleConfComponent;
  let fixture: ComponentFixture<TabArticleConfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabArticleConfComponent]
    });
    fixture = TestBed.createComponent(TabArticleConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
