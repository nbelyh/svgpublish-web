
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";
import { ILinkInfo } from "../interfaces/ILinkInfo";
import { ILinkClickedEventData } from '../events';
import { Utils } from './Utils';
import { BasicService } from './BasicService';
import { ILinksService } from '../interfaces/ILinksService';
import { IDiagramSettings } from '../interfaces/IDiagramSettings';

export class LinksService extends BasicService implements ILinksService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public reset() {

    super.unsubscribe();

    const diagram = this.context.diagram;
    const settings = diagram.settings || {} as IDiagramSettings;

    const onClick = (evt: PointerEvent) => {
      evt.stopPropagation();

      const target = evt.currentTarget as SVGElement;
      const shape = diagram.shapes[target.id];
      const defaultLink = shape.DefaultLink && shape.Links[shape.DefaultLink - 1];
      const defaultLinkHref = defaultLink && this.buildDefaultHref(defaultLink);

      const openHyperlinksInNewWindow = Utils.getValueOrDefault(settings.openHyperlinksInNewWindow, true);

      const linkClickedEvent = new CustomEvent<ILinkClickedEventData>('svgpublish_LinkClicked', {
        cancelable: true,
        detail: {
          context: this.context,
          triggerEvent: evt,
          shape,
          link: defaultLink,
          href: defaultLinkHref,
          target: (defaultLink.Address && (openHyperlinksInNewWindow || evt.shiftKey)) ? '_blank' : undefined
        }
      });

      if (!this.context.events.dispatchEvent(linkClickedEvent))
        return;

      if (evt && evt.ctrlKey)
        return;

      if (linkClickedEvent.detail.target)
        window.open(linkClickedEvent.detail.href, "_blank");
      else
        document.location = linkClickedEvent.detail.href;
    };

    for (const shapeId in diagram.shapes) {

      const shape = diagram.shapes[shapeId];
      const defaultLink = shape.DefaultLink && shape.Links[shape.DefaultLink - 1];
      const defaultLinkHref = defaultLink && this.buildDefaultHref(defaultLink);

      if (defaultLinkHref) {

        var target = Utils.findTargetElement(shapeId, this.context);
        if (!target)
          continue;

        if (settings.enableFollowHyperlinks) {
          target.style.cursor = 'pointer';
          this.subscribe(target, 'click', onClick);
        } else {
          target.style.cursor = 'default';
        }
      }
    }
  }

  // $("#shape-links").show();

  private buildDefaultHref(link: ILinkInfo) {

    const diagram = this.context.diagram;

    if (link.Address)
      return link.Address;

    var linkPageId = link.PageId;
    if (linkPageId >= 0 && diagram.pages) {
      var targetPage = diagram.pages.find(p => p.Id === linkPageId);

      const pathname = location.pathname;
      const newpath = pathname.substring(0, pathname.lastIndexOf('/') + 1) + targetPage.FileName;
      let href = document.location.origin + newpath;

      if (link.ShapeId) {
        href += "#?shape=" + link.ShapeId;
      }

      if (link.Zoom) {
        href += (link.ShapeId ? "&" : "#?") + "zoom=" + link.Zoom;
      }

      return href;
    }

    return "#";
  }
}
