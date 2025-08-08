import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneToggle, PropertyPaneButton, PropertyPaneButtonType } from '@microsoft/sp-property-pane';

import { PropertyPaneVersionField } from './PropertyPaneVersionField';
import { PropertyPaneUrlField } from './PropertyPaneUrlField';
import { PropertyPaneSizeField } from './PropertyPaneSizeField';
import { PropertyPaneIndentedToggle } from './PropertyPaneIndentedToggle';
import { SettingsService } from '../services/SettingsService';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { PropertyPaneColorField } from './PropertyPaneColorField';
import { DefaultColors } from 'svgpublish';
import { PropertyPaneNumberField } from './PropertyPaneNumberField';
import { PropertyPaneResetField } from './PropertyPaneResetField';

export class Configuration {

  public static get(context: WebPartContext, properties: IWebPartProps): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "SVG File",
              groupFields: [
                PropertyPaneUrlField('url', {
                  url: properties.url,
                  context: context,
                  getDefaultFolder: () => SettingsService.getDefaultFolder(context),
                })
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAppearance,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enablePan', {
                  label: "Enable Pan",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableZoom', {
                  label: "Enable Zoom",
                  inlineLabel: true,
                }),
                PropertyPaneSizeField('width', {
                  label: strings.FieldWidth,
                  description: strings.FieldWidthDescription,
                  value: properties.width,
                  screenUnits: 'w',
                  getDefaultValue: () => SettingsService.getDefaultWidth(context)
                }),
                PropertyPaneSizeField('height', {
                  label: strings.FieldHeight,
                  description: strings.FieldHeightDescription,
                  value: properties.height,
                  screenUnits: 'h',
                  getDefaultValue: () => SettingsService.getDefaultHeight(context)
                }),
              ]
            },
            {
              groupName: "Header",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableHeader', {
                  label: "Enable Header",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableBreadcrumb', {
                  label: "Breadcrumb",
                  disabled: !properties.enableHeader,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableCopyHashLink', {
                  label: "Copy Link Button",
                  disabled: !properties.enableHeader,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableFeedback', {
                  label: "Feedback Button",
                  disabled: !properties.enableHeader,
                  inlineLabel: true,
                }),
                ...(properties.enableFeedback ? [
                  PropertyPaneTextField('feedbackButtonText', {
                    disabled: !properties.enableFeedback || !properties.enableHeader,
                    label: "Button Text",
                    placeholder: "Feedback",
                    description: "Label for the feedback button.",
                  })] : []),
                ...(properties.enableFeedback ? [
                  PropertyPaneTextField('feedbackUrl', {
                    disabled: !properties.enableFeedback || !properties.enableHeader,
                    label: "Feedback URL",
                    placeholder: "ex: https://some.site/?src={{URL}}",
                    description: "URL to send feedback to. Use {{URL}} as a placeholder for the current page URL.",
                  })] : []),
              ]
            },
            {
              groupName: "Selection",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableSelection', {
                  label: "Enable Selection",
                  inlineLabel: true,
                }),
                PropertyPaneColorField('selectionColor', {
                  disabled: !properties.enableSelection,
                  defaultValue: DefaultColors.selectionColor,
                  value: properties.selectionColor,
                }),
                PropertyPaneToggle('enableBoxSelection', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Use box selection",
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
                PropertyPaneToggle('enableDilate', {
                  label: "Enable Dilate",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('dilate', {
                  disabled: !(properties.enableSelection && properties.enableDilate),
                  value: properties.dilate,
                }),

                PropertyPaneToggle('enableBlur', {
                  label: "Enable Blur",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('blur', {
                  disabled: !(properties.enableSelection && properties.enableBlur),
                  value: properties.blur,
                }),
              ]
            },
            {
              groupName: "Highlight",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableHover', {
                  label: "Enable Highlight",
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
            },
            {
              groupName: "Prev/Next Highlight",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enablePrevShapeColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Previous Shape",
                }),
                PropertyPaneColorField('prevShapeColor', {
                  disabled: !(properties.enableSelection && properties.enablePrevShapeColor),
                  defaultValue: DefaultColors.prevShapeColor,
                  value: properties.prevShapeColor,
                }),

                PropertyPaneToggle('enableNextShapeColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Next Shape",
                }),
                PropertyPaneColorField('nextShapeColor', {
                  disabled: !(properties.enableSelection && properties.enableNextShapeColor),
                  defaultValue: DefaultColors.nextShapeColor,
                  value: properties.nextShapeColor,
                }),

                PropertyPaneToggle('enablePrevConnColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Previous Connection",
                }),
                PropertyPaneColorField('prevConnColor', {
                  disabled: !(properties.enableSelection && properties.enablePrevConnColor),
                  defaultValue: DefaultColors.prevConnColor,
                  value: properties.prevConnColor,
                }),

                PropertyPaneToggle('enableNextConnColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Next Connection",
                }),
                PropertyPaneColorField('nextConnColor', {
                  disabled: !(properties.enableSelection && properties.enableNextConnColor),
                  defaultValue: DefaultColors.nextConnColor,
                  value: properties.nextConnColor,
                }),

                PropertyPaneToggle('enableConnDilate', {
                  label: "Enable Connection Dilate",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('connDilate', {
                  disabled: !(properties.enableSelection && properties.enableConnDilate),
                  value: properties.connDilate,
                }),
              ]
            },
            {
              groupName: "Hyperlinks",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableFollowHyperlinks', {
                  label: "Enable Links",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('openHyperlinksInNewWindow', {
                  label: "Open Hyperlinks in New Window",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('rewriteVsdxHyperlinks', {
                  label: "Rewrite VSDX Hyperlinks as SVG",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('rewriteOfficeHyperlinks', {
                  label: "Always Open Office Files in Browser",
                  inlineLabel: true,
                }),
              ]
            },
            {
              groupName: "Tooltips",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableTooltips', {
                  inlineLabel: true,
                  label: "Enable Tooltips",
                }),
                PropertyPaneToggle('tooltipUseMousePosition', {
                  label: "Use Mouse Position",
                  inlineLabel: true,
                  disabled: !properties.enableTooltips,
                }),
                PropertyPaneToggle('tooltipInteractive', {
                  label: "Interactive",
                  inlineLabel: true,
                  disabled: !properties.enableTooltips,
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
                PropertyPaneToggle('tooltipDelay', {
                  label: "Enable Delay",
                  inlineLabel: true,
                  disabled: !properties.enableTooltips,
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
            },
            {
              groupName: "Sidebar",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableSidebar', {
                  label: "Enable Sidebar",
                  inlineLabel: true,
                }),
                PropertyPaneDropdown('sidebarType', {
                  label: "Sidebar Type",
                  disabled: !properties.enableSidebar,
                  options: [
                    { key: 'smallFixedFar', text: "Small" },
                    { key: 'smallFixedNear', text: "Small (Left)" },
                    { key: 'medium', text: "Medium" },
                    { key: 'large', text: "Large" },
                    { key: 'largeFixed', text: "Large Fixed" },
                    { key: 'extraLarge', text: "Extra Large" },
                    { key: 'custom', text: "Custom" },
                    { key: 'customNear', text: "Custom (Left)" },
                  ],
                }),
                ...((properties.sidebarType === 'custom' || properties.sidebarType === 'customNear') ? [
                  PropertyPaneTextField('sidebarDefaultWidth', {
                    label: "Custom Sidebar Width",
                    disabled: !properties.enableSidebar,
                    value: properties.sidebarDefaultWidth,
                    placeholder: "ex: 300px, 25%",
                    description: "Specify width with units (px, %, em, etc.)",
                  })] : []),
                PropertyPaneToggle('showSidebarOnSelection', {
                  label: "Auto-Show Sidebar on Selection",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableSidebarTitle', {
                  label: "Show Sidebar Title",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableProps', {
                  label: "Show Shape Properties",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableLinks', {
                  label: "Show Shape Links",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enablePages', {
                  label: "Enable Pages Navigation",
                  inlineLabel: true,
                }),
                PropertyPaneIndentedToggle('enablePageLookup', {
                  label: "Page Search",
                  disabled: !properties.enablePages,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enablePageLookup,
                }),
                PropertyPaneIndentedToggle('enablePageSort', {
                  label: "Sort Pages Alphabetically",
                  disabled: !properties.enablePages,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enablePageSort,
                }),
                PropertyPaneToggle('enableSearch', {
                  label: "Enable Shape Search",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneIndentedToggle('enableMultiPageSearch', {
                  label: "Multi-Page Search",
                  disabled: !properties.enableSidebar || !properties.enableSearch,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enableMultiPageSearch,
                }),
                PropertyPaneIndentedToggle('enablePropertySearchFilter', {
                  label: "Property Filter",
                  disabled: !properties.enableSidebar || !properties.enableSearch,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enablePropertySearchFilter,
                }),
                PropertyPaneToggle('enableLayers', {
                  label: "Show Layers",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneIndentedToggle('enableLayerLookup', {
                  label: "Layer Search",
                  disabled: !properties.enableSidebar || !properties.enableLayers,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enableLayerLookup,
                }),
                PropertyPaneIndentedToggle('enableLayerSort', {
                  label: "Sort Layers Alphabetically",
                  disabled: !properties.enableSidebar || !properties.enableLayers,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enableLayerSort,
                }),
                PropertyPaneIndentedToggle('enableLayerShowAll', {
                  label: "Show All/Hide All Buttons",
                  disabled: !properties.enableSidebar || !properties.enableLayers,
                  inlineLabel: true,
                  indentLevel: 1,
                  checked: properties.enableLayerShowAll,
                }),
                PropertyPaneToggle('enableSidebarMarkdown', {
                  label: "Enable Custom Sidebar Content",
                  disabled: !properties.enableSidebar,
                  inlineLabel: true,
                }),
                PropertyPaneTextField('sidebarMarkdown', {
                  label: "Custom Sidebar Content",
                  disabled: !(properties.enableSidebar && properties.enableSidebarMarkdown),
                  value: properties.sidebarMarkdown,
                  placeholder: "Enter HTML or Markdown content...",
                  description: "Custom content to display in the sidebar",
                  multiline: true,
                  rows: 4,
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAbout,
              isCollapsed: false,
              groupFields: [
                PropertyPaneResetField('protectedSettings', {
                  value: properties.protectedSettings || []
                }),
                PropertyPaneVersionField(context.manifest.version),
              ]
            }
          ]
        }
      ]
    };
  }

}
