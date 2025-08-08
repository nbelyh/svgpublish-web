import * as React from 'react';
import * as ReactDom from 'react-dom';

import { PropertyPaneResetFieldComponent } from './PropertyPaneResetFieldComponent';

export function PropertyPaneResetField(targetProperty: string, props: {
  value: string[];
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneResetFieldComponent
            value={props.value}
            setValue={(val) => changeCallback(targetProperty, val)}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
