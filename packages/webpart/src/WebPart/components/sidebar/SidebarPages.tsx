import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { NavList } from './NavList';
import { IPageInfo, ISvgPublishContext } from 'svgpublish';

export const SidebarPages = (props: {
  context: ISvgPublishContext;
  enablePageLookup?: boolean;
  enablePageSort?: boolean;
  onNavigateToPage?: (pageUrl: string, pageName: string, shapeId?: string) => void;
  baseUrl?: string;
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Get pages from context
  const pages = props.context?.diagram?.pages ?? [];
  const currentPage = props.context?.diagram?.currentPage;

  // Numeric sort function (same as in vp-pages.js)
  const numericSort = (data: IPageInfo[]): IPageInfo[] => {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return [...data].sort((a, b) => collator.compare(a.Name, b.Name));
  };

  // Filter and sort pages
  const getFilteredPages = (): IPageInfo[] => {
    let filteredPages = pages;

    // Apply search filter
    if (searchTerm) {
      const regex = new RegExp(searchTerm.replace(/([\\.+*?[^]$(){}=!<>|:])/g, "\\$1"), 'gi');
      filteredPages = pages.filter(page => regex.test(page.Name));
    }

    // Apply sorting if enabled
    if (props.enablePageSort) {
      return numericSort(filteredPages);
    }

    return filteredPages;
  };

  const filteredPages = getFilteredPages();

  // Build page URL (same logic as TopFrame)
  const buildPageUrl = (page: IPageInfo): string => {
    if (!props.baseUrl) {
      // Fallback to old logic if baseUrl is not provided
      const curpath = window.location.pathname;
      const newpath = curpath.replace(curpath.substring(curpath.lastIndexOf('/') + 1), page.FileName);
      return window.location.protocol + "//" + window.location.host + newpath;
    }

    // Use the same logic as TopFrame: extract base directory and append filename
    const baseUrl = props.baseUrl.substring(0, props.baseUrl.lastIndexOf('/') + 1);
    return baseUrl + page.FileName;
  };

  // Handle page navigation
  const handlePageClick = (page: IPageInfo) => {
    if (props.onNavigateToPage) {
      const pageUrl = buildPageUrl(page);
      props.onNavigateToPage(pageUrl, page.Name);
    }
  };

  // Highlight search terms in page name
  const highlightSearchTerm = (pageName: string): string => {
    if (!searchTerm) {
      return pageName;
    }

    // For simple text display, we'll return the plain text
    return pageName;
  };

  // Build page items for PageList component
  const buildPageItems = () => {
    return filteredPages.map((page) => ({
      key: page.Id.toString(),
      id: page.Id,
      name: highlightSearchTerm(page.Name),
      isSelected: currentPage?.Id === page.Id
    }));
  };

  const pageItems = buildPageItems();

  // Handle page item clicks
  const handlePageItemClick = (item: { id: number; name: string }) => {
    const page = pages.find(p => p.Id === item.id);
    if (page) {
      handlePageClick(page);
    }
  };

  // If no pages available
  if (pages.length === 0) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          No Pages Available
        </Text>
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      {/* Search box if lookup is enabled */}
      {props.enablePageLookup && (
        <SearchBox
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(_, newValue) => setSearchTerm(newValue || '')}
        />
      )}

      {/* Pages navigation */}
      {filteredPages.length === 0 ? (
        <Text variant="small">
          No pages match your search
        </Text>
      ) : (
        <NavList
          items={pageItems}
          selectedKey={currentPage?.Id.toString()}
          onItemClick={handlePageItemClick}
          density='comfortable'
        />
      )}
    </Stack>
  );
};
