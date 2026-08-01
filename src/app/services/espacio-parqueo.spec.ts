import { TestBed } from '@angular/core/testing';

import { EspacioParqueoService } from './espacio-parqueo';

describe('EspacioParqueoService', () => {
  let service: EspacioParqueoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspacioParqueoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
