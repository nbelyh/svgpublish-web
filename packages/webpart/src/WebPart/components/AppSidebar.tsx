import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react';

export interface AppSidebarProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onDismiss }) => {
  return (
    <Panel
      headerText="Sidebar"
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.medium}
      closeButtonAriaLabel="Close sidebar"
    >
      {/* Content will be added later */}
    </Panel>
  );
};
