import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionCard } from './publicacion-card';

describe('PublicacionCard', () => {
  let component: PublicacionCard;
  let fixture: ComponentFixture<PublicacionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
