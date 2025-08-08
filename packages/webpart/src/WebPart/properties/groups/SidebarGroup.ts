import { PropertyPaneDropdown, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class SidebarGroup {
  public static get(properties: IWebPartProps) {
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
        PropertyPaneIndentedToggle('showSidebarOnSelection', {
          label: "Auto-Show Sidebar on Selection",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.showSidebarOnSelection,
        }),
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
        }),
        PropertyPaneIndentedToggle('enableSidebarMarkdown', {
          label: "Enable Custom Sidebar Content",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSidebarMarkdown,
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
    };
  }
}
