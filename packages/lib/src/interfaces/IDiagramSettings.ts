import { DiagramSidebarType, DiagramInfoTooltipTrigger, DiagramInfoTooltipPlacement, DiagramInfoTooltipTheme, DiagramInfoSelectionMode } from '../constants';

export interface IDiagramSettings {

  enableLayers?: boolean;
  twoFingersTouch?: boolean;

  // enableAutoFrameHeight?: boolean;
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

  // enableD3: boolean;
  // skipMinification: boolean;
  // enableMustache: boolean;
  // enableMarked: boolean;
  enableFollowHyperlinks?: boolean;
  openHyperlinksInNewWindow?: boolean;
  rewriteVsdxHyperlinks?: boolean;
  rewriteOfficeHyperlinks?: boolean;

  // keepRelativeLinks: boolean;
  // customTemplatePath: boolean;
  // enableSearch: boolean;
  // enableMultiPageSearch: boolean;
  // enablePopovers: boolean;
  // enablePopoverMarkdown: boolean;
  // popoverMarkdown: string;
  // enableContentMarkdown: boolean;
  // contentMarkdown: string;
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

  // sidebarDefaultWidth: number;
  // popoverTriggerOption: string;
  // popoverTimeout: number;
  // popoverLocationOption: string;
  // popoverUseMousePosition: boolean;
  // popoverOutsideClick: boolean;
  // popoverKeepOnHover: boolean;
  // enableContainerTip: boolean;
  // enablePropertySearch?: boolean;
  // enablePropertySearchFilter?: boolean;
  enableHover?: boolean;

  enablePan?: boolean;
  enableZoom?: boolean;

  enableFeedback?: boolean;
  enableHeader?: boolean;
  enableBreadcrumb?: boolean;
  enableCopyHashLink?: boolean;
  feedbackButtonText?: string;
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

  selectedProps?: string[];
}
