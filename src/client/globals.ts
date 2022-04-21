import type { Tabs } from "../lib/Tabs";
import type { Spectrum } from "../lib/color";
import type { SocketManager } from "../lib/SocketManager";
import type { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ActivePage, IClientData } from "../socket-types";

export interface IGlobals {
  title: string;
  page: ActivePage;
  color: [number, number, number];
  tabs: Tabs | undefined;
  spectra: Spectrum[];
  smgr: SocketManager<Socket<DefaultEventsMap, DefaultEventsMap>> | undefined;
  user: IClientData | undefined;
}

export const globals: IGlobals = {
  title: "Color",
  page: ActivePage.None,
  color: [0, 0, 0], // Active RGB color
  tabs: undefined,
  spectra: [],
  smgr: undefined,
  user: undefined,
};

export default globals;