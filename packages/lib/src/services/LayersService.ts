//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";
import { ILayerInfo } from "../interfaces/ILayerInfo";
import { BasicService } from './BasicService';
import { ILayersService } from '../interfaces/ILayersService';

export class LayersService extends BasicService implements ILayersService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public reset() {
    super.unsubscribe();
    // Initialize layers if needed
  }

  public isLayerVisible(layerName: string): boolean {
    const layer = this.getLayerByName(layerName);
    return layer ? layer.Visible : false;
  }

  public setLayerVisible(layerName: string, visible: boolean): void {
    const layer = this.getLayerByName(layerName);
    if (layer) {
      layer.Visible = visible;
      this.updateShapes();
    }
  }

  public showAllLayers(): void {
    const layers = this.getLayers();
    layers.forEach(layer => {
      layer.Visible = true;
    });
    this.updateShapes();
  }

  public hideAllLayers(): void {
    const layers = this.getLayers();
    layers.forEach(layer => {
      layer.Visible = false;
    });
    this.updateShapes();
  }

  public getLayers(): ILayerInfo[] {
    return this.context.diagram.layers || [];
  }

  public destroy(): void {
    super.unsubscribe();
  }

  private getLayerByName(layerName: string): ILayerInfo | undefined {
    const layers = this.getLayers();
    return layers.find(layer => layer.Name === layerName);
  }

  private updateShapes(): void {
    const diagram = this.context.diagram;
    const layers = this.getLayers();

    if (!diagram.shapes || !layers.length) return;

    Object.keys(diagram.shapes).forEach(shapeId => {
      const shape = diagram.shapes[shapeId];
      if (!shape.Layers || !shape.Layers.length) return;

      // Shape is visible if any of its layers are visible
      const isVisible = layers.some(layer =>
        layer.Visible && shape.Layers.indexOf(layer.Index) >= 0
      );

      // Update the DOM element visibility
      const element = document.getElementById(shapeId);
      if (element) {
        element.style.display = isVisible ? '' : 'none';
      }
    });
  }
}
