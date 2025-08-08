import { IPropertyPaneGroup } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { PropertyPaneColorField } from '../PropertyPaneColorField';
import { DefaultColors } from 'svgpublish';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class HighlightGroup {
  public static get(properties: IWebPartProps): IPropertyPaneGroup {
    return {
      groupName: "Highlight",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableHover', {
          label: "Enable Highlight",
          indentLevel: 0,
          checked: properties.enableHover,
        }),
        PropertyPaneColorField('hoverColor', {
          label: "Hover Color",
          disabled: !properties.enableHover,
          defaultValue: DefaultColors.hoverColor,
          value: properties.hoverColor,
        }),
        PropertyPaneColorField('hyperlinkColor', {
          label: "Hyperlink Hover Color",
          disabled: !properties.enableHover,
          defaultValue: DefaultColors.hyperlinkColor,
          value: properties.hyperlinkColor,
        }),
      ]
    };
  }
}
