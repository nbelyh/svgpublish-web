import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PropertyPaneUrlField } from '../PropertyPaneUrlField';
import { SettingsService } from '../../services/SettingsService';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class SourceFileGroup {
  public static get(context: WebPartContext, properties: IWebPartProps) {
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
