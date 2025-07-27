import { ISvgPublishContext } from './interfaces/ISvgPublishContext';
import { ViewService } from './services/ViewService';
import { SelectionService } from './services/SelectionService';
import { LinksService } from './services/LinksService';
import { HoverService } from './services/HoverService';
import { LayersService } from './services/LayersService';
import { IDiagramInfo } from './interfaces/IDiagramInfo';
import { IServices } from './interfaces/IServices';
import { VisioSvgParser } from './services/VisioSvgParser';
import { Utils } from './services/Utils';
import { TooltipService } from './services/TooltipService';
import { SidebarService } from './services/SidebarService';
import { ILoadEventData } from './events';

const defaultResolver = async (url: string) => {
  const response = await fetch(url);
  if (response.ok) {
    const content = await response.text();
    return content;
  } else {
    throw new Error(`Failed to load content from ${url}`);
  }
}

export class SvgPublishContext implements ISvgPublishContext {

  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: IServices;
  guid: string;

  public resolver: (url: string) => Promise<string>;

  public constructor(container: HTMLElement, resolver?: (url: string) => Promise<string>) {
    this.guid = Utils.generateUniqueId();
    this.container = container;
    this.events = new EventTarget;
    this.services = {};
    this.resolver = resolver || defaultResolver;
  }

  public async init(url: string, init: Partial<IDiagramInfo>) {

    const content = await this.resolver(url);
    const { svgXml, viewBox, diagramInfo } = VisioSvgParser.parse(content);

    this.container.innerHTML = svgXml;

    this.svg = this.container.querySelector('svg');
    this.diagram = { ...diagramInfo, ...init };

    this.services.view = new ViewService(this, viewBox);

    this.enableService('selection', this.diagram.enableSelection);
    this.enableService('links', this.diagram.enableFollowHyperlinks);
    this.enableService('hover', this.diagram.enableHover);
    this.enableService('tooltip', this.diagram.enableTooltips);
    this.enableService('sidebar', this.diagram.enableSidebar);
    this.enableService('layers', this.diagram.enableLayers);

    const loadEvent = new CustomEvent<ILoadEventData>('svgpublish_Load', {
      cancelable: false,
      detail: {
        context: this,
      }
    });
    this.events.dispatchEvent(loadEvent);
  }

  public destroy() {
    const serviceKeys = Object.keys(this.services) as (keyof IServices)[];
    for (const serviceKey of serviceKeys) {
      this.destroyService(serviceKey);
    }
    this.container.innerHTML = '';
  }

  private createService(name: keyof IServices) {
    switch (name) {
      case 'selection': return new SelectionService(this);
      case 'links': return new LinksService(this);
      case 'hover': return new HoverService(this);
      case 'tooltip': return new TooltipService(this);
      case 'sidebar': return new SidebarService(this);
      case 'layers': return new LayersService(this);
    }
  }

  private destroyService(name: keyof IServices) {
    this.services[name].destroy();
    delete this.services[name];
  }

  public enableService(name: keyof IServices, enable: boolean) {
    if (enable && !this.services[name]) {
      this.services[name] = this.createService(name) as any;
    } else if (!enable && this.services[name]) {
      this.destroyService(name);
    } else {
      console.warn(`Service ${name} is already ${enable ? 'enabled' : 'disabled'}.`);
    }
  }
}
