import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Link } from '@fluentui/react/lib/Link';
import { IShapeInfo } from 'svgpublish';
import { Table } from './Table';

export const SidebarProperties = (props: {
  shapeInfo?: IShapeInfo;
  selectedProps?: string[];
  openHyperlinksInNewWindow?: boolean;
}) => {

  // Filter properties if selectedProps is specified
  const filteredProps = props.shapeInfo?.Props ? Object.keys(props.shapeInfo.Props)
    .filter(propName => props.selectedProps.length === 0 || props.selectedProps.indexOf(propName) >= 0)
    .map(propName => [propName, props.shapeInfo.Props[propName]] as [string, string]) : [];

  // If no shape is selected, no properties exist, or no properties match the filter
  if (filteredProps.length === 0) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          No Shape Data
        </Text>
      </Stack>
    );
  }

  // Transform filtered properties into table data
  const tableItems = filteredProps.map(([propName, propValue], index) => ({
    key: index,
    property: propName,
    value: propValue || ''
  }));

  // Define table columns
  const columns = [
    {
      key: 'property',
      name: 'Property',
      fieldName: 'property' as keyof typeof tableItems[0],
      width: 140, // Fixed width for property column to prevent jumping
    },
    {
      key: 'value',
      name: 'Value',
      onRender: (item: typeof tableItems[0]) => {
        // Check if the value is a URL
        const isUrl = typeof item.value === 'string' &&
          (item.value.indexOf('https://') >= 0 || item.value.indexOf('http://') >= 0);

        if (isUrl) {
          return (
            <Link
              href={item.value}
              target={props.openHyperlinksInNewWindow ? '_blank' : '_self'}
              rel={props.openHyperlinksInNewWindow ? 'noopener noreferrer' : undefined}
            >
              {item.value}
            </Link>
          );
        }

        return <Text>{item.value}</Text>;
      }
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Table
        items={tableItems}
        columns={columns}
        density='comfortable'
      />
    </Stack>
  );
};
