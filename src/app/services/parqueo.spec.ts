import { TestBed } from '@angular/core/testing';

import { ParqueoService } from './parqueo';

describe('ParqueoService', () => {
  let service: ParqueoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParqueoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
