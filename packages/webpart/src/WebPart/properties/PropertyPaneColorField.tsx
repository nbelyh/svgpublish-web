import * as React from 'react';
import * as ReactDom from 'react-dom';

import { PropertyPaneColorFieldComponent } from './PropertyPaneColorFieldComponent'

export function PropertyPaneColorField(targetProperty: string, props: {
  value: string;
  label?: string;
  description?: string;
  disabled: boolean;
  defaultValue: string;
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneColorFieldComponent
            value={props.value}
            defaultValue={props.defaultValue}
            label={props.label}
            description={props.description}
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
