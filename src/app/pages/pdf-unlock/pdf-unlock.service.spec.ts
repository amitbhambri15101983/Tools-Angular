import { TestBed } from '@angular/core/testing';

import { PdfUnlockService } from './pdf-unlock.service';

describe('PdfUnlockService', () => {
  let service: PdfUnlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfUnlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
