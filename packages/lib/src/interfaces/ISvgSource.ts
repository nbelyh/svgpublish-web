import { IDiagramInfo } from './IDiagramInfo';

export interface ISvgSource {
  svgXml: string;
  viewBox: string;
  diagramInfo: IDiagramInfo;
}
