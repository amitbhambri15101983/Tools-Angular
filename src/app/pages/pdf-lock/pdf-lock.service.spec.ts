import { TestBed } from '@angular/core/testing';

import { PdfLockService } from './pdf-lock.service';

describe('PdfLockService', () => {
  let service: PdfLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfLockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
