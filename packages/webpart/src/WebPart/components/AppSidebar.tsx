import * as React from 'react';
import { Panel, PanelType, Text, Stack } from '@fluentui/react';
import { SidebarProperties } from './SidebarProperties';
import { SidebarLinks } from './SidebarLinks';
import { CollapsibleSection } from './CollapsibleSection';
import { IWebPartProps } from '../IWebPartProps';
import { ISvgPublishContext } from 'svgpublish-react';

export const AppSidebar = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  context: ISvgPublishContext,
  selectedShapeId?: string;
  webpartConfig: IWebPartProps;
}) => {

  // State for managing collapsed sections
  const [collapsedSections, setCollapsedSections] = React.useState<{[key: string]: boolean}>({
    properties: false,
    links: false,
    content: false
  });

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // TODO: Will integrate with marked library later for proper markdown rendering

  const renderSidebarContent = () => {
    // Get the selected shape info from the context
    const selectedShapeInfo = props.selectedShapeId && props.context?.diagram?.shapes ?
      props.context.diagram.shapes[props.selectedShapeId] : undefined;

    // Check if properties should be shown and are available
    const hasPropertiesContent = props.webpartConfig.enableProps && selectedShapeInfo &&
      selectedShapeInfo.Props && Object.keys(selectedShapeInfo.Props).length > 0;

    // Check if links should be shown and are available
    const hasLinksContent = props.webpartConfig.enableSidebarLinks && selectedShapeInfo &&
      selectedShapeInfo.Links && selectedShapeInfo.Links.length > 0;

    const hasMarkdownContent = props.webpartConfig.enableSidebarMarkdown && props.webpartConfig.sidebarMarkdown;

    // If we have any content to show
    if (hasPropertiesContent || hasLinksContent || hasMarkdownContent) {
      return (
        <Stack style={{ marginTop: 16 }} tokens={{ childrenGap: 16 }}>
          {hasMarkdownContent && (
            <CollapsibleSection
              title="Content"
              isCollapsed={collapsedSections.content}
              onToggle={() => toggleSection('content')}
            >
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px' }}>
                {props.webpartConfig.sidebarMarkdown}
              </div>
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
                selectedProps={props.webpartConfig.selectedProps || []}
                openHyperlinksInNewWindow={props.webpartConfig.openHyperlinksInNewWindow}
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
                shapeInfo={selectedShapeInfo}
                openHyperlinksInNewWindow={props.webpartConfig.openHyperlinksInNewWindow}
                context={props.context}
              />
            </CollapsibleSection>
          )}
        </Stack>
      );
    }

    // Default content
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          This is the sidebar content area. Configure custom content using the sidebar markdown option.
        </Text>
      </Stack>
    );
  };

  return (
    <Panel
      headerText={props.webpartConfig.enableSidebarTitle !== false ? "Sidebar" : undefined}
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      type={PanelType[(props.webpartConfig.sidebarType || 'medium') as keyof typeof PanelType] || PanelType.medium}
      {...((props.webpartConfig.sidebarType === 'custom' || props.webpartConfig.sidebarType === 'customNear') && { customWidth: props.webpartConfig.sidebarDefaultWidth || '300px' })}
      closeButtonAriaLabel="Close sidebar"
      isHiddenOnDismiss={true}
      isBlocking={false}
    >
      {renderSidebarContent()}
    </Panel>
  );
};
