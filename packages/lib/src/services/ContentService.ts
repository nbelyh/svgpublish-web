import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { IDiagramSettings } from '../interfaces/IDiagramSettings';
import { BasicService } from './BasicService';
import { Utils } from './Utils';
import { IContentService } from '../interfaces/IContentService';

export class ContentService extends BasicService implements IContentService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
    // Remove all content elements that were added
    const contentElements = this.context.container.querySelectorAll(`[data-vp-content-${this.context.guid}]`);
    contentElements.forEach(element => element.remove());
  }

  public reset() {
    this.destroy();

    const diagram = this.context.diagram;
    const settings = diagram.settings || {} as IDiagramSettings;

    for (const shapeId in diagram.shapes) {
      const shape = diagram.shapes[shapeId];

      const node = Utils.findTargetElement(shapeId, this.context);
      if (!node)
        continue;

      const contentMarkdown = shape.ContentMarkdown || (settings.enableContentMarkdown && settings.contentMarkdown) || '';
      const content = this.context.services.view.renderMarkdown(contentMarkdown, shape);

      if (!content)
        continue;

      // Get the bounding box of the target element
      const rect = (node as SVGGraphicsElement).getBBox();
      const x = rect.x;
      const y = rect.y;
      const width = rect.width;
      const height = rect.height;

      // Create a foreignObject to embed HTML content
      const SVGNS = 'http://www.w3.org/2000/svg';
      const box = document.createElementNS(SVGNS, "foreignObject");
      box.setAttribute("x", x.toString());
      box.setAttribute("y", y.toString());
      box.setAttribute("width", width.toString());
      box.setAttribute("height", height.toString());
      box.setAttribute(`data-vp-content-${this.context.guid}`, "true");

      // Set the HTML content
      box.innerHTML = content;

      // Append to the parent node (should be the SVG or a group)
      node.appendChild(box);
    }
  }
}
