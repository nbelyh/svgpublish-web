import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class HeaderGroup {
  public static get(properties: IWebPartProps) {
    return {
      groupName: "Header",
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enableHeader', {
          label: "Enable Header",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableHeader,
        }),
        PropertyPaneIndentedToggle('enableBreadcrumb', {
          label: "Breadcrumb",
          disabled: !properties.enableHeader,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableBreadcrumb,
        }),
        PropertyPaneIndentedToggle('enableCopyHashLink', {
          label: "Copy Link Button",
          disabled: !properties.enableHeader,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableCopyHashLink,
        }),
        ...(properties.enableCopyHashLink ? [
          PropertyPaneTextField('feedbackUrl', {
            disabled: !properties.enableCopyHashLink || !properties.enableHeader,
            label: "Custom Feedback URL",
            placeholder: "ex: https://some.site/?src={{URL}}",
            description: "Use {{URL}} as a placeholder for the current page URL.",
          })] : []),
      ]
    };
  }
}
