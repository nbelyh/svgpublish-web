import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { PropertyPaneColorField } from '../PropertyPaneColorField';
import { DefaultColors } from 'svgpublish';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import { PropertyPaneNumberField } from '../PropertyPaneNumberField';

export class HighlightGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Highlight & Selection",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableHover', {
          inlineLabel: true,
          label: "Enable Highlight",
          indentLevel: 0,
          checked: properties.enableHover,
        }),
        PropertyPaneIndentedToggle('enableSelection', {
          label: "Enable Selection",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSelection,
        }),
        PropertyPaneIndentedToggle('showSidebarOnSelection', {
          label: "Auto-Show Sidebar on Selection",
          disabled: !properties.enableSidebar || !properties.enableSelection,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.showSidebarOnSelection,
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
        PropertyPaneColorField('selectionColor', {
          label: "Selection Color",
          disabled: !properties.enableSelection,
          defaultValue: DefaultColors.selectionColor,
          value: properties.selectionColor,
        }),
        PropertyPaneDropdown('selectionMode', {
          label: "Highlight & Selection Mode",
          disabled: !(properties.enableSelection || properties.enableHover),
          options: [
            { key: 'normal', text: "normal" },
            { key: 'lighten', text: "lighten" },
            { key: 'darken', text: "darken" },
          ],
        }),
        PropertyPaneIndentedToggle('enableDilate', {
          label: "Enable Dilate",
          inlineLabel: true,
          disabled: !(properties.enableSelection || properties.enableHover),
          indentLevel: 0,
          checked: properties.enableDilate,
        }),
        ...(properties.enableDilate ? [
          PropertyPaneNumberField('dilate', {
            disabled: !(properties.enableSelection && properties.enableDilate),
            value: properties.dilate,
          }),
        ] : []),
        PropertyPaneIndentedToggle('enableBlur', {
          label: "Enable Blur",
          inlineLabel: true,
          disabled: !(properties.enableSelection || properties.enableHover),
          indentLevel: 0,
          checked: properties.enableBlur,
        }),
        ...(properties.enableBlur ? [
          PropertyPaneNumberField('blur', {
            disabled: !(properties.enableSelection && properties.enableBlur),
            value: properties.blur,
          }),
        ] : []),
        PropertyPaneIndentedToggle('enableBoxSelection', {
          disabled: !(properties.enableSelection || properties.enableHover),
          inlineLabel: true,
          label: "Use box (rectangle) selection",
          indentLevel: 0,
          checked: properties.enableBoxSelection,
        }),
      ]
    };
  }
}
