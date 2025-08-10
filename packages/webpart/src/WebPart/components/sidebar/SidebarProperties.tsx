import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Link } from '@fluentui/react/lib/Link';
import { IShapeInfo } from 'svgpublish';
import { PropertyList } from './PropertyList';

export const SidebarProperties = (props: {
  shapeInfo?: IShapeInfo;
  selectedProps?: string;
  openHyperlinksInNewWindow?: boolean;
}) => {

  // Convert selectedProps string to array
  const selectedPropsArray = React.useMemo(() => {
    if (!props.selectedProps) return [];
    return props.selectedProps.split(',').map(prop => prop.trim()).filter(prop => prop.length > 0);
  }, [props.selectedProps]);

  // Filter properties if selectedProps is specified
  const filteredProps = props.shapeInfo?.Props ? Object.keys(props.shapeInfo.Props)
    .filter(propName => selectedPropsArray.length === 0 || selectedPropsArray.indexOf(propName) >= 0)
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

  // Transform filtered properties into property list data
  const propertyItems = filteredProps.map(([propName, propValue], index) => ({
    key: index,
    property: propName,
    value: (() => {
      // Check if the value is a URL
      const isUrl = typeof propValue === 'string' &&
        (propValue.indexOf('https://') >= 0 || propValue.indexOf('http://') >= 0);

      if (isUrl) {
        return (
          <Link
            href={propValue}
            target={props.openHyperlinksInNewWindow ? '_blank' : '_self'}
            rel={props.openHyperlinksInNewWindow ? 'noopener noreferrer' : undefined}
          >
            {propValue}
          </Link>
        );
      }

      return <Text>{propValue || ''}</Text>;
    })()
  }));

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <PropertyList
        items={propertyItems}
        density='comfortable'
      />
    </Stack>
  );
};
