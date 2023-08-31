import { TestBed } from '@angular/core/testing';

import { ArticleVenteService } from './article-vente.service';

describe('ArticleVenteService', () => {
  let service: ArticleVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
