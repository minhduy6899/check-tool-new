import { TestBed } from '@angular/core/testing';

import { ServicedService } from './serviced.service';

describe('ServicedService', () => {
  let service: ServicedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
