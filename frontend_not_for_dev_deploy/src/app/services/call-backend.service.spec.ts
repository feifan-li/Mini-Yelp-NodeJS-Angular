import { TestBed } from '@angular/core/testing';

import { CallBackendService } from './call-backend.service';

describe('CallBackendService', () => {
  let service: CallBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
