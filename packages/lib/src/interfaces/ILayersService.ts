//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IBasicService } from './IBasicService';
import { ILayerInfo } from './ILayerInfo';

export interface ILayersService extends IBasicService {
  isLayerVisible(layerName: string): boolean;
  setLayerVisible(layerName: string, visible: boolean): void;
  showAllLayers(): void;
  hideAllLayers(): void;
  getLayers(): ILayerInfo[];
}
