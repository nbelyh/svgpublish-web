import * as React from 'react';
import * as ReactDom from 'react-dom';

import { PropertyPaneNumberFieldComponent } from './PropertyPaneNumberFieldComponent';

export function PropertyPaneNumberField(targetProperty: string, props: {
  value: number;
  label?: string;
  description?: string;
  disabled?: boolean;
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneNumberFieldComponent
            value={props.value}
            label={props.label}
            disabled={props.disabled}
            setValue={(val) => changeCallback(targetProperty, val)}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
