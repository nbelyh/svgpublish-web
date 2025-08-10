import * as React from 'react';
import {  mergeStyleSets, FontWeights } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';

type Column<T> = {
  key: string;
  name: string;
  fieldName?: keyof T;
  minWidth?: number;
  width?: number; // Fixed width
  align?: 'left' | 'center' | 'right';
  onRender?: (item: T) => React.ReactNode;
};

type Props<T extends { key: React.Key }> = {
  items: T[];
  columns: Column<T>[];
  density?: 'comfortable' | 'compact';
  onRowClick?: (item: T) => void;
};

export function Table<T extends { key: React.Key }>({
  items,
  columns,
  density = 'comfortable',
  onRowClick,
}: Props<T>) {
  const theme = useTheme();
  const pad = density === 'compact' ? '4px 8px' : '8px 12px';

  const classes = React.useMemo(
    () =>
      mergeStyleSets({
        table: { width: '100%', borderCollapse: 'collapse' },
        th: {
          background: theme.palette.neutralLighter,
          color: theme.palette.neutralPrimary,
          fontWeight: FontWeights.semibold,
          textAlign: 'left',
          padding: pad,
          borderBottom: `1px solid ${theme.palette.neutralLight}`,
          position: 'sticky', // remove if you don't want sticky header
          top: 0,
          zIndex: 1,
        },
        td: {
          padding: pad,
          borderBottom: `1px solid ${theme.palette.neutralLight}`,
          color: theme.palette.neutralPrimary,
          verticalAlign: 'middle',
        },
        row: {
          background: theme.palette.white,
          selectors: {
            '&:hover': { background: theme.palette.neutralLighterAlt },
            '&[data-clickable="true"]': { cursor: 'pointer' },
            '&[data-clickable="true"]:focus': {
              outline: `2px solid ${theme.palette.themePrimary}`,
              outlineOffset: -2,
            },
          },
        },
      }),
    [theme, pad]
  );

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {columns.map(c => (
            <th
              key={c.key}
              className={classes.th}
              style={{
                minWidth: c.minWidth,
                width: c.width,
                textAlign: c.align ?? 'left'
              }}
              scope="col"
            >
              {c.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          const clickable = !!onRowClick;
          const onKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
            if (!onRowClick) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onRowClick(item);
            }
          };
          return (
            <tr
              key={item.key}
              className={classes.row}
              data-clickable={clickable}
              tabIndex={clickable ? 0 : undefined}
              role={clickable ? 'button' : undefined}
              onClick={clickable ? () => onRowClick?.(item) : undefined}
              onKeyDown={onKeyDown}
            >
              {columns.map(c => (
                <td
                  key={c.key}
                  className={classes.td}
                  style={{
                    textAlign: c.align ?? 'left',
                    width: c.width
                  }}
                >
                  {c.onRender
                    ? c.onRender(item)
                    : c.fieldName
                      ? String((item as any)[c.fieldName])
                      : ''}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
