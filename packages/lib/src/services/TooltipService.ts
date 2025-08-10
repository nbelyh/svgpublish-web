
import { marked } from 'marked';
import Mustache from 'mustache';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { IDiagramSettings } from '../interfaces/IDiagramSettings';
import { BasicService } from './BasicService';
import { Utils } from './Utils';
import { ITooltipService } from '../interfaces/ITooltipService';

import tippy, { Instance, followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/translucent.css';

export class TooltipService extends BasicService implements ITooltipService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
    for (const tooltip of this.tooltips) {
      tooltip.destroy();
    }
    this.tooltips = [];
  }

  tooltips: Instance[] = [];

  public reset() {

    this.destroy();

    const diagram = this.context.diagram;
    const settings = diagram.settings || {} as IDiagramSettings;

    // Check if tooltips should be suppressed on mobile devices
    if (settings.suppressMobileTip && Utils.isTouchOnlyDevice()) {
      return; // Exit early, don't create any tooltips
    }

    tippy.setDefaultProps({
      allowHTML: true,
      appendTo: this.context.container,
      interactive: settings.tooltipInteractive,
      delay: settings.tooltipDelay ? [settings.tooltipDelayShow ?? undefined, settings.tooltipDelayHide ?? undefined] : undefined,
      trigger: settings.tooltipTrigger || 'mouseenter',
      placement: settings.tooltipPlacement || 'auto',
      followCursor: settings.tooltipUseMousePosition,
      plugins: settings.tooltipUseMousePosition ? [followCursor] : [],
      theme: settings.tooltipTheme || 'dark',
    });

    for (const shapeId in diagram.shapes) {

      const info = diagram.shapes[shapeId];

      const target = Utils.findTargetElement(shapeId, this.context);
      if (!target)
        continue;

      const tooltipMarkdown = info.TooltipMarkdown || (settings.enableTooltipMarkdown && settings.tooltipMarkdown) || info.Comment || '';
      const md = tooltipMarkdown && Mustache.render(tooltipMarkdown, info);
      const content = md && marked.parseInline(md) as string;

      if (!content)
        continue;

      const instance = tippy(target, {
        content: content,
      });

      this.tooltips.push(instance);
    }
  }
}
