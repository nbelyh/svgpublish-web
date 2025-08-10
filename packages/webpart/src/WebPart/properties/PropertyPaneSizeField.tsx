import * as React from 'react';
import * as ReactDom from 'react-dom';

import { PropertyPaneSizeFieldComponent } from './PropertyPaneSizeFieldComponent';

export function PropertyPaneSizeField(targetProperty: string, props: {
  value: string;
  label: string;
  getDefaultValue: () => Promise<string>;
  disabled?: boolean;
  description?: string;
  screenUnits: string;
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneSizeFieldComponent
            value={props.value}
            label={props.label}
            disabled={props.disabled}
            getDefaultValue={props.getDefaultValue}
            description={props.description}
            screenUnits={props.screenUnits}
            setValue={(val) => changeCallback(targetProperty, val)}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
