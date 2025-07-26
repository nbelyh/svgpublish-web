import * as React from 'react';
import { Panel, PanelType, Text, Stack } from '@fluentui/react';

export const AppSidebar = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  rightSidebar?: boolean;
  enableSidebarTitle?: boolean;
  enableSidebarMarkdown?: boolean;
  sidebarMarkdown?: string;
  sidebarSize?: 'small' | 'medium' | 'large' | 'custom';
  sidebarDefaultWidth?: string;
}) => {

  // TODO: Will integrate with marked library later for proper markdown rendering

  const getPanelType = (): PanelType => {
    const isRightSide = props.rightSidebar;

    switch (props.sidebarSize || 'medium') {
      case 'small':
        return isRightSide ? PanelType.smallFixedNear : PanelType.smallFixedFar;
      case 'medium':
        return isRightSide ? PanelType.medium : PanelType.medium;
      case 'large':
        return isRightSide ? PanelType.large : PanelType.large;
      case 'custom':
        return isRightSide ? PanelType.customNear : PanelType.custom;
      default:
        return isRightSide ? PanelType.medium : PanelType.medium;
    }
  };

  const renderSidebarContent = () => {
    if (props.enableSidebarMarkdown && props.sidebarMarkdown) {
      // TODO: Will use marked library for proper markdown rendering
      return (
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px' }}>
          {props.sidebarMarkdown}
        </div>
      );
    }

    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          This is the sidebar content area. Configure custom content using the sidebar markdown option.
        </Text>
        <Text variant="small" style={{ color: 'gray' }}>
          Sidebar is positioned on the {props.rightSidebar ? 'right' : 'left'} side with size: {props.sidebarSize || 'medium'}
          {props.sidebarSize === 'custom' && props.sidebarDefaultWidth && ` (${props.sidebarDefaultWidth})`}
        </Text>
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="mediumPlus" style={{ fontWeight: 'bold' }}>Configuration:</Text>
          <Text variant="small">• Show Title: {props.enableSidebarTitle !== false ? 'Yes' : 'No'}</Text>
          <Text variant="small">• Custom Content: {props.enableSidebarMarkdown ? 'Enabled' : 'Disabled'}</Text>
          <Text variant="small">• Position: {props.rightSidebar ? 'Right' : 'Left'}</Text>
          <Text variant="small">• Size: {props.sidebarSize || 'medium'}</Text>
          {props.sidebarSize === 'custom' && (
            <Text variant="small">• Custom Width: {props.sidebarDefaultWidth || '300px'}</Text>
          )}
        </Stack>
      </Stack>
    );
  };

  return (
    <Panel
      headerText={props.enableSidebarTitle !== false ? "Sidebar" : undefined}
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      type={getPanelType()}
      {...(props.sidebarSize === 'custom' && { customWidth: props.sidebarDefaultWidth || '300px' })}
      closeButtonAriaLabel="Close sidebar"
      isHiddenOnDismiss={true}
    >
      {renderSidebarContent()}
    </Panel>
  );
};
