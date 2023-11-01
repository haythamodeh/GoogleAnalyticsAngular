import { TestBed } from '@angular/core/testing';

import { GoogleAnalyticsServiceService } from './google-analytics-service.service';

describe('GoogleAnalyticsServiceService', () => {
  let service: GoogleAnalyticsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAnalyticsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
