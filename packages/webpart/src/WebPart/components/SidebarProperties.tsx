import * as React from 'react';
import {
  Stack,
  Text,
  DetailsList,
  IColumn,
  DetailsListLayoutMode,
  SelectionMode,
  Link
} from '@fluentui/react';
import { IShapeInfo } from 'svgpublish';

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

  // Define columns for the DetailsList
  const columns: IColumn[] = [
    {
      key: 'property',
      name: 'Property',
      fieldName: 'property',
      minWidth: 50,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: { property: string; value: string }) => (
        <Text>
          {item.property}
        </Text>
      )
    },
    {
      key: 'value',
      name: 'Value',
      fieldName: 'value',
      minWidth: 50,
      isResizable: true,
      onRender: (item: { property: string; value: string }) => {
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

  // Convert filtered properties to items for DetailsList
  const items = filteredProps.map(([propName, propValue]) => ({
    property: propName,
    value: propValue || ''
  }));

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <DetailsList
        items={items}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={false}
        compact={true}
      />
    </Stack>
  );
};
