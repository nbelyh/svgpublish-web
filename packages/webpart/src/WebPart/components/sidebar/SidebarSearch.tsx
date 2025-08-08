import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { useTheme } from '@fluentui/react/lib/Theme';
import { ISvgPublishContext } from 'svgpublish';

export interface ISidebarSearchProps {
  context: ISvgPublishContext;
  enablePropertySearchFilter?: boolean;
  onNavigateToShape?: (shapeId: string, term?: string) => void;
  onNavigateToPage?: (pageUrl: string, pageName: string) => void;
  baseUrl?: string;
  term?: string; // Optional search term to initialize the search
}

export const SidebarSearch: React.FC<ISidebarSearchProps> = ({
  context,
  enablePropertySearchFilter,
  onNavigateToShape,
  onNavigateToPage,
  baseUrl
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProperties, setSelectedProperties] = React.useState<string[]>([]);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  // Parse search term to escape regex special characters
  const parseSearchTerm = (term: string): string => {
    return term.replace(/([\\.+*?[^]$(){}=!<>|:])/g, "\\$1");
  };

  // Get available properties for filtering
  const availableProperties = React.useMemo(() => {
    const usedPropSet: { [key: string]: boolean } = {};
    const searchIndex = context?.diagram?.searchIndex;

    if (searchIndex) {
      for (const pageId in searchIndex) {
        const pageSearchIndex = searchIndex[pageId];
        for (const shapeId in pageSearchIndex) {
          for (const propName in pageSearchIndex[shapeId]) {
            usedPropSet[propName] = true;
          }
        }
      }
    }

    return Object.keys(usedPropSet).map(prop => ({
      key: prop,
      text: prop
    }));
  }, [context?.diagram?.searchIndex]);  // Build page URL for external navigation

  const buildPageUrl = (pageId: number, shapeId: string, term: string): string => {
    const page = context.diagram.pages.find(p => p.Id === pageId);
    if (!page) {
      return '';
    }

    // Replace current filename with target page filename
    const currentPath = baseUrl || '';
    const newPath = currentPath.replace(currentPath.substring(currentPath.lastIndexOf('/') + 1), page.FileName);
    const targetUrl = `${newPath}#?shape=${shapeId}&term=${encodeURIComponent(term)}`;
    return targetUrl;
  };

  // Search function
  const performSearch = React.useCallback((term: string, propFilters: string[] = []) => {
    if (!context?.diagram?.searchIndex || (!term && !propFilters.length)) {
      setSearchResults([]);
      return;
    }

    const parsed = parseSearchTerm(term);
    const searchRegex = term ? new RegExp(parsed, 'i') : null;
    const results: any[] = [];
    const currentPageId = context.diagram.currentPage?.Id;

    const processPage = (pageId: number, isExternal: boolean) => {
      const pageSearchIndex = context.diagram.searchIndex[pageId];
      if (!pageSearchIndex) return;

      for (const shapeId in pageSearchIndex) {
        const searchInfos = pageSearchIndex[shapeId];
        const foundProperties: string[] = [];
        const foundTexts: string[] = [];

        for (const propName in searchInfos) {
          // Check property filter
          if (propFilters.length && !propFilters.includes(propName)) {
            continue;
          }

          const searchText = searchInfos[propName];

          // Check search term
          if (!searchRegex || searchRegex.test(searchText)) {
            foundTexts.push(searchText);
            foundProperties.push(propName);
          }
        }

        if (foundTexts.length > 0) {
          let notes = foundProperties.join(', ');

          if (isExternal) {
            const page = context.diagram.pages?.find(p => p.Id === pageId);
            if (page) {
              if (notes) notes += ' / ';
              notes += page.Name;
            }
          }

          // Highlight search term in text
          let highlightedText = foundTexts.join(", ");
          if (term && searchRegex) {
            const replaceRegex = new RegExp("(" + parsed + ")", 'gi');
            highlightedText = highlightedText.replace(replaceRegex, "<strong>$1</strong>");
          }

          results.push({
            shapeId,
            pageId,
            text: highlightedText,
            notes,
            isExternal,
            url: isExternal ? buildPageUrl(pageId, shapeId, term) : undefined
          });
        }
      }
    };

    processPage(currentPageId, false);

    // Process other pages if multi-page search is enabled
    for (const key in context.diagram.searchIndex) {
      const pageId = parseInt(key);
      if (pageId !== currentPageId) {
        processPage(pageId, true);
      }
    }

    setSearchResults(results);
  }, [context?.diagram, baseUrl]);

  // Handle search term change
  React.useEffect(() => {
    performSearch(searchTerm, selectedProperties);
  }, [searchTerm, selectedProperties, performSearch]);

  // Handle result click
  const handleResultClick = (result: any) => {
    if (result.isExternal && result.url && onNavigateToPage) {
      const page = context?.diagram?.pages?.find(p => p.Id === result.pageId);
      if (page) {
        onNavigateToPage(result.url, page.Name);
      }
    } else if (onNavigateToShape) {
      onNavigateToShape(result.shapeId, searchTerm);
    }
  };

  if (!context?.diagram?.searchIndex) {
    return null;
  }

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <SearchBox
        placeholder="Search shapes..."
        value={searchTerm}
        onChange={(_, newValue) => setSearchTerm(newValue || '')}
      />

      {enablePropertySearchFilter === true && availableProperties.length > 0 && (
        <Dropdown
          placeholder="Filter by property"
          multiSelect
          options={availableProperties}
          selectedKeys={selectedProperties}
          onChange={(_, option) => {
            if (option) {
              const newSelection = option.selected
                ? [...selectedProperties, option.key as string]
                : selectedProperties.filter(key => key !== option.key);
              setSelectedProperties(newSelection);
            }
          }}
        />
      )}

      {(searchTerm || selectedProperties.length > 0) && (
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="small">
            <strong>Search results for:</strong> {searchTerm}
            {selectedProperties.length > 0 && ` (${selectedProperties.join(', ')})`}
          </Text>

          {searchResults.length > 0 ? (
            <Stack tokens={{ childrenGap: 4 }}>
              {searchResults.map((result, index) => (
                <Stack
                  key={`${result.shapeId}-${index}`}
                  onClick={() => handleResultClick(result)}
                  styles={{
                    root: {
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.palette.neutralLighter}`,
                      ':hover': {
                        backgroundColor: theme.palette.neutralLighter,
                        borderColor: theme.palette.neutralLight
                      }
                    }
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: result.text }}
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  />
                  {result.notes && (
                    <Text
                      variant="small"
                      styles={{
                        root: {
                          color: theme.palette.neutralSecondary,
                          marginTop: '4px'
                        }
                      }}
                    >
                      {result.notes}
                    </Text>
                  )}
                </Stack>
              ))}
            </Stack>
          ) : (
            <Text variant="small" styles={{ root: { color: theme.palette.neutralSecondary } }}>
              No results found
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};
