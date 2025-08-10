import * as React from 'react';
import { mergeStyleSets, FontWeights } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';

type Props = {
  items: { key: React.Key; property: string; value: React.ReactNode }[];
  density?: 'comfortable' | 'compact';
  onRowClick?: (item: { key: React.Key; property: string; value: React.ReactNode }) => void;
};

export function PropertyList({
  items,
  density = 'comfortable',
  onRowClick,
}: Props) {
  const theme = useTheme();
  const pad = density === 'compact' ? 4 : 8;

  const classes = React.useMemo(
    () =>
      mergeStyleSets({
        container: {
          width: '100%',
        },
        row: {
          borderBottom: `1px solid ${theme.palette.neutralLight}`,
          background: theme.palette.white,
          padding: `${pad}px ${pad * 1.5}px`,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: `${pad}px`,
          minHeight: '32px',
          alignItems: 'flex-start',
          selectors: {
            '&:hover': { background: theme.palette.neutralLighterAlt },
            '&[data-clickable="true"]': { cursor: 'pointer' },
            '&[data-clickable="true"]:focus': {
              outline: `2px solid ${theme.palette.themePrimary}`,
              outlineOffset: -2,
            },
          },
        },
        propertyLabel: {
          minWidth: '80px',
          flex: '0 0 auto',
          fontWeight: FontWeights.semibold,
          color: theme.palette.neutralPrimary,
        },
        propertyValue: {
          flex: '1 1 0',
          wordBreak: 'break-word',
          color: theme.palette.neutralPrimary,
        },
      }),
    [theme, pad]
  );

  return (
    <div className={classes.container}>
      {items.map(item => {
        const clickable = !!onRowClick;
        const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (!onRowClick) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRowClick(item);
          }
        };

        return (
          <div
            key={item.key}
            className={classes.row}
            data-clickable={clickable}
            tabIndex={clickable ? 0 : undefined}
            role={clickable ? 'button' : undefined}
            onClick={clickable ? () => onRowClick?.(item) : undefined}
            onKeyDown={onKeyDown}
          >
            <div className={classes.propertyLabel}>
              {item.property}
            </div>
            <div className={classes.propertyValue}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
