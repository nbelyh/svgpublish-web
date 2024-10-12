import { IDiagramInfo } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';

export function mergeProps(target: Partial<IDiagramInfo>, p: ISvgPublishComponentProps) {
  if (typeof p.enableZoom !== 'undefined') {
    target.enableZoom = p.enableZoom;
  }
  if (typeof p.enablePan !== 'undefined') {
    target.enablePan = p.enablePan;
  }
  if (typeof p.enableZoomShift !== 'undefined') {
    target.enableZoomShift = p.enableZoomShift;
  }
  if (typeof p.enableZoomCtrl !== 'undefined') {
    target.enableZoomCtrl = p.enableZoomCtrl;
  }
  if (typeof p.enableFollowHyperlinks !== 'undefined') {
    target.enableFollowHyperlinks = p.enableFollowHyperlinks;
  }
  if (typeof p.enableSelection !== 'undefined') {
    target.enableSelection = p.enableSelection;
  }
  if (typeof p.enableHover !== 'undefined') {
    target.enableHover = p.enableHover;
  }
  if (typeof p.twoFingersTouch !== 'undefined') {
    target.twoFingersTouch = p.twoFingersTouch;
  }
  if (typeof p.openHyperlinksInNewWindow !== 'undefined') {
    target.openHyperlinksInNewWindow = p.openHyperlinksInNewWindow;
  }

  if (!target.selectionView) {
    target.selectionView = {};
  }
  if (typeof p.selectionMode !== 'undefined') {
    target.selectionView.mode = p.selectionMode;
  }
  if (typeof p.selectColor !== 'undefined') {
    target.selectionView.selectColor = p.selectColor;
  }
  if (typeof p.hoverColor !== 'undefined') {
    target.selectionView.hoverColor = p.hoverColor;
  }
  if (typeof p.hyperlinkColor !== 'undefined') {
    target.selectionView.hyperlinkColor = p.hyperlinkColor;
  }
  if (typeof p.enableBoxSelection !== 'undefined') {
    target.selectionView.enableBoxSelection = p.enableBoxSelection;
  }
  if (typeof p.enableBlur !== 'undefined') {
    target.selectionView.enableBlur = p.enableBlur;
  }
  if (typeof p.blur !== 'undefined') {
    target.selectionView.blur = p.blur;
  }
  if (typeof p.dilate !== 'undefined') {
    target.selectionView.dilate = p.dilate;
  }
  if (typeof p.enableDilate !== 'undefined') {
    target.selectionView.enableDilate = p.enableDilate;
  }
  if (typeof p.blur !== 'undefined') {
    target.selectionView.blur = p.blur;
  }
  if (typeof p.enableBlur !== 'undefined') {
    target.selectionView.enableBlur = p.enableBlur;
  }
  if (typeof p.enableConnDilate !== 'undefined') {
    target.selectionView.enableConnDilate = p.enableConnDilate;
  }
  if (typeof p.connDilate !== 'undefined') {
    target.selectionView.connDilate = p.connDilate;
  }
  if (typeof p.nextShapeColor !== 'undefined') {
    target.selectionView.nextShapeColor = p.nextShapeColor;
  }
  if (typeof p.enableNextShapeColor !== 'undefined') {
    target.selectionView.enableNextShapeColor = p.enableNextShapeColor;
  }
  if (typeof p.prevShapeColor !== 'undefined') {
    target.selectionView.prevShapeColor = p.prevShapeColor;
  }
  if (typeof p.enablePrevShapeColor !== 'undefined') {
    target.selectionView.enablePrevShapeColor = p.enablePrevShapeColor;
  }
  if (typeof p.nextConnColor !== 'undefined') {
    target.selectionView.nextConnColor = p.nextConnColor;
  }
  if (typeof p.enableNextConnColor !== 'undefined') {
    target.selectionView.enableNextConnColor = p.enableNextConnColor;
  }
  if (typeof p.prevConnColor !== 'undefined') {
    target.selectionView.prevConnColor = p.prevConnColor;
  }
  if (typeof p.enablePrevConnColor !== 'undefined') {
    target.selectionView.enablePrevConnColor = p.enablePrevConnColor;
  }

  if (typeof p.tooltipTrigger !== 'undefined') {
    target.tooltipTrigger = p.tooltipTrigger;
  }
  if (typeof p.tooltipTimeout !== 'undefined') {
    target.tooltipDelay = p.tooltipTimeout;
  }
  if (typeof p.tooltipTimeoutShow !== 'undefined') {
    target.tooltipDelayShow = p.tooltipTimeoutShow;
  }
  if (typeof p.tooltipTimeoutHide !== 'undefined') {
    target.tooltipDelayHide = p.tooltipTimeoutHide;
  }
  if (typeof p.tooltipPlacement !== 'undefined') {
    target.tooltipPlacement = p.tooltipPlacement;
  }
  if (typeof p.tooltipUseMousePosition !== 'undefined') {
    target.tooltipUseMousePosition = p.tooltipUseMousePosition;
  }
  if (typeof p.tooltipOutsideClick !== 'undefined') {
    target.tooltipOutsideClick = p.tooltipOutsideClick;
  }
  if (typeof p.tooltipInteractive !== 'undefined') {
    target.tooltipInteractive = p.tooltipInteractive;
  }
}
