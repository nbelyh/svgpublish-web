import * as React from 'react';
import { useTheme, mergeStyleSets, FontWeights } from '@fluentui/react';
import { Text } from '@fluentui/react/lib/Text';

type NavItem = {
  key: React.Key;
  id: number;
  name: string;
  isSelected?: boolean;
};

type Props = {
  items: NavItem[];
  selectedKey?: string;
  onItemClick?: (item: NavItem) => void;
  density?: 'comfortable' | 'compact';
};

export function NavList({
  items,
  selectedKey,
  onItemClick,
  density = 'comfortable',
}: Props) {
  const theme = useTheme();
  const pad = density === 'compact' ? '6px 12px' : '8px 12px';

  const classes = React.useMemo(
    () =>
      mergeStyleSets({
        container: {
          width: '100%',
          border: 'none',
        },
        item: {
          display: 'block',
          width: '100%',
          padding: pad,
          border: 'none',
          background: 'transparent',
          textAlign: 'left',
          cursor: 'pointer',
          borderLeft: '3px solid transparent',
          color: theme.palette.neutralPrimary,
          fontSize: theme.fonts.small.fontSize,
          fontFamily: theme.fonts.small.fontFamily,
          textDecoration: 'none',
          outline: 'none',
          selectors: {
            '&:hover': {
              background: theme.palette.neutralLighterAlt,
              color: theme.palette.neutralDark,
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.themePrimary}`,
              outlineOffset: -2,
            },
            '&[data-selected="true"]': {
              background: theme.palette.themeLighterAlt,
              borderLeftColor: theme.palette.themePrimary,
              color: theme.palette.themeDarkAlt,
              fontWeight: FontWeights.semibold,
            },
            '&[data-selected="true"]:hover': {
              background: theme.palette.themeLight,
            },
          },
        },
      }),
    [theme, pad]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onItemClick?.(item);
    }
  };

  return (
    <div className={classes.container} role="list">
      {items.map(item => {
        const isSelected = selectedKey === item.key.toString();
        return (
          <button
            key={item.key}
            className={classes.item}
            data-selected={isSelected}
            onClick={() => onItemClick?.(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            role="listitem"
            type="button"
            aria-current={isSelected ? 'page' : undefined}
          >
            <Text>{item.name}</Text>
          </button>
        );
      })}
    </div>
  );
}
