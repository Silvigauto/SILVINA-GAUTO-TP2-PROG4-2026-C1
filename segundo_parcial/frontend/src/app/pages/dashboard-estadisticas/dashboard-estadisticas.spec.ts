import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEstadisticas } from './dashboard-estadisticas';

describe('DashboardEstadisticas', () => {
  let component: DashboardEstadisticas;
  let fixture: ComponentFixture<DashboardEstadisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEstadisticas],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEstadisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
