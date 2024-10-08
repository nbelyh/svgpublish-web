import { LinkClickedEvent, SelectionChangedEvent, ViewChangedEvent } from 'svgpublish';

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
  enableConnDilate?: boolean;
  dilate?: number;
  connDilate?: number;
  selectionMode?: 'normal' | 'lighten' | 'darken';
  selectColor?: string;
  hoverColor?: string;
  hyperlinkColor?: string;
  enableBoxSelection?: boolean;
  enablePrevShapeColor?: boolean;
  nextShapeColor?: string;
  enableNextShapeColor?: boolean;
  prevShapeColor?: string;
  enablePrevConnColor?: boolean;
  nextConnColor?: string;
  enableNextConnColor?: boolean;
  prevConnColor?: string;

  selectedShapeId?: string;

  onError?: (err: Error) => void;

  onLinkClicked?: (evt: LinkClickedEvent) => void | null;
  onSelectionChanged?: (evt: SelectionChangedEvent) => void;
  onViewChanged?: (evt: ViewChangedEvent) => void;
}
