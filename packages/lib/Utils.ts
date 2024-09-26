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
    }
  };
  return result;
}
