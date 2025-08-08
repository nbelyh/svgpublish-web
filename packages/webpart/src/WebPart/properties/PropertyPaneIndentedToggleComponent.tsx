import * as React from 'react';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { mergeStyles } from '@fluentui/react/lib/Styling';

export function PropertyPaneIndentedToggleComponent(props: {
  label: string;
  disabled: boolean;
  inlineLabel: boolean;
  indentLevel: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {

  const indentStyle = mergeStyles({
    marginLeft: `${props.indentLevel * 20}px`, // 20px per indent level
  });

  const handleChange = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
    props.onChange(checked || false);
  };

  return (
    <div className={indentStyle}>
      <Toggle
        label={props.label}
        disabled={props.disabled}
        inlineLabel={props.inlineLabel}
        checked={props.checked}
        onChange={handleChange}
      />
    </div>
  );
}
