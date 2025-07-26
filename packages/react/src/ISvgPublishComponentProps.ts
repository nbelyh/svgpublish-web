import { DiagramInfoSelectionMode, DiagramInfoTooltipPlacement, DiagramInfoTooltipTheme, DiagramInfoTooltipTrigger, LinkClickedEvent, SelectionChangedEvent, ViewChangedEvent } from 'svgpublish';

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
  selectionMode?: DiagramInfoSelectionMode;
  selectionColor?: string;
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

  enableTooltips?: boolean;
  tooltipTrigger?: DiagramInfoTooltipTrigger;
  tooltipDelay?: boolean;
  tooltipDelayShow?: number;
  tooltipDelayHide?: number;
  tooltipPlacement?: DiagramInfoTooltipPlacement;
  tooltipUseMousePosition?: boolean;
  tooltipInteractive?: boolean;

  enableTooltipMarkdown?: boolean;
  tooltipMarkdown?: string;
  tooltipTheme?: DiagramInfoTooltipTheme;

  enableSidebar?: boolean;
  rightSidebar?: boolean;
  showSidebarOnSelection?: boolean;
  enableSidebarTitle?: boolean;
  enableSidebarMarkdown?: boolean;
  sidebarMarkdown?: string;
  sidebarDefaultWidth?: string;

  selectedShapeId?: string;

  onError?: (err: Error) => void;
  onGetContent?: (url: string) => Promise<string>;

  onLinkClicked?: (evt: LinkClickedEvent) => void | null;
  onSelectionChanged?: (evt: SelectionChangedEvent) => void;
  onViewChanged?: (evt: ViewChangedEvent) => void;
}
