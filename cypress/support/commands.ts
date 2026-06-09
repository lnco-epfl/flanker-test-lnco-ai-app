/// <reference types="../../src/window" />
import { Database } from '@lnco-ai/apps-query-client';

import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';
import { MOCK_SERVER_ITEM } from '../fixtures/mockItem';

type AppContextLike = {
  itemId: string;
  apiHost: string;
  accountId?: string;
  memberId?: string;
  [key: string]: unknown;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setUpApi(
        database: Partial<Database>,
        appContext: Partial<AppContextLike>,
      ): void;
    }
  }
}

Cypress.Commands.add('setUpApi', (database, appContext) => {
  Cypress.on('window:before:load', (win: Window) => {
    win.indexedDB.deleteDatabase('graasp-app-cypress-v3');
    const actorIdentity: Partial<AppContextLike> = {
      accountId: CURRENT_MEMBER.id,
    };
    // eslint-disable-next-line no-param-reassign
    win.appContext = {
      itemId: MOCK_SERVER_ITEM.id,
      apiHost: Cypress.env('VITE_API_HOST'),
      ...actorIdentity,
      ...appContext,
    } as Window['appContext'];
    // eslint-disable-next-line no-param-reassign
    win.database = {
      appData: [],
      appActions: [],
      appSettings: [],
      members: Object.values(MEMBERS),
      items: [MOCK_SERVER_ITEM],
      ...database,
    };
  });
});
