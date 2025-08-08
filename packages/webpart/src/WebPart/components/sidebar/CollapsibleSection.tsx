import * as React from 'react';
import { Stack, Text, IconButton, useTheme } from '@fluentui/react';

export interface ICollapsibleSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = (props: ICollapsibleSectionProps) => {
  const { title, isCollapsed, onToggle, children } = props;
  const theme = useTheme();

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Text
          variant="mediumPlus"
          styles={{ root: { fontWeight: '600', cursor: 'pointer' } }}
          onClick={onToggle}
        >
          {title}
        </Text>
        <IconButton
          iconProps={{ iconName: isCollapsed ? 'ChevronRight' : 'ChevronDown' }}
          onClick={onToggle}
        />
      </Stack>
      {!isCollapsed && (
        <Stack tokens={{ childrenGap: 8 }}>
          {children}
        </Stack>
      )}
    </Stack>
  );
};
