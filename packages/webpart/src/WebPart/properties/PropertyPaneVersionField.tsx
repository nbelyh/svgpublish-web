import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Stack } from '@fluentui/react/lib/Stack';

export function PropertyPaneVersionField(version: string) {

  return {
    targetProperty: '',
    type: 1,
    properties: {
      key: 'version',
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        const elem = (
          <Stack tokens={{ padding: 8, childrenGap: 4 }}>
            <Stack.Item>{`SvgPublish WebPart Version: ${version}`}</Stack.Item>
          </Stack>
        );
        return ReactDom.render(elem, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
