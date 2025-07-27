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
  // If no shape is selected or no properties exist
  if (!shapeInfo || !shapeInfo.Props || Object.keys(shapeInfo.Props).length === 0) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium" styles={{ root: { color: '#666' } }}>
          No Shape Data
        </Text>
      </Stack>
    );
  }

  // Filter properties if selectedProps is specified
  const propKeys = Object.keys(shapeInfo.Props);
  const filteredProps = propKeys.filter((propName) => {
    return selectedProps.length === 0 || selectedProps.indexOf(propName) >= 0;
  }).map(propName => [propName, shapeInfo.Props[propName]] as [string, string]);

  // If no properties match the filter
  if (filteredProps.length === 0) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium" styles={{ root: { color: '#666' } }}>
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
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: { property: string; value: string }) => (
        <Text styles={{ root: { fontWeight: '600' } }}>
          {item.property}
        </Text>
      )
    },
    {
      key: 'value',
      name: 'Value',
      fieldName: 'value',
      minWidth: 150,
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
    <Stack tokens={{ childrenGap: 16 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
        Properties
      </Text>

      <DetailsList
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        compact={true}
        styles={{
          root: {
            border: '1px solid #e1e1e1',
            borderRadius: '2px'
          },
          headerWrapper: {
            backgroundColor: '#f8f8f8'
          }
        }}
      />
    </Stack>
  );
};
