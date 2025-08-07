
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";
import { ISelectionChangedEventData, SelectionChangedEvent } from '../events/SelectionChangedEvent';
import { Utils } from './Utils';
import { BasicService } from './BasicService';
import { ISelectionService } from '../interfaces/ISelectionService';
import { SelectionUtils } from './SelectionUtils';
import { DefaultColors } from '../constants';
import { IDiagramSettings } from '../interfaces/IDiagramSettings';

export class SelectionService extends BasicService implements ISelectionService {

  public selectedShapeId: string = null;
  public highlightedShapeIds: { [shapeId: string]: string } = {};

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public reset() {

    this.unsubscribe();

    const selectedShapeId = this.selectedShapeId;
    if (selectedShapeId) {
      this.clearSelection();
    }

    const diagram = this.context.diagram;
    const settings = diagram.settings || {} as IDiagramSettings;

    SelectionUtils.destroySelectionFilters(this.context);
    SelectionUtils.createSelectionFilters(this.context, settings);

    this.subscribe(this.context.svg, 'click', (evt: MouseEvent) => {
      evt.stopPropagation();
      this.setSelection(null, evt);
    });

    for (const shapeId in diagram.shapes) {
      const info = diagram.shapes[shapeId];
      if (info.DefaultLink
        || info.Props && Object.keys(info.Props).length
        || info.Links?.length
        || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        || settings.enableNextShapeColor && info.ConnectedTo?.length
        || settings.enablePrevShapeColor && info.ConnectedFrom?.length
      ) {
        {
          const shape = Utils.findTargetElement(shapeId, this.context);
          if (shape) {
            shape.style.cursor = 'pointer';

            this.subscribe(shape, 'click', (evt: MouseEvent) => {
              evt.stopPropagation();
              this.setSelection(shapeId, evt);
            });
          }
        }
      }
    }

    if (selectedShapeId) {
      this.setSelection(selectedShapeId);
    }
  }

  public destroy(): void {
    SelectionUtils.destroySelectionFilters(this.context);
    this.clearSelection();
    super.destroy();
  }

