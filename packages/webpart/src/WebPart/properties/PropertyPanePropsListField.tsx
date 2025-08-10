import * as React from 'react';
import * as ReactDom from 'react-dom';

import { PropertyPanePropsListFieldComponent } from './PropertyPanePropsListFieldComponent';

export function PropertyPanePropsListField(targetProperty: string, props: {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  availableProperties?: string[];
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPanePropsListFieldComponent
            value={props.value}
            label={props.label}
            disabled={props.disabled}
            description={props.description}
            availableProperties={props.availableProperties}
            setValue={(val) => changeCallback(targetProperty, val)}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
