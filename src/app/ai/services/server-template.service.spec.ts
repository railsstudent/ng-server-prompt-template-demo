import { TestBed } from '@angular/core/testing';
import { ServerTemplateService } from './server-template.service';
import { SERVER_TEMPLATE_MODEL } from '../constants/server-template-model.token';

describe('ServerTemplateService', () => {
  let service: ServerTemplateService;
  let mockModel: any;

  beforeEach(() => {
    mockModel = {
      generateContent: jasmine.createSpy('generateContent').and.returnValue(
        Promise.resolve({
          response: { candidates: [] },
        }),
      ),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: SERVER_TEMPLATE_MODEL, useValue: mockModel }],
    });
    service = TestBed.inject(ServerTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
