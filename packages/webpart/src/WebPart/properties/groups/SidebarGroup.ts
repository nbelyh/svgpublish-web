import { PropertyPaneDropdown, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { PropertyPaneSizeField } from '../PropertyPaneSizeField';
import { PropertyPanePropsListField } from '../PropertyPanePropsListField';

export class SidebarGroup {
  public static get(properties: IWebPartProps, availableProperties: string[] = []) {
    return {
      groupName: "Sidebar",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableSidebar', {
          label: "Enable Sidebar",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSidebar,
        }),
        PropertyPaneDropdown('sidebarType', {
          label: "Sidebar Size",
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
          PropertyPaneSizeField('sidebarDefaultWidth', {
            label: "Sidebar Width",
            disabled: !properties.enableSidebar,
            value: properties.sidebarDefaultWidth,
            screenUnits: 'px',
            getDefaultValue: () => Promise.resolve('400px'),
          })] : []),
        PropertyPaneIndentedToggle('enableSidebarTitle', {
          label: "Show Sidebar Title",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSidebarTitle,
        }),
        PropertyPaneIndentedToggle('enableProps', {
          label: "Show Shape Properties",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableProps,
        }),
        PropertyPanePropsListField('selectedProps', {
          label: "Property Filter",
          disabled: !properties.enableSidebar || !properties.enableProps,
          description: "Select property names to show. Leave empty to show all properties.",
          value: Array.isArray(properties.selectedProps)
            ? properties.selectedProps.join(', ')
            : (properties.selectedProps || ''),
          availableProperties: availableProperties,
        }),
        PropertyPaneIndentedToggle('enableLinks', {
          label: "Show Shape Links",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableLinks,
        }),
        PropertyPaneIndentedToggle('enablePages', {
          label: "Enable Pages Navigation",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enablePages,
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
        PropertyPaneIndentedToggle('enableSearch', {
          label: "Enable Shape Search",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSearch,
        }),
        PropertyPaneIndentedToggle('enablePropertySearchFilter', {
          label: "Property Filter",
          disabled: !properties.enableSidebar || !properties.enableSearch,
          inlineLabel: true,
          indentLevel: 1,
          checked: properties.enablePropertySearchFilter,
        }),
        PropertyPaneIndentedToggle('enableLayers', {
          label: "Show Layers",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableLayers,
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
        })
      ]
    };
  }
}
