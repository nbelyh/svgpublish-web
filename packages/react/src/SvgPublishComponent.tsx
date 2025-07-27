import * as React from 'react';
import { SvgPublishContext, LinkClickedEvent, SelectionChangedEvent, ViewChangedEvent, IServices, IDiagramInfo, ILoadEventData, LoadEvent } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';
import { mergeProps } from './Utils';
import useVisible from './useVisible';

export function SvgPublishComponent(props: ISvgPublishComponentProps) {

  const containerRef = React.useRef(null);
  const [context, setContext] = React.useState<SvgPublishContext | null>(null);

  React.useEffect(() => {
    if (context && props.onLinkClicked) {
      const onLinkClicked = (evt: Event) => props.onLinkClicked?.(evt as LinkClickedEvent);
      context.events.addEventListener('svgpublish_LinkClicked', onLinkClicked);
      return () => context.events.removeEventListener('svgpublish_LinkClicked', onLinkClicked);
    }
  }, [context, props.onLinkClicked]);

  React.useEffect(() => {
    if (context && props.onSelectionChanged) {
      const onSelectionChanged = (evt: Event) => props.onSelectionChanged?.(evt as SelectionChangedEvent);
      context.events.addEventListener('svgpublish_SelectionChanged', onSelectionChanged);
      return () => context.events.removeEventListener('svgpublish_SelectionChanged', onSelectionChanged);
    }
  }, [context, props.onSelectionChanged]);

  React.useEffect(() => {
    if (context && props.onViewChanged) {
      const onViewChanged = (evt: Event) => props.onViewChanged?.(evt as ViewChangedEvent);
      context.events.addEventListener('svgpublish_ViewChanged', onViewChanged);
      return () => context.events.removeEventListener('svgpublish_ViewChanged', onViewChanged);
    }
  }, [context, props.onViewChanged]);

  const isVisible = useVisible(containerRef);

  const urlRef = React.useRef(props.url);

  React.useEffect(() => {

    const initialize = isVisible && (!context || props.url !== urlRef.current);
    if (initialize && props.url) {
      urlRef.current = props.url;
      if (containerRef.current) {

        const init: Partial<IDiagramInfo> = {};
        mergeProps(init, props);

        const newContext = new SvgPublishContext(containerRef.current, props.onGetContent);
        newContext.events.addEventListener('svgpublish_Load', (evt: LoadEvent) => props.onLoad?.(evt as LoadEvent));
        newContext.init(props.url, init).then(() => {
          setContext(newContext);
          if (newContext?.services?.selection && props.selectedShapeId) {
            newContext.services.selection.setSelection(props.selectedShapeId);
          }
        }).catch(err => {
          if (props.onError) {
            props.onError(err);
          } else {
            console.error(err);
          }
        });
      }
    }

    return () => {
      if (initialize && context) {
        context.destroy();
        setContext(null);
      }
    };

  }, [props.url, isVisible]);

  const enableService = (name: keyof IServices, enable?: boolean) => {
    if (context) {
      const service = context.services?.[name];
      if (service) {
        service.reset();
        if (!enable) {
          context.enableService(name, false);
        }
      } else {
        if (enable) {
          context.enableService(name, true);
        }
      }
    }
  }

  React.useEffect(() => {
    if (context?.diagram) {
      context.diagram.enablePan = !!props.enablePan;
    }
  }, [context, props.enablePan]);

  React.useEffect(() => {
    if (context?.diagram) {
      context.diagram.enableZoom = !!props.enableZoom;
    }
  }, [context, props.enableZoom]);

  React.useEffect(() => {
    context?.services?.view?.reset()
  }, [context, props.width, props.height, isVisible]);

  React.useEffect(() => {
    if (context?.diagram) {
      mergeProps(context.diagram, props);
    }
    enableService('selection', props.enableSelection);
    enableService('hover', props.enableHover);
    enableService('links', props.enableFollowHyperlinks);
    enableService('tooltip', props.enableTooltips);
  }, [
    context,
    props.enableSelection,
    props.enableHover,
    props.enableBlur,
    props.blur,
    props.enableDilate,
    props.dilate,
    props.selectionMode,
    props.selectionColor,
    props.hoverColor,
    props.hyperlinkColor,
    props.enableBoxSelection,
    props.openHyperlinksInNewWindow,
    props.twoFingersTouch,
    props.enableFollowHyperlinks,
    props.enableZoomShift,
    props.enableZoomCtrl,
    props.nextShapeColor,
    props.enableNextConnColor,
    props.prevShapeColor,
    props.enablePrevShapeColor,
    props.nextConnColor,
    props.enableNextShapeColor,
    props.prevConnColor,
    props.enablePrevConnColor,
    props.enableConnDilate,
    props.connDilate,

    props.enableTooltips,
    props.tooltipTrigger,
    props.tooltipDelay,
    props.tooltipDelayShow,
    props.tooltipDelayHide,
    props.tooltipPlacement,
    props.tooltipUseMousePosition,
    props.tooltipInteractive,
    props.enableTooltipMarkdown,
    props.tooltipMarkdown,
    props.tooltipTheme,
  ]);

  React.useEffect(() => {
    if (context?.services?.selection) {
      if (props.selectedShapeId) {
        context.services.selection.setSelection(props.selectedShapeId);
      } else {
        context.services.selection.clearSelection();
      }
    }
  }, [context, props.selectedShapeId]);

  const style: React.CSSProperties = {
    ...props.style,
    width: (typeof props.width === 'number' || props.width) ? props.width : '100%',
    height: (typeof props.height === 'number' || props.height) ? props.height : '100%',
    overflow: 'hidden',
  };

  return (
    <div style={style} ref={containerRef} />
  );
}
