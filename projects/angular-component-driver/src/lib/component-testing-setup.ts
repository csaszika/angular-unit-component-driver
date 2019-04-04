import { TestBed } from '@angular/core/testing'
import { Provider } from '@angular/core'

import { createSpyFromClass } from 'jasmine-auto-spies'

interface SetupConf {
  componentClass: any;
  driver: any;
  servicesToStub?: any[];
  declarations?: any[];
  providers?: any[];
  overrideProviders?: any[];
  imports?: any[];
}

export function componentTestingSetup({
  componentClass,
  driver: ComponentDriver,
  servicesToStub = [],
  declarations = [],
  providers = [],
  overrideProviders = [],
  imports = []
}: SetupConf) {
  servicesToStub = servicesToStub.map<Provider>(serviceClass => ({
    provide: serviceClass,
    useValue: createSpyFromClass(serviceClass)
  }));

  overrideProviders = overrideProviders.map<Provider>((componentService) => ({
    provide: componentService.clazz,
    useValue: componentService.mockValue
  }));

  TestBed.configureTestingModule({
    declarations: [componentClass].concat(declarations),
    providers: providers.concat(servicesToStub),
    imports
  }).overrideComponent(componentClass, {
    set: {
      providers: overrideProviders
    }
  });

  return {
    createComponentDriver() {
      return new ComponentDriver(TestBed.createComponent(componentClass), TestBed)
    }
  }
}