  public setSelection(shapeId: string, evt?: Event) {

    const diagram = this.context.diagram;
    const settings = diagram.settings || {} as IDiagramSettings;

    if (this.selectedShapeId && this.selectedShapeId !== shapeId) {

      const selectedShape = Utils.findTargetElement(this.selectedShapeId, this.context);
      if (selectedShape) {
        SelectionUtils.removeShapeHighlight(selectedShape, SelectionUtils.getSelectionBoxId(this.context.guid, this.selectedShapeId), this.context);
        delete this.highlightedShapeIds[this.selectedShapeId];
        const info = diagram.shapes[this.selectedShapeId];

        if ((settings.enableNextShapeColor || settings.enableNextConnColor) && info.ConnectedTo) {
          for (let item of info.ConnectedTo) {
            if (settings.enableNextShapeColor) {
              const sid = Utils.findTargetElement(item.sid, this.context);
              SelectionUtils.removeShapeHighlight(sid, SelectionUtils.getSelectionBoxId(this.context.guid, item.sid), this.context);
              delete this.highlightedShapeIds[item.sid];
            }

            if (settings.enableNextConnColor) {
              const cid = Utils.findTargetElement(item.cid, this.context);
              SelectionUtils.removeConnHighlight(cid, this.context);
              delete this.highlightedShapeIds[item.cid];
            }


          }
        }

        if ((settings.enablePrevShapeColor || settings.enablePrevConnColor) && info.ConnectedFrom) {
          for (let item of info.ConnectedFrom) {
            if (settings.enablePrevShapeColor) {
              const sid = Utils.findTargetElement(item.sid, this.context);
              SelectionUtils.removeShapeHighlight(sid, SelectionUtils.getSelectionBoxId(this.context.guid, item.sid), this.context);
              delete this.highlightedShapeIds[item.sid];
            }

            if (settings.enablePrevConnColor) {
              const cid = Utils.findTargetElement(item.cid, this.context);
              SelectionUtils.removeConnHighlight(cid, this.context);
              delete this.highlightedShapeIds[item.cid];
            }
          }
        }
      }

      delete this.selectedShapeId;
    }

    if (!this.selectedShapeId || this.selectedShapeId !== shapeId) {

      this.selectedShapeId = shapeId;
      this.highlightedShapeIds = {};

      this.selectedShapeId = shapeId;
      const selectionChangedEvent = new CustomEvent<ISelectionChangedEventData>('svgpublish_SelectionChanged', {
        cancelable: false,
        detail: {
          triggerEvent: evt,
          context: this.context,
          shapeId
        }
      });

      if (!this.context.events.dispatchEvent(selectionChangedEvent))
        return;

      const shapeToSelect = Utils.findTargetElement(shapeId, this.context);
      if (shapeToSelect) {
        const info = diagram.shapes[shapeId];

        if ((settings.enableNextShapeColor || settings.enableNextConnColor) && info.ConnectedTo) {
          for (const item of info.ConnectedTo) {
            if (settings.enableNextShapeColor) {
              const nextColor = Utils.getValueOrDefault(settings.nextShapeColor, DefaultColors.nextShapeColor);
              const sid = Utils.findTargetElement(item.sid, this.context);
              const id = SelectionUtils.getSelectionBoxId(this.context.guid, item.sid);
              SelectionUtils.setShapeHighlight(sid, id,
                SelectionUtils.getNextShapeFilterId(this.context.guid),
                nextColor,
                this.context);
              this.highlightedShapeIds[item.sid] = id;
            }

            if (settings.enableNextConnColor) {
              const connColor = Utils.getValueOrDefault(settings.nextConnColor, DefaultColors.nextConnColor);
              const cid = Utils.findTargetElement(item.cid, this.context);
              const id = SelectionUtils.setConnHighlight(cid, connColor, this.context);
              this.highlightedShapeIds[item.cid] = id;
            }
          }
        }

        if ((settings.enablePrevShapeColor || settings.enablePrevConnColor) && info.ConnectedFrom) {
          for (const item of info.ConnectedFrom) {

            if (settings.enablePrevShapeColor) {
              const prevColor = Utils.getValueOrDefault(settings.prevShapeColor, DefaultColors.prevShapeColor);
              const sid = Utils.findTargetElement(item.sid, this.context);
              const id = SelectionUtils.getSelectionBoxId(this.context.guid, item.sid);
              SelectionUtils.setShapeHighlight(sid, id,
                SelectionUtils.getPrevShapeFilterId(this.context.guid),
                prevColor,
                this.context);
              this.highlightedShapeIds[item.sid] = id;
            }

            if (settings.enablePrevConnColor) {
              const connColor = Utils.getValueOrDefault(settings.prevConnColor, DefaultColors.prevConnColor);
              const cid = Utils.findTargetElement(item.cid, this.context);
              const id = SelectionUtils.setConnHighlight(cid, connColor, this.context);
              this.highlightedShapeIds[item.cid] = id;
            }
          }
        }

        const selectionColor = settings.selectionColor || DefaultColors.selectionColor;
        const id = SelectionUtils.getSelectionBoxId(this.context.guid, shapeId);
        SelectionUtils.setShapeHighlight(shapeToSelect, id,
          SelectionUtils.getSelectionFilterId(this.context.guid),
          selectionColor,
          this.context);
        this.highlightedShapeIds[shapeId] = id;
      }
    }
  }

  public clearSelection() {
    for (const shapeId in this.highlightedShapeIds) {
      const selectedElem = this.context.svg.getElementById(this.highlightedShapeIds[shapeId]);
      if (selectedElem) {
        selectedElem.parentElement.removeChild(selectedElem);
      }
      const shape = this.context.svg.getElementById(shapeId);
      if (shape) {
        shape.removeAttribute('filter');
      }
    }
    this.selectedShapeId = null;
  }

  public highlightShape(shapeId: string) {
    this.context.svg.getElementById(shapeId).animate([
      { opacity: 1, easing: 'ease-out' },
      { opacity: 0.1, easing: 'ease-in' },
      { opacity: 0 }],
      2000);
    this.setSelection(shapeId);
  }
}
