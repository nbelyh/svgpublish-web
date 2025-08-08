import * as React from 'react';
import * as ReactDom from 'react-dom';

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PropertyPaneUrlFieldComponent } from './PropertyPaneUrlFieldComponent';
import { IDefaultFolder } from '../services/IDefaultFolder';

export function PropertyPaneUrlField(targetProperty: string, props: {
  url: string;
  context: WebPartContext;
  getDefaultFolder: () => Promise<IDefaultFolder>;
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneUrlFieldComponent
            context={props.context}
            url={props.url}
            setUrl={(url) => changeCallback(targetProperty, url)}
            getDefaultFolder={props.getDefaultFolder}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
