import * as React from 'react';
import * as ReactDom from 'react-dom';
import { PropertyPaneIndentedToggleComponent } from './PropertyPaneIndentedToggleComponent'

export function PropertyPaneIndentedToggle(targetProperty: string, props: {
  label: string;
  disabled?: boolean;
  inlineLabel?: boolean;
  indentLevel?: number;
  checked?: boolean;
}) {

  return {
    targetProperty: targetProperty,
    type: 1,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneIndentedToggleComponent
            label={props.label}
            disabled={props.disabled || false}
            inlineLabel={props.inlineLabel || false}
            indentLevel={props.indentLevel || 0}
            checked={props.checked || false}
            onChange={(checked) => changeCallback(targetProperty, checked)}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
