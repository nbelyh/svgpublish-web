import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { IPropertyPaneGroup } from '@microsoft/sp-property-pane';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class HeaderGroup {
  public static get(properties: IWebPartProps): IPropertyPaneGroup {
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
        PropertyPaneIndentedToggle('enableFeedback', {
          label: "Feedback Button",
          disabled: !properties.enableHeader,
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableFeedback,
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
    };
  }
}
