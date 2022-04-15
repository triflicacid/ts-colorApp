import * as uuid from 'uuid';

/**
 * Manage access tokens
 * Map UUID.v4 to Accounts.ID link, which is used during login
*/
interface IAuthorisation {
  create: (accountID: number, time?: number) => string,
  remove: (id: string) => boolean,
  exists: (id: string) => boolean,
  get: (id: string, remove?: boolean) => number | undefined;
}

export const authorisation = (function (): IAuthorisation {
  let map = new Map<string, number>();
  return {
    create: function (accountID: number, time = 1000) {
      const id = uuid.v4();
      map.set(id, accountID);
      console.log(`[auth]: linked id "${id}" to account #${accountID}`);
      setTimeout(() => this.remove(id), time); // Remove UUID after a short delay
      return id;
    },
    remove: function (id: string) {
      console.log(`[auth]: removed id "${id}"`);
      return map.delete(id);
    },
    exists: (id: string) => map.has(id),
    get: function (id: string, remove = true) {
      const aid = map.get(id);
      if (remove) map.delete(id);
      return aid;
    }
  };
})();