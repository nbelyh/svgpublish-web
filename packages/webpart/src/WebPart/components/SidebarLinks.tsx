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

  const pages = context?.diagram?.pages || [];
  const currentPath = window.location.pathname;

  // Build link target location based on the original vp-links.js logic
  const buildLinkTargetLocation = (link: ILinkInfo): string => {
    if (link.Address) {
      return link.Address;
    }

    const linkPageId = link.PageId;
    if (linkPageId >= 0 && pages) {
      const targetPage = pages.find(p => p.Id === linkPageId);
      if (targetPage && currentPath) {
        const newPath = currentPath.replace(
          currentPath.substring(currentPath.lastIndexOf('/') + 1),
          targetPage.FileName
        );
        let href = window.location.protocol + "//" + window.location.host + newPath;

        if (link.ShapeId) {
          href += "#?shape=" + link.ShapeId;
        }

        if (link.Zoom) {
          href += (link.ShapeId ? "&" : "#?") + "zoom=" + link.Zoom;
        }

        return href;
      }
    }

    return "#";
  };

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

  // Filter and prepare links
  const links = shapeInfo?.Links ? shapeInfo.Links.filter(link => link) : [];

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
    <Stack tokens={{ childrenGap: 16 }}>
      <Text variant="mediumPlus">
        Links
      </Text>

      <Stack tokens={{ childrenGap: 8 }}>
        {links.map((link, index) => {
          const href = buildLinkTargetLocation(link);
          const text = buildLinkText(link);

          return (
            <Link
              key={index}
              href={href}
              target={link.Address && openHyperlinksInNewWindow ? '_blank' : '_self'}
              rel={link.Address && openHyperlinksInNewWindow ? 'noopener noreferrer' : undefined}
            >
              {text}
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
};
