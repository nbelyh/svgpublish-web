import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { marked } from 'marked';
import  Mustache from 'mustache';
import { Stack } from '@fluentui/react/lib/Stack';
import { SidebarProperties } from './SidebarProperties';
import { SidebarLinks } from './SidebarLinks';
import { SidebarLayers } from './SidebarLayers';
import { SidebarPages } from './SidebarPages';
import { SidebarSearch } from './SidebarSearch';
import { CollapsibleSection } from './CollapsibleSection';
import { IDiagramSettings, ISvgPublishContext } from 'svgpublish';

export const AppSidebar = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  context: ISvgPublishContext,
  selectedShapeId?: string;
  settings: IDiagramSettings;
  onNavigateToPage?: (pageUrl: string, pageName: string) => void;
  onNavigateToShape?: (shapeId: string, term?: string) => void;
  baseUrl?: string;
}) => {

    // State for managing collapsed sections
  const [collapsedSections, setCollapsedSections] = React.useState<{[key: string]: boolean}>({
    properties: false,
    links: false,
    layers: false,
    pages: false,
    search: false,
    content: false
  });

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const sidebarContent = React.useMemo(() => {
    const diagram = props.context?.diagram;
    if (diagram) {
      const shape = props.selectedShapeId ? diagram.shapes[props.selectedShapeId] : diagram.currentPageShape;
      const sidebarMarkdown = shape && shape.SidebarMarkdown || (diagram.settings.enableSidebarMarkdown && diagram.settings.sidebarMarkdown) || '';
      const md = sidebarMarkdown && Mustache.render(sidebarMarkdown, shape);
      const content = md && (marked.parse(md) as string).trim();
      return content;
    }
  }, [props.context, props.selectedShapeId]);

  const renderSidebarContent = () => {
    // Get the selected shape info from the context
    const selectedShapeInfo = props.selectedShapeId && props.context?.diagram?.shapes ?
      props.context.diagram.shapes[props.selectedShapeId] : undefined;

    // Check if properties should be shown and are available
    const hasPropertiesContent = props.settings.enableProps && selectedShapeInfo &&
      selectedShapeInfo.Props && Object.keys(selectedShapeInfo.Props).length > 0;

    // Check if links should be shown and are available
    const hasLinksContent = props.settings.enableLinks && selectedShapeInfo &&
      selectedShapeInfo.Links && selectedShapeInfo.Links.length > 0;

    // Check if layers should be shown and are available
    const hasLayersContent = props.settings.enableLayers &&
      props.context?.diagram?.layers?.length > 0;

    // Check if pages should be shown and are available
    const hasPagesContent = props.settings.enablePages &&
      props.context?.diagram?.pages?.length > 0;

    // Check if search should be shown and is available
    const hasSearchContent = props.settings.enableSearch &&
      props.context?.diagram?.searchIndex && Object.keys(props.context.diagram.searchIndex).length > 0;

    const hasMarkdownContent = props.settings.enableSidebarMarkdown && props.settings.sidebarMarkdown;

    // If we have any content to show
    if (hasPropertiesContent || hasLinksContent || hasLayersContent || hasPagesContent || hasSearchContent || hasMarkdownContent) {
      return (
        <Stack style={{ marginTop: 16 }} tokens={{ childrenGap: 16 }}>
          {hasMarkdownContent && (
            <CollapsibleSection title="Content" isCollapsed={collapsedSections.content} onToggle={() => toggleSection('content')}>
              <div dangerouslySetInnerHTML={{ __html: sidebarContent }} />
            </CollapsibleSection>
          )}

          {hasSearchContent && (
            <CollapsibleSection
              title="Search"
              isCollapsed={collapsedSections.search}
              onToggle={() => toggleSection('search')}
            >
              <SidebarSearch
                context={props.context}
                enablePropertySearchFilter={props.settings.enablePropertySearchFilter}
                onNavigateToShape={props.onNavigateToShape}
                onNavigateToPage={props.onNavigateToPage}
                baseUrl={props.baseUrl}
              />
            </CollapsibleSection>
          )}

          {hasPagesContent && (
            <CollapsibleSection
              title="Pages"
              isCollapsed={collapsedSections.pages}
              onToggle={() => toggleSection('pages')}
            >
              <SidebarPages
                context={props.context}
                enablePageLookup={props.settings.enablePageLookup}
                enablePageSort={props.settings.enablePageSort}
                onNavigateToPage={props.onNavigateToPage}
                baseUrl={props.baseUrl}
              />
            </CollapsibleSection>
          )}

          {hasLayersContent && (
            <CollapsibleSection
              title="Layers"
              isCollapsed={collapsedSections.layers}
              onToggle={() => toggleSection('layers')}
            >
              <SidebarLayers
                context={props.context}
                enableLayerLookup={props.settings.enableLayerLookup}
                enableLayerSort={props.settings.enableLayerSort}
                enableLayerShowAll={props.settings.enableLayerShowAll}
              />
            </CollapsibleSection>
          )}

          {hasLinksContent && (
            <CollapsibleSection
              title="Links"
              isCollapsed={collapsedSections.links}
              onToggle={() => toggleSection('links')}
            >
              <SidebarLinks
                shape={selectedShapeInfo}
                openHyperlinksInNewWindow={props.settings.openHyperlinksInNewWindow}
              />
            </CollapsibleSection>
          )}

          {hasPropertiesContent && (
            <CollapsibleSection
              title="Properties"
              isCollapsed={collapsedSections.properties}
              onToggle={() => toggleSection('properties')}
            >
              <SidebarProperties
                shapeInfo={selectedShapeInfo}
                selectedProps={props.settings.selectedProps || []}
                openHyperlinksInNewWindow={props.settings.openHyperlinksInNewWindow}
              />
            </CollapsibleSection>
          )}
        </Stack>
      );
    }
  };

  return (
    <Panel
      headerText={props.settings.enableSidebarTitle !== false ? "Sidebar" : undefined}
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      type={PanelType[(props.settings.sidebarType || 'medium') as keyof typeof PanelType] || PanelType.medium}
      {...((props.settings.sidebarType === 'custom' || props.settings.sidebarType === 'customNear') && { customWidth: props.settings.sidebarDefaultWidth || '300px' })}
      closeButtonAriaLabel="Close sidebar"
      isHiddenOnDismiss={true}
      isBlocking={false}
    >
      {renderSidebarContent()}
    </Panel>
  );
};
