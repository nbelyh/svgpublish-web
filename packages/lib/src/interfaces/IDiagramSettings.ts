import { DiagramSidebarType, DiagramInfoTooltipTrigger, DiagramInfoTooltipPlacement, DiagramInfoTooltipTheme, DiagramInfoSelectionMode } from '../constants';

export interface IDiagramSettings {

  enableLayers?: boolean;
  twoFingersTouch?: boolean;

  enablePages?: boolean;
  enablePageLookup?: boolean;
  enablePageSort?: boolean;

  enableZoomShift?: boolean;
  enableZoomCtrl?: boolean;

  enableProps?: boolean;
  enableLinks?: boolean;

  enableSelection?: boolean;

  enableSidebar?: boolean;
  sidebarType?: DiagramSidebarType;
  showSidebarOnSelection?: boolean;
  enableSidebarTitle?: boolean;
  enableSidebarMarkdown?: boolean;
  sidebarMarkdown?: string;
  sidebarDefaultWidth?: string;

  enableFollowHyperlinks?: boolean;
  openHyperlinksInNewWindow?: boolean;
  rewriteVisioHyperlinks?: boolean;
  rewriteOfficeHyperlinks?: boolean;

  // keepRelativeLinks: boolean;
  // customTemplatePath: boolean;
  enableSearch?: boolean;
  // enableMultiPageSearch?: boolean;
  // enablePropertySearch?: boolean;
  enablePropertySearchFilter?: boolean;
  enableContentMarkdown?: boolean;
  contentMarkdown?: string;
  enableTooltips?: boolean;
  enableTooltipMarkdown?: boolean;
  tooltipMarkdown?: string;

  tooltipTrigger?: DiagramInfoTooltipTrigger;
  tooltipDelay?: boolean;
  tooltipDelayShow?: number;
  tooltipDelayHide?: number;
  tooltipPlacement?: DiagramInfoTooltipPlacement;
  tooltipUseMousePosition?: boolean;
  tooltipInteractive?: boolean;
  tooltipTheme?: DiagramInfoTooltipTheme;

  // enableContainerTip: boolean;
  enableHover?: boolean;

  enablePan?: boolean;
  enableZoom?: boolean;

  enableHeader?: boolean;
  enableBreadcrumb?: boolean;
  enableCopyHashLink?: boolean;
  enableFullscreen?: boolean;
  feedbackUrl?: string;

  /// Enable "simple box" selection style
  enableBoxSelection?: boolean;

  /// Size of the dilate
  dilate?: number;

  /// Size of the connection dilate
  connDilate?: number;

  /// Size of blur
  blur?: number;

  /// Enable blur (empty for none)
  enableBlur?: boolean;

  /// Enable dilate (empty for none)
  enableDilate?: boolean;

  /// Enable connection dilate (empty for none)
  enableConnDilate?: boolean;

  /// Mode, "normal" for border only, lighten/darken for full box
  selectionMode?: DiagramInfoSelectionMode;

  /// Shape hover color
  hoverColor?: string;

  /// Hyperlink hover color
  hyperlinkColor?: string;

  /// Shape selection color
  selectionColor?: string;

  /// Enable prev shape highlight
  enablePrevShapeColor?: boolean;

  /// Enable next shape highlight
  enableNextShapeColor?: boolean;

  /// Enable prev conn highlight
  enablePrevConnColor?: boolean;

  /// Enable next conn highlight
  enableNextConnColor?: boolean;

  /// Prev shape highlight color
  prevShapeColor?: string;

  /// Next shape highlight color
  nextShapeColor?: string;

  /// Prev conn highlight color
  prevConnColor?: string;

  /// Next shape highlight color
  nextConnColor?: string;

  /// Allows to search box for the layers block
  enableLayerLookup?: boolean;

  /// Sorts layers alphabetically
  enableLayerSort?: boolean;

  /// Enable show/hide all switch
  enableLayerShowAll?: boolean;

  /// Disable tooltips on touch devices
  suppressMobileTip?: boolean;

  /// properties to show in sidebar, comma separated
  selectedProps?: string;

  savedViewMatrix?: string;
}
