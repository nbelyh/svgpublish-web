import * as React from 'react';
import { Panel, PanelType, Text, Stack } from '@fluentui/react';

export const AppSidebar = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  sidebarType?: 'small' | 'smallFixedFar' | 'smallFixedNear' | 'medium' | 'large' | 'largeFixed' | 'extraLarge' | 'custom' | 'customNear';
  enableSidebarTitle?: boolean;
  enableSidebarMarkdown?: boolean;
  sidebarMarkdown?: string;
  sidebarDefaultWidth?: string;
}) => {

  // TODO: Will integrate with marked library later for proper markdown rendering

  const getPanelType = (): PanelType => {
    switch (props.sidebarType || 'medium') {
      case 'small':
        return PanelType.smallFixedFar;
      case 'smallFixedFar':
        return PanelType.smallFixedFar;
      case 'smallFixedNear':
        return PanelType.smallFixedNear;
      case 'medium':
        return PanelType.medium;
      case 'large':
        return PanelType.large;
      case 'largeFixed':
        return PanelType.largeFixed;
      case 'extraLarge':
        return PanelType.extraLarge;
      case 'custom':
        return PanelType.custom;
      case 'customNear':
        return PanelType.customNear;
      default:
        return PanelType.medium;
    }
  };  const renderSidebarContent = () => {
    if (props.enableSidebarMarkdown && props.sidebarMarkdown) {
      // TODO: Will use marked library for proper markdown rendering
      return (
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px' }}>
          {props.sidebarMarkdown}
        </div>
      );
    }

    const getSidebarPosition = () => {
      const type = props.sidebarType || 'medium';
      return type.includes('Near') ? 'right' : 'left';
    };

    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          This is the sidebar content area. Configure custom content using the sidebar markdown option.
        </Text>
        <Text variant="small" style={{ color: 'gray' }}>
          Sidebar is positioned on the {getSidebarPosition()} side with type: {props.sidebarType || 'medium'}
          {(props.sidebarType === 'custom' || props.sidebarType === 'customNear') && props.sidebarDefaultWidth && ` (${props.sidebarDefaultWidth})`}
        </Text>
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="mediumPlus" style={{ fontWeight: 'bold' }}>Configuration:</Text>
          <Text variant="small">• Show Title: {props.enableSidebarTitle !== false ? 'Yes' : 'No'}</Text>
          <Text variant="small">• Custom Content: {props.enableSidebarMarkdown ? 'Enabled' : 'Disabled'}</Text>
          <Text variant="small">• Position: {getSidebarPosition()}</Text>
          <Text variant="small">• Type: {props.sidebarType || 'medium'}</Text>
          {(props.sidebarType === 'custom' || props.sidebarType === 'customNear') && (
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
      {...((props.sidebarType === 'custom' || props.sidebarType === 'customNear') && { customWidth: props.sidebarDefaultWidth || '300px' })}
      closeButtonAriaLabel="Close sidebar"
      isHiddenOnDismiss={true}
    >
      {renderSidebarContent()}
    </Panel>
  );
};
