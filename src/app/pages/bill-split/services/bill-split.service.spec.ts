import { TestBed } from '@angular/core/testing';

import { BillSplitService } from './bill-split.service';

describe('BillSplitService', () => {
  let service: BillSplitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillSplitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
