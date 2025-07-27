import * as React from 'react';
import {
  Stack,
  Text,
  Link
} from '@fluentui/react';
import { IShapeInfo, ILinkInfo, ISvgPublishContext } from 'svgpublish-react';

export interface ISidebarLinksProps {
  shapeInfo?: IShapeInfo;
  openHyperlinksInNewWindow?: boolean;
  context?: ISvgPublishContext;
}

export const SidebarLinks: React.FC<ISidebarLinksProps> = ({
  shapeInfo,
  openHyperlinksInNewWindow = true,
  context
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
  const links = shapeInfo?.Links ?
    shapeInfo.Links.filter(link => link && link.Address && !link.PageId) : [];

  // If no shape is selected or no links exist
  if (!shapeInfo || !shapeInfo.Links || links.length === 0) {
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

        return (
          <Link
            key={index}
            href={link.Address}
            target={openHyperlinksInNewWindow ? '_blank' : '_self'}
            rel={openHyperlinksInNewWindow ? 'noopener noreferrer' : undefined}
          >
            {text}
          </Link>
        );
      })}
    </Stack>
  );
};
