import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Label } from '@fluentui/react/lib/Label';
import { ColorComboBox } from './components/ColorComboBox';

export function PropertyPaneColorFieldComponent(props: {
  value: string;
  setValue: (value: string) => void;
  label?: string;
  disabled: boolean;
  defaultValue: string;
  description: string;
}) {

  return (
    <Stack tokens={{ childrenGap: 's2' }}>
      {props.label && <Label>{props.label}</Label>}
      <ColorComboBox
        text={props.value}
        buttonColor={props.value}
        defaultColor={props.defaultValue}
        disabled={props.disabled}
        title={props.label}
        iconName='Color'
        color={props.value}
        setColor={props.setValue}
        isSplit={false}
      />
      <Text variant='small' >{props.description}</Text>
    </Stack>
  );
}
