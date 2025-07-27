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
import { IShapeInfo } from 'svgpublish-react';

export interface ISidebarPropertiesProps {
  shapeInfo?: IShapeInfo;
  selectedProps?: string[];
  openHyperlinksInNewWindow?: boolean;
}

export const SidebarProperties: React.FC<ISidebarPropertiesProps> = ({
  shapeInfo,
  selectedProps = [],
  openHyperlinksInNewWindow = true
}) => {

  // Filter properties if selectedProps is specified
  const filteredProps = shapeInfo?.Props ? Object.keys(shapeInfo.Props)
    .filter(propName => selectedProps.length === 0 || selectedProps.indexOf(propName) >= 0)
    .map(propName => [propName, shapeInfo.Props[propName]] as [string, string]) : [];

  // If no shape is selected, no properties exist, or no properties match the filter
  if (!shapeInfo || !shapeInfo.Props || Object.keys(shapeInfo.Props).length === 0 || filteredProps.length === 0) {
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
              target={openHyperlinksInNewWindow ? '_blank' : '_self'}
              rel={openHyperlinksInNewWindow ? 'noopener noreferrer' : undefined}
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
