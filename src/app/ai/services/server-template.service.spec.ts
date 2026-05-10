import { TestBed } from '@angular/core/testing';

import { ServerTemplateService } from './server-template.service';

describe('ServerTemplateService', () => {
  let service: ServerTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
