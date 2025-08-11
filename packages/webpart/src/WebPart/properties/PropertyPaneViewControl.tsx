import * as React from 'react';
import * as ReactDom from 'react-dom';

import { PropertyPaneViewControlComponent } from './PropertyPaneViewControlComponent';
import { IWebPartPropertiesCallback } from 'WebPart/IWebPartPropertiesCallback';

export function PropertyPaneViewControl(targetProperty: string, props: {
  context: any;
  currentValue: any;
  propertiesCallback: IWebPartPropertiesCallback;
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneViewControlComponent
            context={props.context}
            currentValue={props.currentValue}
            propertiesCallback={props.propertiesCallback}
            changeCallback={changeCallback}
            targetProperty={targetProperty}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
