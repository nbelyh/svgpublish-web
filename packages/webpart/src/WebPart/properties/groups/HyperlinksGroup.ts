import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class HyperlinksGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Hyperlinks",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableFollowHyperlinks', {
          label: "Enable Links",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableFollowHyperlinks,
        }),
        PropertyPaneIndentedToggle('openHyperlinksInNewWindow', {
          label: "Open Hyperlinks in New Window",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.openHyperlinksInNewWindow,
        }),
        PropertyPaneIndentedToggle('rewriteVisioHyperlinks', {
          label: "Rewrite VSDX Hyperlinks as SVG",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.rewriteVisioHyperlinks,
        }),
        PropertyPaneIndentedToggle('rewriteOfficeHyperlinks', {
          label: "Always Open Office Files in Browser",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.rewriteOfficeHyperlinks,
        }),
      ]
    };
  }
}
