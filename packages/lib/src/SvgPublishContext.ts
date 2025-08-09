import { ISvgPublishContext } from './interfaces/ISvgPublishContext';
import { ViewService } from './services/ViewService';
import { SelectionService } from './services/SelectionService';
import { LinksService } from './services/LinksService';
import { HoverService } from './services/HoverService';
import { LayersService } from './services/LayersService';
import { IDiagramInfo } from './interfaces/IDiagramInfo';
import { IServices } from './interfaces/IServices';
import { ISvgSource } from './interfaces/ISvgSource';
import { Utils } from './services/Utils';
import { TooltipService } from './services/TooltipService';
import { ContentService } from './services/ContentService';
import { SidebarService } from './services/SidebarService';
import { IDiagramSettings } from './interfaces/IDiagramSettings';
import { SvgParseService } from './services/SvgParseService';

export class SvgPublishContext implements ISvgPublishContext {

  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: IServices;
  guid: string;

  public constructor(container: HTMLElement) {
    this.guid = Utils.generateUniqueId();
    this.container = container;
    this.events = new EventTarget;
    this.services = {};
  }

  public async init(url: string, resolver?: (url: string, defaultResolver: (url: string) => Promise<ISvgSource>) => Promise<ISvgSource>) {

    const result = resolver
      ? await resolver(url, SvgParseService.defaultResolver)
      : await SvgParseService.defaultResolver(url);

    this.diagram = result.diagramInfo || {} as IDiagramInfo;
    this.container.innerHTML = result.svgXml;

    this.svg = this.container.querySelector('svg');

    this.services.view = new ViewService(this, result.viewBox);

    const settings = this.diagram.settings || {} as IDiagramSettings;
    this.enableService('selection', settings.enableSelection);
    this.enableService('links', settings.enableFollowHyperlinks);
    this.enableService('hover', settings.enableHover);
    this.enableService('tooltip', settings.enableTooltips);
    this.enableService('content', settings.enableContentMarkdown);
    this.enableService('sidebar', settings.enableSidebar);
    this.enableService('layers', settings.enableLayers);
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
      case 'content': return new ContentService(this);
      case 'sidebar': return new SidebarService(this);
      case 'layers': return new LayersService(this);
    }
  }

  private destroyService(name: keyof IServices) {
    this.services[name].destroy();
    delete this.services[name];
  }

  public enableService(name: keyof IServices, enable?: boolean) {
    const service = this.services[name];
    if (service) {
      if (enable) {
        service.reset();
      } else {
        this.destroyService(name);
      }
    } else {
      if (enable) {
        this.services[name] = this.createService(name) as any;
      }
    }
  }

  public configureServices() {
    const settings = this.diagram?.settings || {} as IDiagramSettings;
    this.enableService('selection', settings.enableSelection);
    this.enableService('links', settings.enableFollowHyperlinks);
    this.enableService('hover', settings.enableHover);
    this.enableService('tooltip', settings.enableTooltips);
    this.enableService('content', settings.enableContentMarkdown);
    this.enableService('sidebar', settings.enableSidebar);
    this.enableService('layers', settings.enableLayers);
  }
}
