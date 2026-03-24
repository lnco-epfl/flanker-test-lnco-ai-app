import { type Database, useLocalContext } from '@graasp/apps-query-client';

type LocalContext = ReturnType<typeof useLocalContext>;

declare global {
  interface Window {
    appContext: LocalContext;
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
