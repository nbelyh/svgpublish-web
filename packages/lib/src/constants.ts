import { IDiagramSettings } from './interfaces';

export class DefaultColors {
  public static selectionColor = 'rgba(255, 255, 0, 0.8)';
  public static hoverColor = 'rgba(255, 255, 0, 0.3)';
  public static hyperlinkColor = 'rgba(0, 0, 255, 0.3)';

  public static prevShapeColor = `rgba(160, 255, 255, 0.8)`;
  public static nextShapeColor = `rgba(255, 160, 255, 0.8)`;
  public static prevConnColor = `rgba(255, 0, 0, 1.0)`;
  public static nextConnColor = `rgba(255, 0, 0, 1.0)`;
}

export type DiagramInfoSelectionMode =
  'normal' |
  'lighten' |
  'darken';

export type DiagramInfoTooltipTrigger =
  'mouseenter' |
  'click' |
  'mouseenter click';

export type DiagramInfoTooltipPlacement =
  'auto' | 'auto-start' | 'auto-end' |
  'top' | 'top-start' | 'top-end' |
  'right' | 'right-start' | 'right-end' |
  'bottom' | 'bottom-start' | 'bottom-end' |
  'left' | 'left-start' | 'left-end';

export type DiagramInfoTooltipTheme =
  'dark' |
  'light' |
  'light-border' |
  'translucent';


export type DiagramSidebarType =
  'smallFixedFar' |
  'smallFixedNear' |
  'medium' |
  'large' |
  'largeFixed' |
  'extraLarge' |
  'custom' |
  'customNear'

export const DefaultDiagramSettings: IDiagramSettings = {
  enablePan: true,
  enableZoom: true,
  enableZoomCtrl: false,
  enableZoomShift: false,
  twoFingersTouch: true,
  enableLinks: true,
  enableHeader: true,
  enableBreadcrumb: true,
  enableCopyHashLink: false,
  enableFullscreen: false,
  rewriteOfficeHyperlinks: true,
  rewriteVisioHyperlinks: false,
  feedbackUrl: '',
  enableSelection: true,
  enableBoxSelection: false,
  selectionMode: 'normal',
  enableFollowHyperlinks: true,
  enableHover: true,
  openHyperlinksInNewWindow: true,
  hyperlinkColor: DefaultColors.hyperlinkColor,
  selectionColor: DefaultColors.selectionColor,
  hoverColor: DefaultColors.hoverColor,
  dilate: 2,
  enableDilate: true,
  blur: 2,
  enableBlur: true,
  connDilate: 1,
  enableConnDilate: false,
  enablePrevShapeColor: false,
  enableNextShapeColor: false,
  enablePrevConnColor: false,
  enableNextConnColor: false,
  prevShapeColor: DefaultColors.prevShapeColor,
  nextShapeColor: DefaultColors.nextShapeColor,
  prevConnColor: DefaultColors.prevConnColor,
  nextConnColor: DefaultColors.nextConnColor,
  enableTooltips: false,
  tooltipTrigger: 'mouseenter',
  tooltipDelay: false,
  tooltipDelayShow: 500,
  tooltipDelayHide: 0,
  tooltipPlacement: 'auto',
  tooltipUseMousePosition: false,
  tooltipInteractive: false,
  tooltipTheme: 'dark',
  enableTooltipMarkdown: false,
  tooltipMarkdown: '',
  suppressMobileTip: true,
  enableContentMarkdown: false,
  contentMarkdown: '',
  enableSidebar: true,
  sidebarType: 'medium',
  showSidebarOnSelection: false,
  enableSidebarTitle: true,
  enableSidebarMarkdown: false,
  sidebarMarkdown: '',
  sidebarDefaultWidth: '300px',
  enableProps: true,
  enableLayers: true,
  enableLayerLookup: false,
  enableLayerSort: false,
  enableLayerShowAll: true,
}
