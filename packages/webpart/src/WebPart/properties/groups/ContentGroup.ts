import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class ContentGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Custom Content",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableContentMarkdown', {
          label: "Enable Shape Overlay Content",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableContentMarkdown,
        }),
        ...(properties.enableContentMarkdown ? [PropertyPaneTextField('contentMarkdown', {
          label: "Shape Content Template",
          disabled: !properties.enableContentMarkdown,
          value: properties.contentMarkdown,
          placeholder: "Enter HTML or Markdown template...",
          description: "Template for content overlay. Use {{PropertyName}} for dynamic values like {{Text}}, {{ShapeId}}, {{Comment}}, etc.",
          multiline: true,
          rows: 4,
        })] : []),
        PropertyPaneIndentedToggle('enableSidebarMarkdown', {
          label: "Enable Custom Sidebar Content",
          disabled: !properties.enableSidebar,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableSidebarMarkdown,
        }),
        ...(properties.enableSidebarMarkdown ? [PropertyPaneTextField('sidebarMarkdown', {
          label: "Sidebar Content Template",
          disabled: !(properties.enableSidebar && properties.enableSidebarMarkdown),
          value: properties.sidebarMarkdown,
          placeholder: "Enter HTML or Markdown content...",
          description: "Custom content to display in the sidebar",
          multiline: true,
          rows: 4,
        })] : []),
      ]
    };
  }
}
