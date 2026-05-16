import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { ConfigService } from './features/ai/services/config.service';
import { TemplateConfigService } from './features/ai/services/template-config.service';
import { GlobalStateService } from './shared/services/global-state.service';

describe('AppComponent', () => {
  let configServiceMock: any;
  let templateConfigServiceMock: any;
  let globalStateServiceMock: any;

  beforeEach(async () => {
    configServiceMock = {
      remoteConfig: {},
    };
    templateConfigServiceMock = {
      setupRemoteConfigListener: jasmine.createSpy('setupRemoteConfigListener'),
      getTemplateValue: jasmine.createSpy('getTemplateValue').and.returnValue('test-template-id'),
    };
    globalStateServiceMock = {
      status: signal('Idle'),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ConfigService, useValue: configServiceMock },
        { provide: TemplateConfigService, useValue: templateConfigServiceMock },
        { provide: GlobalStateService, useValue: globalStateServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should correctly traverse to leaf route data for templateId', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const activatedRoute = TestBed.inject(ActivatedRoute);

    // Mock route tree
    const leafRoute = {
      snapshot: {
        data: {
          pageTitleTemplateKeyId: {
            templateKeyId: 'countryTemplateId',
          },
        },
      },
    };

    // In Angular tests, ActivatedRoute usually doesn't allow direct property assignment
    // for firstChild, so we use Object.defineProperty
    Object.defineProperty(activatedRoute, 'firstChild', { value: leafRoute });

    // Trigger navigation end
    // Router events is an Observable, we can cast it to Subject if it's mocked by provideRouter
    // In many setups, it's a ReplaySubject or similar.
    (router.events as any).next(new NavigationEnd(1, '/test', '/test'));

    // Detect changes to update signals
    fixture.detectChanges();

    expect(component.templateId()).toBe('test-template-id');
    expect(templateConfigServiceMock.getTemplateValue).toHaveBeenCalledWith('countryTemplateId');
  });
});
