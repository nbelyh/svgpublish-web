import * as React from 'react';
import { Panel, PanelType, Text, Stack } from '@fluentui/react';
import { SidebarProperties } from './SidebarProperties';
import { IWebPartProps } from '../IWebPartProps';
import { ISvgPublishContext } from 'svgpublish-react';

export const AppSidebar = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  context: ISvgPublishContext,
  selectedShapeId?: string;
  webpartConfig: IWebPartProps;
}) => {

  // TODO: Will integrate with marked library later for proper markdown rendering

  const renderSidebarContent = () => {
    // Get the selected shape info from the context
    const selectedShapeInfo = props.selectedShapeId && props.context?.diagram?.shapes ?
      props.context.diagram.shapes[props.selectedShapeId] : undefined;

    // Check if properties should be shown and are available
    const hasPropertiesContent = props.webpartConfig.enableProps && selectedShapeInfo &&
      selectedShapeInfo.Props && Object.keys(selectedShapeInfo.Props).length > 0;

    const hasMarkdownContent = props.webpartConfig.enableSidebarMarkdown && props.webpartConfig.sidebarMarkdown;

    // If we have either properties or markdown, show them
    if (hasPropertiesContent || hasMarkdownContent) {
      return (
        <Stack tokens={{ childrenGap: 16 }}>
          {hasMarkdownContent && (
            <Stack tokens={{ childrenGap: 8 }}>
              <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
                Content
              </Text>
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px' }}>
                {props.webpartConfig.sidebarMarkdown}
              </div>
            </Stack>
          )}

          {hasPropertiesContent && (
            <SidebarProperties
              shapeInfo={selectedShapeInfo}
              selectedProps={props.webpartConfig.selectedProps || []}
              labelsConfig={{
                noDataLabel: 'No Shape Data',
                propertyLabel: 'Property',
                valueLabel: 'Value'
              }}
              openHyperlinksInNewWindow={props.webpartConfig.openHyperlinksInNewWindow}
            />
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
