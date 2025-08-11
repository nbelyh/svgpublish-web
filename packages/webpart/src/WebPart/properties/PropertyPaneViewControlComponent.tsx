import * as React from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { IWebPartPropertiesCallback } from 'WebPart/IWebPartPropertiesCallback';

export interface IPropertyPaneViewControlComponentProps {
  context: any;
  currentValue: any;
  changeCallback: (property: string, newValue: any) => void;
  propertiesCallback: IWebPartPropertiesCallback;
  targetProperty: string;
}

export function PropertyPaneViewControlComponent(props: IPropertyPaneViewControlComponentProps) {
  const hasCustomView = !!props.currentValue;

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="medium" style={{ fontWeight: 600 }}>
        Saved View
      </Text>

      <Stack tokens={{ childrenGap: 8 }}>
        <PrimaryButton
          text="Save Current View"
          onClick={() => props.changeCallback(props.targetProperty, props.propertiesCallback.getViewMatrix())}
          iconProps={{ iconName: 'Save' }}
        />

        <DefaultButton
          text="Clear Saved View"
          onClick={() => props.changeCallback(props.targetProperty, '')}
          disabled={!hasCustomView}
          iconProps={{ iconName: 'Clear' }}
        />
      </Stack>

      {hasCustomView && (
        <Text variant="small" style={{ color: '#6a6a6a', fontStyle: 'italic' }}>
          Custom view saved
        </Text>
      )}

      {!hasCustomView && (
        <Text variant="small" style={{ color: '#999999', fontStyle: 'italic' }}>
          Using default view
        </Text>
      )}
    </Stack>
  );
}
