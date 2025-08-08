import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneGroup } from '@microsoft/sp-property-pane';
import { PropertyPaneUrlField } from '../PropertyPaneUrlField';
import { SettingsService } from '../../services/SettingsService';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class SourceFileGroup {
  public static get(context: WebPartContext, properties: IWebPartProps): IPropertyPaneGroup {
    return {
      groupName: "Source File",
      groupFields: [
        PropertyPaneUrlField('url', {
          url: properties.url,
          context: context,
          getDefaultFolder: () => SettingsService.getDefaultFolder(context),
        })
      ]
    };
  }
}
