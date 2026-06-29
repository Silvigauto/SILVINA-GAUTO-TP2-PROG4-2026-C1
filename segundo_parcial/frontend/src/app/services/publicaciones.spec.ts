import { TestBed } from '@angular/core/testing';

import { Publicaciones } from './publicaciones';

describe('Publicaciones', () => {
  let service: Publicaciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Publicaciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
