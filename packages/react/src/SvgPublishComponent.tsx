import * as React from 'react';
import { SvgPublishContext, LinkClickedEvent, SelectionChangedEvent, ViewChangedEvent, IServices, ISvgSource, IDiagramSettings } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';
import useVisible from './useVisible';

const ADDITIONAL_PROPERTIES = [
  'url',
  'style',
  'width',
  'height',
  'selectedShapeId',
  'onError',
  'onGetContent',
  'onLinkClicked',
  'onSelectionChanged',
  'onViewChanged',
];

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

  const applyPropertiesTo = (settings: IDiagramSettings) => {
    for (const key in props) {
      if (!ADDITIONAL_PROPERTIES.includes(key)) {
        settings[key] = props[key];
      }
    }
  }

  const onGetContent = async (url: string, defaultResolver: (url: string) => Promise<ISvgSource>) => {
    const result = props.onGetContent
      ? await props.onGetContent(url)
      : await defaultResolver(url);

    if (!result.diagramInfo.settings) {
      result.diagramInfo.settings = {};
    }
    applyPropertiesTo(result.diagramInfo.settings);

    return result;
  }

  React.useEffect(() => {

    const initialize = isVisible && (!context || props.url !== urlRef.current);
    if (initialize && props.url) {
      urlRef.current = props.url;
      if (containerRef.current) {

        const newContext = new SvgPublishContext(containerRef.current);
        newContext.init(props.url, onGetContent).then(() => {
          setContext(newContext);
          if (props.selectedShapeId) {
            newContext.services?.selection?.setSelection(props.selectedShapeId);
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

  React.useEffect(() => {
    context?.services?.view?.reset()
  }, [context, props.width, props.height, isVisible]);

  React.useEffect(() => {
    if (context?.diagram?.settings) {
      applyPropertiesTo(context.diagram.settings);
    }
    context?.configureServices();
  }, [context, JSON.stringify(props)]);

  React.useEffect(() => {
    const selection = context?.services?.selection;
    if (selection) {
      if (props.selectedShapeId) {
        selection.setSelection(props.selectedShapeId);
      } else {
        selection.clearSelection();
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
