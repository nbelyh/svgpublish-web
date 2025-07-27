//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ILayerInfo } from './ILayerInfo';

export interface ILayersService {
  reset(): void;
  isLayerVisible(layerName: string): boolean;
  setLayerVisible(layerName: string, visible: boolean): void;
  showAllLayers(): void;
  hideAllLayers(): void;
  getLayers(): ILayerInfo[];
  destroy(): void;
}
