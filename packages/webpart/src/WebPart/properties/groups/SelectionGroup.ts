import { PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { PropertyPaneColorField } from '../PropertyPaneColorField';
import { PropertyPaneNumberField } from '../PropertyPaneNumberField';
import { DefaultColors } from 'svgpublish';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class SelectionGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Selection",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableSelection', {
          label: "Enable Selection",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSelection,
        }),
        PropertyPaneColorField('selectionColor', {
          disabled: !properties.enableSelection,
          defaultValue: DefaultColors.selectionColor,
          value: properties.selectionColor,
        }),
        PropertyPaneIndentedToggle('enableBoxSelection', {
          disabled: !properties.enableSelection,
          inlineLabel: true,
          label: "Use box selection",
          indentLevel: 0,
          checked: properties.enableBoxSelection,
        }),
        PropertyPaneDropdown('selectionMode', {
          label: "Selection Mode",
          disabled: !properties.enableSelection,
          options: [
            { key: 'normal', text: "normal" },
            { key: 'lighten', text: "lighten" },
            { key: 'darken', text: "darken" },
          ],
        }),
        PropertyPaneIndentedToggle('enableDilate', {
          label: "Enable Dilate",
          inlineLabel: true,
          disabled: !properties.enableSelection,
          indentLevel: 0,
          checked: properties.enableDilate,
        }),
        PropertyPaneNumberField('dilate', {
          disabled: !(properties.enableSelection && properties.enableDilate),
          value: properties.dilate,
        }),

        PropertyPaneIndentedToggle('enableBlur', {
          label: "Enable Blur",
          inlineLabel: true,
          disabled: !properties.enableSelection,
          indentLevel: 0,
          checked: properties.enableBlur,
        }),
        PropertyPaneNumberField('blur', {
          disabled: !(properties.enableSelection && properties.enableBlur),
          value: properties.blur,
        }),
      ]
    };
  }
}
