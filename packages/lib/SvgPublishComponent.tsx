import * as React from 'react';
import { SvgPublishContext /*, LinkClickedEvent*/ } from 'svgpublish';
import { IDiagramInfo } from 'svgpublish/dist/interfaces/IDiagramInfo';
import { IServices } from 'svgpublish/dist/interfaces/IServices';

export interface ISvgPublishComponentProps {
  url: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;

  enableZoom?: boolean;
  enablePan?: boolean;
  enableZoomShift?: boolean;
  enableZoomCtrl?: boolean;
  twoFingersTouch?: boolean;

  enableLinks?: boolean;
  enableFollowHyperlinks?: boolean;
  openHyperlinksInNewWindow?: boolean;

  enableSelection?: boolean;
  enableHover?: boolean;

  enableBlur?: boolean;
  blur?: number;
  enableDilate?: boolean;
  dilate?: number;
  selectionMode?: 'normal' | 'lighten' | 'darken';
  selectColor?: string;
  hoverColor?: string;
  hyperlinkColor?: string;
  enableBoxSelection?: boolean;

  selectedShapeId?: string;
}

export function SvgPublishComponent(props: ISvgPublishComponentProps) {

  const containerRef = React.useRef(null);
  const contextRef = React.useRef<SvgPublishContext | null>(null);

  const getContent = React.useCallback(async (url: string) => {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  }, []);

  const onLinkClicked = (/*evt: LinkClickedEvent*/) => {
    // evt.preventDefault();
    // console.log('Link clicked', evt);
  };

  const mergeProps = React.useCallback((src: IDiagramInfo, p: ISvgPublishComponentProps) => {
    const result: IDiagramInfo = {
      ...src,
      enableZoom: p.enableZoom,
      enablePan: p.enablePan,
      enableZoomShift: p.enableZoomShift,
      enableZoomCtrl: p.enableZoomCtrl,

      enableFollowHyperlinks: p.enableFollowHyperlinks,

      enableSelection: p.enableSelection,
      enableHover: p.enableHover,
      twoFingersTouch: p.twoFingersTouch,
      openHyperlinksInNewWindow: p.openHyperlinksInNewWindow,
      selectionView: {
        ...src.selectionView,
        mode: p.selectionMode,
        selectColor: p.selectColor,
        hoverColor: p.hoverColor,
        hyperlinkColor: p.hyperlinkColor,
        enableBoxSelection: p.enableBoxSelection,
        enableBlur: p.enableBlur,
        blur: p.blur,
        dilate: p.dilate,
        enableDilate: p.enableDilate,
      }
    };
    return result;
  }, []);

  React.useEffect(() => {

    if (props.url) {
      getContent(props.url).then(content => {
        if (containerRef.current) {

          const init = mergeProps({} as any, props);

          contextRef.current = new SvgPublishContext(containerRef.current, content, init);
          if (contextRef.current?.services?.selection && props.selectedShapeId) {
            contextRef.current.services.selection.setSelection(props.selectedShapeId);
          }
          contextRef.current.events.addEventListener('linkClicked', onLinkClicked);
        }
      }, err => {
        console.error(err);
      })
    }

    return () => {
      if (contextRef.current) {
        contextRef.current.events.removeEventListener('linkClicked', onLinkClicked);
        contextRef.current.destroy();
        contextRef.current = null;
      }
    };

  }, [props.url]);

  const enableService = (name: keyof IServices, enable?: boolean) => {
    const context = contextRef.current;
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
    if (contextRef.current?.diagram) {
      contextRef.current.diagram.enablePan = !!props.enablePan;
    }
  }, [props.enablePan]);

  React.useEffect(() => {
    if (contextRef.current?.diagram) {
      contextRef.current.diagram.enableZoom = !!props.enableZoom;
    }
  }, [props.enableZoom]);

  React.useEffect(() => {
    contextRef.current?.services?.view?.reset()
  }, [props.width, props.height]);

  React.useEffect(() => {
    if (contextRef.current?.diagram) {
      contextRef.current.diagram = mergeProps(contextRef.current.diagram, props);
    }
    enableService('selection', props.enableSelection);
    enableService('hover', props.enableHover);
    enableService('links', props.enableFollowHyperlinks);
  }, [
    props.enableSelection,
    props.enableHover,
    props.enableBlur,
    props.blur,
    props.enableDilate,
    props.dilate,
    props.selectionMode,
    props.selectColor,
    props.hoverColor,
    props.hyperlinkColor,
    props.enableBoxSelection,
    props.openHyperlinksInNewWindow,
    props.twoFingersTouch,
    props.enableFollowHyperlinks,
    props.enableZoomShift,
    props.enableZoomCtrl,
  ]);

  React.useEffect(() => {
    if (contextRef.current?.services?.selection) {
      if (props.selectedShapeId)
        contextRef.current.services.selection.setSelection(props.selectedShapeId);
      else
        contextRef.current.services.selection.clearSelection();
    }
  }, [props.selectedShapeId]);

  const style: React.CSSProperties = {
    ...props.style,
    width: props.width ?? '100%',
    height: props.height ?? '100%',
    overflow: 'hidden',
  };

  return (
    <div style={style} ref={containerRef} />
  );
}
