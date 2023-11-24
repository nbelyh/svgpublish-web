import * as React from 'react';
import { SvgPublishContext, LinkClickedEvent } from 'svgpublish';
import { IDiagramInfo } from 'svgpublish/dist/interfaces/IDiagramInfo';

export interface ISvgPublishComponentProps {
  url: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;

  enableZoom?: boolean;
  enablePan?: boolean;
  enableZoomShift?: boolean;
  enableZoomCtrl?: boolean;

  enableLinks?: boolean;

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

  const onLinkClicked = (evt: LinkClickedEvent) => {
    evt.preventDefault();
    console.log('Link clicked', evt);
  };

  React.useEffect(() => {

    if (props.url) {
      getContent(props.url).then(content => {

        const init: Partial<IDiagramInfo> = {
          enableZoom: props.enableZoom,
          enablePan: props.enablePan,
          enableZoomShift: props.enableZoomShift,
          enableZoomCtrl: props.enableZoomCtrl,
      
          enableLinks: props.enableLinks,
          enableSelection: props.enableSelection,
          enableHover: props.enableHover,
          selectionView: {
            mode: props.selectionMode,
            selectColor: props.selectColor,
            hoverColor: props.hoverColor,
            hyperlinkColor: props.hyperlinkColor,
            enableBoxSelection: props.enableBoxSelection,
            enableBlur: props.enableBlur,
            blur: props.blur,
            dilate: props.dilate,
            enableDilate: props.enableDilate,
          }
        };

        contextRef.current = new SvgPublishContext(containerRef.current!, content, init);
        if (contextRef.current?.services?.selection && props.selectedShapeId) {
          contextRef.current.services.selection.setSelection(props.selectedShapeId);
        }
        contextRef.current.events.addEventListener('linkClicked', onLinkClicked);
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
    contextRef.current?.enableService('links', !!props.enableLinks)
  }, [props.enableLinks]);

  React.useEffect(() => {
    contextRef.current?.services?.view?.reset()
  }, [props.width, props.height]);

  React.useEffect(() => {
    if (contextRef.current?.diagram) {
      
      contextRef.current.diagram = {
        ...contextRef.current.diagram,
        enableSelection: !!props.enableSelection,
        enableHover: !!props.enableHover,
      };

      contextRef.current.diagram.selectionView = {
        ...contextRef.current.diagram.selectionView,
        mode: props.selectionMode,
        selectColor: props.selectColor,
        hoverColor: props.hoverColor,
        hyperlinkColor: props.hyperlinkColor,
        enableBoxSelection: props.enableBoxSelection,
        enableBlur: props.enableBlur,
        blur: props.blur,
        dilate: props.dilate,
        enableDilate: props.enableDilate,
      };
    }
    if (contextRef.current?.services?.selection) {
      contextRef.current?.services?.selection?.reset();
      if (!props.enableSelection) {
        contextRef.current?.enableService('selection', false);
      }
    } else {
      if (props.enableSelection) {
        contextRef.current?.enableService('selection', true);
      }
    }

    if (contextRef.current?.services?.hover) {
      contextRef.current?.services?.hover?.reset();
      if (!props.enableHover) {
        contextRef.current?.enableService('hover', false);
      }
    } else {
      if (props.enableHover) {
        contextRef.current?.enableService('hover', true);
      }
    }
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
    height: props.height ?? '100%'
  };

  return (
    <div style={style} ref={containerRef} />
  );
}
