import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { IconButton } from '@fluentui/react/lib/Button';
import { useTheme } from '@fluentui/react/lib/Theme';

export interface ICollapsibleSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = (props: ICollapsibleSectionProps) => {
  const { title, isCollapsed, onToggle, children } = props;
  const theme = useTheme();

  const containerStyles: React.CSSProperties = {
    backgroundColor: theme.palette.white,
    borderRadius: theme.effects.roundedCorner4,
    boxShadow: theme.effects.elevation4,
    padding: '12px 16px',
    marginBottom: '8px'
  };

  return (
    <Stack style={containerStyles} tokens={{ childrenGap: 8 }}>
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
