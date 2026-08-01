import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiposVehiculoPage } from './tipos-vehiculo.page';

describe('TiposVehiculoPage', () => {
  let component: TiposVehiculoPage;
  let fixture: ComponentFixture<TiposVehiculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposVehiculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
