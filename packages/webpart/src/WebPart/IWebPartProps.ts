import { IDiagramSettings } from 'svgpublish';

export interface IWebPartProps extends IDiagramSettings {
  url: string;
  width: string;
  height: string;
  stretchToPageWidth?: boolean;
  protectedSettings?: string[];
}
