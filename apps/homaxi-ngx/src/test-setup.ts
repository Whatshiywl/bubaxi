if (typeof globalThis.fetch === 'undefined') {
  // Node keeps the real Fetch API on its own global; copy it across
  const g = global as any;
  globalThis.fetch   = g.fetch;
  globalThis.Headers = g.Headers;
  globalThis.Request = g.Request;
  globalThis.Response= g.Response;
}

import { TextEncoder, TextDecoder } from 'util';
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

setupZoneTestEnv();
getTestBed().resetTestEnvironment();
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } }
);
