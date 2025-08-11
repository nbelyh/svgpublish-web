import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PropertyPaneSizeField } from '../PropertyPaneSizeField';
import { PropertyPaneIndentedToggle } from '../PropertyPaneIndentedToggle';
import { SettingsService } from '../../services/SettingsService';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { PropertyPaneViewControl } from '../PropertyPaneViewControl';
import { IWebPartPropertiesCallback } from 'WebPart/IWebPartPropertiesCallback';

export class AppearanceGroup {
  public static get(context: WebPartContext, properties: IWebPartProps, propertiesCallback: IWebPartPropertiesCallback) {
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
          value: properties.width,
          screenUnits: 'w',
          getDefaultValue: () => SettingsService.getDefaultWidth(context)
        }),
        PropertyPaneSizeField('height', {
          label: strings.FieldHeight,
          value: properties.height,
          screenUnits: 'h',
          getDefaultValue: () => SettingsService.getDefaultHeight(context)
        }),
        PropertyPaneViewControl('savedViewMatrix', {
          context: context,
          currentValue: properties.savedViewMatrix,
          propertiesCallback: propertiesCallback
        })
      ]
    };
  }
}
