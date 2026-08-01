import { TestBed } from '@angular/core/testing';

import { TarifaService } from './tarifa';

describe('TarifaService', () => {
  let service: TarifaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarifaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
