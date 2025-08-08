import { PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { PropertyPaneNumberField } from '../PropertyPaneNumberField';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class TooltipsGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Tooltips",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableTooltips', {
          inlineLabel: true,
          label: "Enable Tooltips",
          indentLevel: 0,
          checked: properties.enableTooltips,
        }),
        PropertyPaneIndentedToggle('tooltipUseMousePosition', {
          label: "Use Mouse Position",
          inlineLabel: true,
          disabled: !properties.enableTooltips,
          indentLevel: 0,
          checked: properties.tooltipUseMousePosition,
        }),
        PropertyPaneIndentedToggle('tooltipInteractive', {
          label: "Interactive",
          inlineLabel: true,
          disabled: !properties.enableTooltips,
          indentLevel: 0,
          checked: properties.tooltipInteractive,
        }),
        PropertyPaneDropdown('tooltipTheme', {
          label: "Tooltip Theme",
          disabled: !properties.enableTooltips,
          options: [
            { key: 'dark', text: "dark" },
            { key: 'light', text: "light" },
            { key: 'light-border', text: "light-border" },
            { key: 'translucent', text: "translucent" },
          ],
        }),
        PropertyPaneDropdown('tooltipTrigger', {
          label: "Tooltip Trigger",
          disabled: !properties.enableTooltips,
          options: [
            { key: 'mouseenter', text: "mouseenter" },
            { key: 'click', text: "click" },
            { key: 'mouseenter click', text: "mouseenter click" },
          ],
        }),
        PropertyPaneDropdown('tooltipPlacement', {
          label: "Tooltip Placement",
          disabled: !properties.enableTooltips,
          options: [
            { key: 'auto', text: "auto" },
            { key: 'top', text: "top" },
            { key: 'bottom', text: "bottom" },
            { key: 'left', text: "left" },
            { key: 'right', text: "right" },
          ],
        }),
        PropertyPaneIndentedToggle('tooltipDelay', {
          label: "Enable Delay",
          inlineLabel: true,
          disabled: !properties.enableTooltips,
          indentLevel: 0,
          checked: properties.tooltipDelay,
        }),
        ...(properties.tooltipDelay ? [
          PropertyPaneNumberField('tooltipDelayShow', {
            label: "Show Delay",
            disabled: !(properties.enableTooltips && properties.tooltipDelay),
            value: properties.tooltipDelayShow,
          }),
          PropertyPaneNumberField('tooltipDelayHide', {
            label: "Hide Delay",
            disabled: !(properties.enableTooltips && properties.tooltipDelay),
            value: properties.tooltipDelayHide,
          }),
        ] : []),
      ]
    };
  }
}
