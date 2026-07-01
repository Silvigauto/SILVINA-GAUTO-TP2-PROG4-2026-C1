import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsuarios } from './dashboard-usuarios';

describe('DashboardUsuarios', () => {
  let component: DashboardUsuarios;
  let fixture: ComponentFixture<DashboardUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
