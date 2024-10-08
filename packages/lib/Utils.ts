import { IDiagramInfo } from 'svgpublish';
import { ISvgPublishComponentProps } from './ISvgPublishComponentProps';

export function mergeProps(src: IDiagramInfo, p: ISvgPublishComponentProps) {
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
      enableConnDilate: p.enableConnDilate,
      connDilate: p.connDilate,
      nextShapeColor: p.nextShapeColor,
      enableNextShapeColor: p.enableNextShapeColor,
      prevShapeColor: p.prevShapeColor,
      enablePrevShapeColor: p.enablePrevShapeColor,
      nextConnColor: p.nextConnColor,
      enableNextConnColor: p.enableNextConnColor,
      prevConnColor: p.prevConnColor,
      enablePrevConnColor: p.enablePrevConnColor,
    }
  };
  return result;
}
