import { IDiagramInfo } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';
import { ISelectionViewOptions } from 'svgpublish/dist/interfaces/ISelectionViewOptions';

function assignIfDefined(target: any, source: any, key: string) {
  if (typeof source[key] !== 'undefined') {
    target[key] = source[key];
  }
}

export function mergeProps(target: Partial<IDiagramInfo>, p: ISvgPublishComponentProps) {

  const keysToAssign: (keyof IDiagramInfo)[] = [
    'enableZoom', 
    'enablePan', 
    'enableZoomShift', 
    'enableZoomCtrl', 
    'enableFollowHyperlinks',
    'enableSelection', 
    'enableHover', 
    'twoFingersTouch', 
    'openHyperlinksInNewWindow',
    'tooltipTrigger', 'tooltipDelay', 'tooltipDelayShow', 'tooltipDelayHide',
    'tooltipPlacement', 'tooltipUseMousePosition', 'tooltipInteractive', 'tooltipTheme',
  ];

  keysToAssign.forEach(key => assignIfDefined(target, p, key));

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
}
