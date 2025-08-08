import * as React from 'react'
import { ActionButton, Breadcrumb, IBreadcrumbItem, IconButton, Stack, TooltipHost } from '@fluentui/react'
import { IDiagramSettings } from 'svgpublish'

export const Header = (props: {
  url: string;
  breadcrumb: IBreadcrumbItem[];
  settings: IDiagramSettings;
  onOpenSidebar: () => void;
}) => {

  const pageUrl = React.useMemo(() => {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.delete('svgpublish-url');
    pageUrl.searchParams.append('svgpublish-url', props.url);
    return pageUrl.toString();
  }, [props.url]);

  const feedbackButtonText = props.settings.feedbackButtonText || 'Feedback';
  const feeedbackButtonTarget = '_blank';

  const [hashLinkTooltip, setHashLinkTooltip] = React.useState('Copy WebPart Link');

  const onCopyHashLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setHashLinkTooltip('Link copied!');
    setTimeout(() => setHashLinkTooltip('Copy WebPart Link'), 2000);
  }

  const formattedFeedbackUrl = React.useMemo(() => {
    const feedbackUrl = props.settings.feedbackUrl || '';
    const result = feedbackUrl.replace('{{URL}}', pageUrl);
    return result;
  }, [props.settings.feedbackUrl, pageUrl]);

  return (
    <Stack horizontal>
      {props.settings.enableBreadcrumb &&
        <Stack.Item grow>
          <Breadcrumb styles={{ root: { margin: 0 } }} items={props.breadcrumb} />
        </Stack.Item>}
      {props.settings.enableCopyHashLink && <Stack.Item align='center'>
        <TooltipHost content={hashLinkTooltip}>
          <IconButton iconProps={{ iconName: 'PageLink' }} title='Copy WebPart Link' onClick={onCopyHashLink} />
        </TooltipHost>
      </Stack.Item>}
      {props.settings.enableSidebar && (
        <Stack.Item align='center'>
          <TooltipHost content="Open sidebar">
            <IconButton iconProps={{ iconName: 'OpenPane' }} title='Open Sidebar' onClick={props.onOpenSidebar} />
          </TooltipHost>
        </Stack.Item>
      )}
      {props.settings.enableFeedback && <Stack.Item align='center'>
        <ActionButton target={feeedbackButtonTarget} href={formattedFeedbackUrl}>{feedbackButtonText}</ActionButton>
      </Stack.Item>}
    </Stack>
  )
}
