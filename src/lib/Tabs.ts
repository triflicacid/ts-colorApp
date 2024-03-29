type TabMap = Map<string, ITabInfo>;

export interface ITabInfo {
  content: HTMLElement;
  text: string | Node; // Text to show on tab
  btn?: HTMLElement; // "Button" which is generated by the Tab class internally
}

export class Tabs {
  private _wrapper: HTMLDivElement; // Wrapper for tabs
  private _tabContainer: HTMLDivElement;
  private _map: TabMap;
  private _openTab: string | null;
  public onTabOpen: (tab: string) => void;

  /**
   * @param target - Where to place all the tabs and the controller
   * @param map - Object of tab information
   * @params pos - `-1` = bottom, `0` = none, `1` = top
   */
  constructor(target: HTMLDivElement, map: TabMap, pos: -1 | 0 | 1 = 0) {
    this._wrapper = target;

    // Check each tab has some associated content
    map.forEach((tab, name) => {
      if (!(tab.content instanceof HTMLElement)) throw new TypeError(`Tabs: name '${name}' does not map to an html element -> got type ${typeof tab.content}: ${tab.content}`);
    });
    this._map = map;

    // Container for tabs
    this._tabContainer = document.createElement('div');
    this._tabContainer.classList.add('tab-container');
    this._openTab = null;
    const ctrl = this.generateController();
    if (pos === -1) ctrl.classList.add('pos-bottom');
    if (pos === 1) ctrl.classList.add('pos-top');
    this._wrapper.appendChild(ctrl);
    this._wrapper.appendChild(this._tabContainer);
    this.onTabOpen = () => void 0;

    this.closeAll();
  }

  /**
   * Generate <div/> with buttons for each tab.
   * <div/> class: "tab-controller"
   * tab button class= : "tab-control-btn"
   */
  public generateController(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add('tab-controller');

    this._map.forEach((tab, name) => {
      const btn = document.createElement("span");
      tab.content.classList.add('tab-content');
      tab.content.dataset.tabName = name;
      btn.classList.add('tab-control-btn');
      btn.dataset.tab = name;
      btn.dataset.open = "false";
      btn.addEventListener('click', () => this.toggle(name));
      btn.append(tab.text);
      div.appendChild(btn);
      tab.btn = btn;
    });

    return div;
  }

  /** Open tab with given String name */
  public open(name: string) {
    if (!this._map.has(name)) throw new Error(`#<Tabs>.open: unknown tab reference '${name}'`);
    if (this._openTab) this.close(this._openTab);

    this._openTab = name;
    ((this._map.get(name) as ITabInfo).btn as HTMLButtonElement).dataset.open = "true";
    this._tabContainer.appendChild((this._map.get(this._openTab) as ITabInfo).content); // Add tab content to document
    this.onTabOpen(name);
  }

  /** Close tab with given tab name */
  public close(name: string) {
    if (!this._map.has(name)) throw new Error(`#<Tabs>.open: unknown tab reference '${name}'`);
    if (this._openTab === name) this._openTab = null;
    const tab = this._map.get(name) as ITabInfo;
    (tab.btn as HTMLButtonElement).dataset.open = "false";
    tab.content.remove();// Remove tab content from document
  }

  /** Toggle state of tab with given name */
  public toggle(name: string) {
    if (this._openTab === name) {
      this.close(name);
    } else {
      this.open(name);
    }
  }

  /** Close all tabs */
  public closeAll() {
    this._map.forEach((tab, name) => {
      tab.content.remove();
      (tab.btn as HTMLButtonElement).dataset.open = "false";
    });
  }

  /** Create empty tab map */
  public static createMap(): TabMap {
    return new Map<string, ITabInfo>();
  }
}