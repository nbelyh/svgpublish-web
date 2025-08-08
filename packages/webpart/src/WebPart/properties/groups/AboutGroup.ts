import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneGroup } from '@microsoft/sp-property-pane';
import { PropertyPaneVersionField } from '../PropertyPaneVersionField';
import { PropertyPaneResetField } from '../PropertyPaneResetField';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class AboutGroup {
  public static get(context: WebPartContext, properties: IWebPartProps): IPropertyPaneGroup {
    return {
      groupName: strings.PropertyPaneLabelAbout,
      isCollapsed: false,
      groupFields: [
        PropertyPaneResetField('protectedSettings', {
          value: properties.protectedSettings || []
        }),
        PropertyPaneVersionField(context.manifest.version),
      ]
    };
  }
}
