
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IShapeInfo } from './IShapeInfo';
import { IPageInfo } from './IPageInfo';
import { ILayerInfo } from './ILayerInfo';
import { IDiagramSettings } from './IDiagramSettings';

export interface IDiagramInfo {

  shapes: { [shapeId: string] : IShapeInfo };
  currentPageShape: IShapeInfo;

  pages: IPageInfo[];
  currentPage: IPageInfo;

  layers: ILayerInfo[];

  searchIndex: { [pageId: string] : { [shapeId: string] : Object } };

  viewBox?: string;
  fileName?: string;

  settings: IDiagramSettings;
}
