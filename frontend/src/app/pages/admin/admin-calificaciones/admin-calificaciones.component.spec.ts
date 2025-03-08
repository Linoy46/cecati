import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCalificacionesComponent } from './admin-calificaciones.component';

describe('AdminCalificacionesComponent', () => {
  let component: AdminCalificacionesComponent;
  let fixture: ComponentFixture<AdminCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCalificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
