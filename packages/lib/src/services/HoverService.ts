
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { IHoverService } from '../interfaces/IHoverService';
import { Utils } from './Utils';
import { DefaultColors } from '../constants';
import { SelectionUtils } from './SelectionUtils';
import { IDiagramSettings } from '../interfaces/IDiagramSettings';

export class HoverService extends BasicService implements IHoverService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
    SelectionUtils.destroyHoverFilters(this.context);
    super.destroy();
  }

  public reset() {

    super.unsubscribe();

    const diagram = this.context.diagram;
    const settings = diagram.settings || {} as IDiagramSettings;
    const selectionService = this.context.services.selection;

    SelectionUtils.destroyHoverFilters(this.context);
    SelectionUtils.createHoverFilters(this.context, settings);

    for (const shapeId in diagram.shapes) {

      const info = diagram.shapes[shapeId];

      if (info.DefaultLink
        || info.Props && Object.keys(info.Props).length
        || info.Links?.length
        || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        || settings.enableNextShapeColor && info.ConnectedTo?.length
        || settings.enablePrevShapeColor && info.ConnectedFrom?.length
      ) {

        const boxId = SelectionUtils.getSelectionBoxId(this.context.guid, shapeId);

        const shape = Utils.findTargetElement(shapeId, this.context);
        if (shape) {

          const isHyperlink = settings.enableFollowHyperlinks && info.DefaultLink;

          const filter = isHyperlink
            ? SelectionUtils.getHyperlinkFilterId(this.context.guid)
            : SelectionUtils.getHoverFilterId(this.context.guid);

          this.subscribe(shape, 'mouseover', () => {
            if (!selectionService?.highlightedShapeIds?.[shapeId]) {
              const hyperlinkColor = Utils.getValueOrDefault(settings.hyperlinkColor, DefaultColors.hyperlinkColor);
              const hoverColor = Utils.getValueOrDefault(settings.hoverColor, DefaultColors.hoverColor);
              const color = isHyperlink ? hyperlinkColor : hoverColor;
              SelectionUtils.setShapeHighlight(shape, boxId, filter, color, this.context);
            }
          });

          this.subscribe(shape, 'mouseout', () => {
            if (!selectionService?.highlightedShapeIds[shapeId]) {
              SelectionUtils.removeShapeHighlight(shape, boxId, this.context);
            }
          });
        }
      }
    }
  }
}
