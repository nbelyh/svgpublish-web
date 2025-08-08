import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class ContentGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Content Overlay",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableContentMarkdown', {
          label: "Enable Content Overlay",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableContentMarkdown,
        }),
        ...(properties.enableContentMarkdown ? [PropertyPaneTextField('contentMarkdown', {
            label: "Content Template",
            disabled: !properties.enableContentMarkdown,
            value: properties.contentMarkdown,
            placeholder: "Enter HTML or Markdown template...",
            description: "Template for content overlay. Use {{PropertyName}} for dynamic values like {{Text}}, {{ShapeId}}, {{Comment}}, etc.",
            multiline: true,
            rows: 4,
          })] : []),
      ]
    };
  }
}
