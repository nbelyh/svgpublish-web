import * as React from 'react';
import { Stack, Text, SearchBox, Dropdown, IDropdownOption, useTheme } from '@fluentui/react';
import { ISvgPublishContext } from 'svgpublish';

export interface ISidebarSearchProps {
  context: ISvgPublishContext;
  enableMultiPageSearch?: boolean;
  enablePropertySearchFilter?: boolean;
  onNavigateToShape?: (shapeId: string, term?: string) => void;
  onNavigateToPage?: (pageUrl: string, pageName: string) => void;
  baseUrl?: string;
}

export const SidebarSearch: React.FC<ISidebarSearchProps> = ({
  context,
  enableMultiPageSearch,
  enablePropertySearchFilter,
  onNavigateToShape,
  onNavigateToPage,
  baseUrl
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProperties, setSelectedProperties] = React.useState<string[]>([]);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  // Get URL parameter function
  const getUrlParameter = (name: string): string => {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  // Initialize search term from URL on mount
  React.useEffect(() => {
    const urlTerm = getUrlParameter('term');
    if (urlTerm) {
      setSearchTerm(urlTerm);
    }
  }, []);

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
  }, [context?.diagram?.searchIndex]);

  // Build page URL for external navigation
  const buildPageUrl = (pageId: number, shapeId: string, term: string): string => {
    if (!baseUrl || !context?.diagram?.pages) {
      return '';
    }

    const page = context.diagram.pages.find(p => p.Id === pageId);
    if (!page) {
      return '';
    }

    const targetUrl = `${baseUrl}#?shape=${shapeId}&term=${encodeURIComponent(term)}`;
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

    const processPage = (pageId: string, isExternal: boolean) => {
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
            const page = context.diagram.pages?.find(p => p.Id === parseInt(pageId));
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
            pageId: parseInt(pageId),
            text: highlightedText,
            notes,
            isExternal,
            url: isExternal ? buildPageUrl(parseInt(pageId), shapeId, term) : undefined
          });
        }
      }
    };

    // Process current page first
    if (currentPageId) {
      processPage(currentPageId.toString(), false);
    }

    // Process other pages if multi-page search is enabled
    if (enableMultiPageSearch) {
      for (const pageId in context.diagram.searchIndex) {
        if (parseInt(pageId) !== currentPageId) {
          processPage(pageId, true);
        }
      }
    }

    setSearchResults(results);
  }, [context?.diagram, enableMultiPageSearch, baseUrl]);

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
