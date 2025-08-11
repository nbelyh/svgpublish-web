import * as React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { IWebPartPropertiesCallback } from 'WebPart/IWebPartPropertiesCallback';

export function PropertyPanePropsListFieldComponent(props: {
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  label: string;
  description?: string;
  propertiesCallback: IWebPartPropertiesCallback;
}) {

  // Convert comma-separated string to array
  const selectedPropsArray = React.useMemo(() => {
    if (!props.value) return [];
    return props.value.split(',').map(prop => prop.trim()).filter(prop => prop.length > 0);
  }, [props.value]);

  // Get available properties from the provided list or fallback to current value
  const availableProperties: IDropdownOption[] = React.useMemo(() => {
    const availableProperties = props.propertiesCallback.getAvailableProperties();
    if (availableProperties.length > 0) {
      // Use properties from the diagram
      return availableProperties.map(prop => ({
        key: prop,
        text: prop
      }));
    }

    // If no diagram properties available, use the current value as options
    if (props.value) {
      return selectedPropsArray.map(prop => ({
        key: prop,
        text: prop
      }));
    }

    // Fallback to empty array
    return [];
  }, [props.propertiesCallback, selectedPropsArray, props.value]);

  const handleSelectionChange = React.useCallback((event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      const newSelection = option.selected
        ? [...selectedPropsArray, option.key as string]
        : selectedPropsArray.filter(key => key !== option.key);

      // Convert back to comma-separated string
      const newValue = newSelection.join(', ');
      props.setValue(newValue);
    }
  }, [selectedPropsArray, props.setValue]);

  const hasOptions = availableProperties.length > 0;
  const placeholderText = hasOptions
    ? "Select properties to show"
    : "No properties available - load a diagram first";

  return (
    <Stack tokens={{ childrenGap: 4 }}>
      <Dropdown
        label={props.label}
        placeholder={placeholderText}
        multiSelect
        options={availableProperties}
        selectedKeys={selectedPropsArray}
        onChange={handleSelectionChange}
        disabled={props.disabled || !hasOptions}
      />
      {props.description && (
        <Text variant="small" style={{ color: '#666' }}>
          {props.description}
        </Text>
      )}
      {!hasOptions && (
        <Text variant="small" style={{ color: '#888', fontStyle: 'italic' }}>
          Property options will appear once a diagram is loaded
        </Text>
      )}
    </Stack>
  );
}
