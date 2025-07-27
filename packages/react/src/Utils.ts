import { IDiagramInfo } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';
import { ISelectionViewOptions } from 'svgpublish/dist/interfaces/ISelectionViewOptions';
import { ILayerViewOptions } from 'svgpublish/dist/interfaces/ILayerViewOptions';

function assignIfDefined(target: any, source: any, key: string) {
  if (typeof source[key] !== 'undefined') {
    target[key] = source[key];
  }
}

const KEYS_TO_ASSIGN: (keyof IDiagramInfo)[] = [
  'enableZoom',
  'enablePan',
  'enableZoomShift',
  'enableZoomCtrl',
  'enableFollowHyperlinks',
  'enableSelection',
  'enableHover',
  'twoFingersTouch',
  'openHyperlinksInNewWindow',
  'tooltipTrigger', 'tooltipDelay', 'tooltipDelayShow', 'tooltipDelayHide', 'tooltipMarkdown', 'enableTooltipMarkdown',
  'tooltipPlacement', 'tooltipUseMousePosition', 'tooltipInteractive', 'tooltipTheme',
  'enableSidebar', 'sidebarType', 'showSidebarOnSelection',
  'enableSidebarTitle', 'enableSidebarMarkdown', 'sidebarMarkdown', 'sidebarDefaultWidth',
];

export function mergeProps(target: Partial<IDiagramInfo>, p: ISvgPublishComponentProps) {

  KEYS_TO_ASSIGN.forEach(key => assignIfDefined(target, p, key));

  if (!target.selectionView) {
    target.selectionView = {};
  }

  const selectionViewKeys: (keyof ISelectionViewOptions)[] = [
    'selectionMode', 'selectionColor', 'hoverColor', 'hyperlinkColor', 'enableBoxSelection',
    'enableBlur', 'blur', 'dilate', 'enableDilate', 'enableConnDilate', 'connDilate',
    'nextShapeColor', 'enableNextShapeColor', 'prevShapeColor', 'enablePrevShapeColor',
    'nextConnColor', 'enableNextConnColor', 'prevConnColor', 'enablePrevConnColor'
  ];

  selectionViewKeys.forEach(key => assignIfDefined(target.selectionView, p, key));

  if (!target.layerView) {
    target.layerView = {};
  }

  const layerViewKeys: (keyof ILayerViewOptions)[] = [
    'enableLayerLookup', 'enableLayerSort', 'enableLayerShowAll'
  ];

  layerViewKeys.forEach(key => assignIfDefined(target.layerView, p, key));
}
