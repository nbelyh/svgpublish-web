import { IDiagramSettings } from 'svgpublish';
import { ISvgSource } from 'svgpublish';
import {
  LinkClickedEvent,
  SelectionChangedEvent,
  ViewChangedEvent,
} from 'svgpublish';

export interface ISvgPublishComponentProps extends IDiagramSettings {
  url: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  selectedShapeId?: string;

  onError?: (err: Error) => void;
  onGetContent?: (url: string) => Promise<ISvgSource>;

  onLinkClicked?: (evt: LinkClickedEvent) => void | null;
  onSelectionChanged?: (evt: SelectionChangedEvent) => void;
  onViewChanged?: (evt: ViewChangedEvent) => void;
}
