import { IDiagramSettings } from 'svgpublish';

export interface IWebPartProps extends IDiagramSettings {
  url: string;
  width: string;
  height: string;
  protectedSettings?: string[];
}
