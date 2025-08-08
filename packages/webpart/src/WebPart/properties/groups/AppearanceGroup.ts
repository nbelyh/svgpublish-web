import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneGroup } from '@microsoft/sp-property-pane';
import { PropertyPaneSizeField } from '../PropertyPaneSizeField';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { SettingsService } from '../../services/SettingsService';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class AppearanceGroup {
  public static get(context: WebPartContext, properties: IWebPartProps): IPropertyPaneGroup {
    return {
      groupName: strings.PropertyPaneLabelAppearance,
      isCollapsed: true,
      groupFields: [
        PropertyPaneIndentedToggle('enablePan', {
          label: "Enable Pan",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enablePan,
        }),
        PropertyPaneIndentedToggle('enableZoom', {
          label: "Enable Zoom",
          inlineLabel: true,
          indentLevel: 0,
          checked: properties.enableZoom,
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
    };
  }
}
