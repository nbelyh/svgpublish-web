import * as React from 'react';
import {
  Stack,
  Text,
  Link
} from '@fluentui/react';
import { IShapeInfo, ILinkInfo, ISvgPublishContext } from 'svgpublish-react';

export const SidebarLinks = (props: {
  shape?: IShapeInfo;
  openHyperlinksInNewWindow?: boolean;
}) => {

  // Build link text based on the original vp-links.js logic
  const buildLinkText = (link: ILinkInfo): string => {
    if (link.Description) {
      return link.Description;
    }

    if (link.SubAddress) {
      return link.Address
        ? link.Address + '[' + link.SubAddress + ']'
        : link.SubAddress;
    }

    return link.Address || 'Link';
  };

  // Filter links to only show external links (exclude page links)
  const links = props.shape?.Links?.filter(link =>
    link && (link.Address && +link.PageId < 0)
  ) ?? [];

  // If no shape is selected or no links exist
  if (links.length === 0) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          No Shape Links
        </Text>
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginLeft: '8px' } }}>
      {links.map((link, index) => {
        const text = buildLinkText(link);
        const originalIndex = props.shape?.Links?.indexOf(link) ?? -1;
        const isDefaultLink = props.shape?.DefaultLink === originalIndex;

        return (
          <Link
            key={index}
            href={link.Address}
            target={props.openHyperlinksInNewWindow ? '_blank' : '_self'}
            rel={props.openHyperlinksInNewWindow ? 'noopener noreferrer' : undefined}
            styles={isDefaultLink ? { root: { fontWeight: 'bold' } } : undefined}
          >{text}</Link>
        );
      })}
    </Stack>
  );
};
