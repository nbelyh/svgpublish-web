import * as React from 'react';
import { DefaultButton, TooltipHost } from '@fluentui/react';

export function PropertyPaneResetFieldComponent(props: {
  value: string[];
  setValue: (value: string[]) => void;
}) {

  const protectedSettings = props.value || [];
  const label = `Reset to Defaults${protectedSettings?.length > 0 ? ` (${protectedSettings.length} customized)` : ''}`

  const onClick = () => {
    props.setValue([]);
  }

  return (
    <TooltipHost content={protectedSettings.join(', ') || 'No customized settings'}>
      <DefaultButton
        text={label}
        disabled={!protectedSettings.length}
        onClick={onClick}
      />
    </TooltipHost>
  );
}
