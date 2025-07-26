import * as React from 'react';
import { Panel, PanelType, Text, Stack } from '@fluentui/react';

export const AppSidebar = (props: {
  isOpen: boolean;
  onDismiss: () => void;
  sidebarType?: 'smallFixedFar' | 'smallFixedNear' | 'medium' | 'large' | 'largeFixed' | 'extraLarge' | 'custom' | 'customNear';
  enableSidebarTitle?: boolean;
  enableSidebarMarkdown?: boolean;
  sidebarMarkdown?: string;
  sidebarDefaultWidth?: string;
}) => {

  // TODO: Will integrate with marked library later for proper markdown rendering

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
      </Stack>
    );
  };

  return (
    <Panel
      headerText={props.enableSidebarTitle !== false ? "Sidebar" : undefined}
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      type={PanelType[(props.sidebarType || 'medium') as keyof typeof PanelType] || PanelType.medium}
      {...((props.sidebarType === 'custom' || props.sidebarType === 'customNear') && { customWidth: props.sidebarDefaultWidth || '300px' })}
      closeButtonAriaLabel="Close sidebar"
      isHiddenOnDismiss={true}
      isBlocking={false}
    >
      {renderSidebarContent()}
    </Panel>
  );
};
