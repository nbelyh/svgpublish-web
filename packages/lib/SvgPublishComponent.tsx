import * as React from 'react';
import { SvgPublishContext, LinkClickedEvent, SelectionChangedEvent, ViewChangedEvent, IServices, IDiagramInfo } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';
import { mergeProps } from './Utils';

export function SvgPublishComponent(props: ISvgPublishComponentProps) {

  const containerRef = React.useRef(null);
  const [context, setContext] = React.useState<SvgPublishContext | null>(null);

  const getContent = React.useCallback(async (url: string) => {
    const response = await fetch(url);
    if (response.ok) {
      const content = await response.text();
      return content;
    } else {
      throw new Error(`Failed to load content from ${url}`);
    }
  }, []);

  React.useEffect(() => {
    if (context && props.onLinkClicked) {
      const onLinkClicked = (evt: Event) => props.onLinkClicked!(evt as LinkClickedEvent);
      context.events.addEventListener('linkClicked', onLinkClicked);
      return () => context.events.removeEventListener('linkClicked', onLinkClicked);
    }
  }, [context, props.onLinkClicked]);

  React.useEffect(() => {
    if (context && props.onSelectionChanged) {
      const onSelectionChanged = (evt: Event) => props.onSelectionChanged!(evt as SelectionChangedEvent);
      context.events.addEventListener('selectionChanged', onSelectionChanged);
      return () => context.events.removeEventListener('selectionChanged', onSelectionChanged);
    }
  }, [context, props.onSelectionChanged]);

  React.useEffect(() => {
    if (context && props.onViewChanged) {
      const onViewChanged = (evt: Event) => props.onViewChanged!(evt as ViewChangedEvent);
      context.events.addEventListener('viewChanged', onViewChanged);
      return () => context.events.removeEventListener('viewChanged', onViewChanged);
    }
  }, [context, props.onViewChanged]);

  React.useEffect(() => {

    if (props.url) {
      getContent(props.url).then(content => {
        if (containerRef.current) {

          const init: Partial<IDiagramInfo> = {};
          mergeProps(init, props);

          const newContext = new SvgPublishContext(containerRef.current, content, init);
          if (newContext?.services?.selection && props.selectedShapeId) {
            newContext.services.selection.setSelection(props.selectedShapeId);
          }
          setContext(newContext);
        }
      }, (err) => {
        if (context) {
          context.destroy();
          setContext(null);
        }
        if (props.onError) {
          props.onError(err);
        } else {
          console.error(err);
        }
      })
    }

    return () => {
      if (context) {
        context.destroy();
        setContext(null);
      }
    };

  }, [props.url]);

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
  }, [context, props.width, props.height]);

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
