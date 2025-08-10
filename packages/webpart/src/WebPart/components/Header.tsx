import * as React from 'react'
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { Stack } from '@fluentui/react/lib/Stack';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { IDiagramSettings } from 'svgpublish'

export const Header = (props: {
  url: string;
  breadcrumb: IBreadcrumbItem[];
  settings: IDiagramSettings;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) => {

  const pageUrl = React.useMemo(() => {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.delete('svgpublish-url');
    pageUrl.searchParams.append('svgpublish-url', props.url);
    return pageUrl.toString();
  }, [props.url]);

  const [hashLinkTooltip, setHashLinkTooltip] = React.useState('Copy WebPart Link');

  const formattedFeedbackUrl = React.useMemo(() => {
    const feedbackUrl = props.settings.feedbackUrl || '';
    const result = feedbackUrl ? feedbackUrl.replace('{{URL}}', pageUrl) : pageUrl;
    return result;
  }, [props.settings.feedbackUrl, pageUrl]);

  const onCopyHashLink = async () => {
    await navigator.clipboard.writeText(formattedFeedbackUrl);
    setHashLinkTooltip('Link copied!');
    setTimeout(() => setHashLinkTooltip('Copy WebPart Link'), 2000);
  }

  return (
    <Stack horizontal>
      {props.settings.enableBreadcrumb &&
        <Stack.Item grow>
          <Breadcrumb styles={{ root: { margin: 0 } }} items={props.breadcrumb} />
        </Stack.Item>}
      {props.settings.enableCopyHashLink &&
        <TooltipHost content={hashLinkTooltip}>
          <IconButton iconProps={{ iconName: 'PageLink' }} title='Copy WebPart Link' onClick={onCopyHashLink} />
        </TooltipHost>}
      {props.settings.enableSidebar && (
        <TooltipHost content={props.isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
          <IconButton 
            iconProps={{ iconName: props.isSidebarOpen ? 'ClosePane' : 'OpenPane' }} 
            onClick={props.onToggleSidebar} 
          />
        </TooltipHost>
      )}      {props.settings.enableFullscreen && (
        <TooltipHost content={props.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
          <IconButton
            iconProps={{ iconName: props.isFullscreen ? 'ChromeRestore' : 'ChromeFullScreen' }}
            onClick={props.onToggleFullscreen}
          />
        </TooltipHost>
      )}
    </Stack>
  )
}
