import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { SingerInfoService } from './singer-info.service';

describe('SingerInfoService', () => {
  let service: SingerInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SingerInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
