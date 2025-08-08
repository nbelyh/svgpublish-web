import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { PropertyPaneColorField } from '../PropertyPaneColorField';
import { PropertyPaneNumberField } from '../PropertyPaneNumberField';
import { DefaultColors } from 'svgpublish';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class PrevNextHighlightGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Prev/Next Highlight",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enablePrevShapeColor', {
          disabled: !properties.enableSelection,
          inlineLabel: true,
          label: "Highlight Previous Shape",
          indentLevel: 0,
          checked: properties.enablePrevShapeColor,
        }),
        PropertyPaneColorField('prevShapeColor', {
          disabled: !(properties.enableSelection && properties.enablePrevShapeColor),
          defaultValue: DefaultColors.prevShapeColor,
          value: properties.prevShapeColor,
        }),

        PropertyPaneIndentedToggle('enableNextShapeColor', {
          disabled: !properties.enableSelection,
          inlineLabel: true,
          label: "Highlight Next Shape",
          indentLevel: 0,
          checked: properties.enableNextShapeColor,
        }),
        PropertyPaneColorField('nextShapeColor', {
          disabled: !(properties.enableSelection && properties.enableNextShapeColor),
          defaultValue: DefaultColors.nextShapeColor,
          value: properties.nextShapeColor,
        }),

        PropertyPaneIndentedToggle('enablePrevConnColor', {
          disabled: !properties.enableSelection,
          inlineLabel: true,
          label: "Highlight Previous Connection",
          indentLevel: 0,
          checked: properties.enablePrevConnColor,
        }),
        PropertyPaneColorField('prevConnColor', {
          disabled: !(properties.enableSelection && properties.enablePrevConnColor),
          defaultValue: DefaultColors.prevConnColor,
          value: properties.prevConnColor,
        }),

        PropertyPaneIndentedToggle('enableNextConnColor', {
          disabled: !properties.enableSelection,
          inlineLabel: true,
          label: "Highlight Next Connection",
          indentLevel: 0,
          checked: properties.enableNextConnColor,
        }),
        PropertyPaneColorField('nextConnColor', {
          disabled: !(properties.enableSelection && properties.enableNextConnColor),
          defaultValue: DefaultColors.nextConnColor,
          value: properties.nextConnColor,
        }),

        PropertyPaneIndentedToggle('enableConnDilate', {
          label: "Enable Connection Dilate",
          inlineLabel: true,
          disabled: !properties.enableSelection,
          indentLevel: 0,
          checked: properties.enableConnDilate,
        }),
        PropertyPaneNumberField('connDilate', {
          disabled: !(properties.enableSelection && properties.enableConnDilate),
          value: properties.connDilate,
        }),
      ]
    };
  }
}
