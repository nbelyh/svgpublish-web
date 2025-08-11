
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IViewChangedEventData } from '../events';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { Geometry } from './Geometry';
import { BasicService } from './BasicService';
import { IViewService } from '../interfaces/IViewService';
import { Utils } from './Utils';
import { marked } from 'marked';
import Mustache from 'mustache';

export class ViewService extends BasicService implements IViewService {

  private viewPort: SVGGElement = null;
  private viewBox: string;
  private resizeObserver: ResizeObserver = null;
  private lastContainerWidth: number = 0;
  private lastContainerHeight: number = 0;

  private zoomScale = 0.5; // Zoom sensitivity
  private panDelta = 3; // start pan on move

  private state: 'pinch' | 'pan' | 'down' = null;
  private stateOriginSvg: DOMPoint = null;
  private stateOriginClient: { clientX: number, clientY: number } = null;
  private stateTf: DOMMatrix = null;
  private stateDiff: number = null;
  private viewChangedDebounceTimer: number = null;
  private viewChangedDebounceDelay = 80; // ms

  constructor(context: ISvgPublishContext, viewBox: string) {
    super(context);

    this.viewBox = viewBox;
    const rootItems = context.svg.querySelectorAll([
      'svg > g',
      'svg > use',
      'svg > image',
      'svg > switch',
      'svg > path',
      'svg > rect',
      'svg > circle',
      'svg > ellipse',
      'svg > line',
      'svg > polyline',
      'svg > polygon',
      'svg > text',
      'svg > textPath',
      'svg > tspan',
      'svg > tref',
      'svg > foreignObject'
    ].join(','));

    // if this is not a viewport then we need to create one
    if (rootItems.length > 1 || rootItems[0].getAttribute('transform')) {
      this.viewPort = this.wrapSvgContentsInGroup(this.context.svg);
    } else {
      this.viewPort = rootItems[0] as SVGGElement;
    }

    this.reset();

    // Set up container resize observer after reset to avoid it being disconnected
    this.resizeObserver = new ResizeObserver((entries) => {
      this.handleContainerResize();
    });
    this.resizeObserver.observe(this.context.container);
  }

  private wrapSvgContentsInGroup(svgElement: SVGSVGElement) {
    const svgNS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(svgNS, 'g');

    while (svgElement.firstChild) {
      group.appendChild(svgElement.firstChild);
    }

    svgElement.appendChild(group);
    return group;
  }

  private get enableZoom() {
    return Utils.getValueOrDefault(this.context?.diagram?.settings?.enableZoom, true);
  }

  private get enablePan() {
    return Utils.getValueOrDefault(this.context?.diagram?.settings?.enablePan, true);
  }

  private subscribeAll() {
    const container = this.context.container;
    const svg = this.context.svg;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (this.enablePan || this.enableZoom) {
      this.subscribe(container, "mousedown", this.handleMouseDown, { passive: false });
      this.subscribe(container, "mousemove", this.handleMouseMove, { passive: false });
      this.subscribe(container, 'click', this.handleClick, true);

      if (isTouch) {
        this.subscribe(container, "touchstart", this.handleTouchStart, { passive: false });
        this.subscribe(container, "touchmove", this.handleMouseMove, { passive: false });
      }
    }


    if (this.enableZoom) {
      if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) { // Firefox
        this.subscribe(container, 'DOMMouseScroll', this.handleMouseWheel, { passive: false });
      } else { // Chrome/Safari/Opera/IE
        this.subscribe(container, 'mousewheel', this.handleMouseWheel, { passive: false });
      }
    }
  }

  protected unsubscribe() {
    super.unsubscribe();
    // Note: We don't disconnect resizeObserver here because it should persist
    // across reset() calls. It's only disconnected when the service is destroyed.
  }

  public destroy() {
    this.unsubscribe();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  public reset() {

    this.unsubscribe();

    const bbox = this.viewBox.split(' ');

    const width = parseFloat(bbox[2]);
    const height = parseFloat(bbox[3]);

    const { offsetWidth: maxWidth, offsetHeight: maxHeight } = this.context.container;

    let m = this.context.svg.createSVGMatrix();

    const sz = Geometry.fitInBox(width, height, maxWidth, maxHeight);

    if (sz.width < maxWidth)
      m = m.translate((maxWidth - sz.width) / 2, 0);

    if (sz.height < maxHeight)
      m = m.translate(0, (maxHeight - sz.height) / 2, 0);

    m = m.scale(sz.width / width);

    this.setCTM(m, null);

    // Remember current container size for resize handling
    this.lastContainerWidth = maxWidth;
    this.lastContainerHeight = maxHeight;

    this.subscribeAll();
  }

  public handleContainerResize() {
    // Get new container dimensions
    const { offsetWidth: newWidth, offsetHeight: newHeight } = this.context.container;

    // If dimensions haven't actually changed, do nothing
    if (newWidth === this.lastContainerWidth && newHeight === this.lastContainerHeight) {
      return;
    }

    const currentMatrix = this.viewPort.getCTM();
    if (!currentMatrix) {
      this.reset();
      return;
    }

    // Store the old dimensions before we update them
    const oldWidth = this.lastContainerWidth;
    const oldHeight = this.lastContainerHeight;

    // Update stored container dimensions immediately to prevent multiple calls
    this.lastContainerWidth = newWidth;
    this.lastContainerHeight = newHeight;

    // Calculate both ratios
    const widthRatio = newWidth / oldWidth;
    const heightRatio = newHeight / oldHeight;

    // Determine which dimension changed less significantly
    const widthChange = Math.abs(widthRatio - 1);
    const heightChange = Math.abs(heightRatio - 1);

    // Use the ratio of the dimension that changed less (more stable)
    const scaleRatio = widthChange < heightChange ? widthRatio : heightRatio;

    // To preserve the view position, we need to:
    // 1. Find the center point of the current view in diagram coordinates
    // 2. Scale the transformation
    // 3. Adjust translation to keep the same center point

    // Get the center point of the old container in diagram coordinates
    const oldCenterX = oldWidth / 2;
    const oldCenterY = oldHeight / 2;
    const svgPoint = this.context.svg.createSVGPoint();
    svgPoint.x = oldCenterX;
    svgPoint.y = oldCenterY;
    const diagramCenterPoint = svgPoint.matrixTransform(currentMatrix.inverse());

    // Scale the current transformation
    let newMatrix = this.context.svg.createSVGMatrix();
    newMatrix = newMatrix.scale(scaleRatio);
    newMatrix = newMatrix.multiply(currentMatrix);

    // Calculate where the diagram center point is now in the new container
    const newCenterX = newWidth / 2;
    const newCenterY = newHeight / 2;
    const newSvgPoint = this.context.svg.createSVGPoint();
    newSvgPoint.x = diagramCenterPoint.x;
    newSvgPoint.y = diagramCenterPoint.y;
    const currentDiagramCenter = newSvgPoint.matrixTransform(newMatrix);

    // Adjust translation to center the view correctly
    const deltaX = newCenterX - currentDiagramCenter.x;
    const deltaY = newCenterY - currentDiagramCenter.y;

    if (deltaX !== 0 || deltaY !== 0) {
      const adjustmentMatrix = this.context.svg.createSVGMatrix().translate(deltaX, deltaY);
      newMatrix = adjustmentMatrix.multiply(newMatrix);
    }

    this.setCTM(newMatrix, null);
  }

  public setFocusShape(shapeId: string) {
    const p2 = this.getDefaultPoint();
    const p1 = this.getShapePoint(shapeId);

    if (p1 && p2) {
      const m = this.viewPort.getCTM();
      const cp = p1.matrixTransform(m.inverse());
      const sp = p2.matrixTransform(m.inverse());
      this.setCTM(m.translate(sp.x - cp.x, sp.y - cp.y), null);
    }
  }

  private getShapePoint(shapeId: string) {
    const shapeElem = this.context.svg.getElementById(shapeId);
    if (!shapeElem)
      return undefined;

    const rect = shapeElem.getBoundingClientRect();
    const containerRect = this.context.container.getBoundingClientRect();
    const pt = this.context.svg.createSVGPoint();
    pt.x = (rect.left + rect.right) / 2 - containerRect.left;
    pt.y = (rect.top + rect.bottom) / 2 - containerRect.top;
    return pt;
  }

  private getEventClientPoint(evt: MouseEvent | TouchEvent) {

    const touches = evt['touches'] as TouchList;
    if (touches && touches.length === 2) {

      const pt1 = Geometry.makeClientPoint(touches[0].clientX, touches[0].clientY);
      const pt2 = Geometry.makeClientPoint(touches[1].clientX, touches[1].clientY);

      return Geometry.makeClientPoint((pt1.clientX + pt2.clientX) / 2, (pt1.clientY + pt2.clientY) / 2);

    } else if (touches && touches.length === 1) {
      return Geometry.makeClientPoint(touches[0].clientX, touches[0].clientY);
    } else {
      const mouseEvt = evt as MouseEvent;
      return Geometry.makeClientPoint(mouseEvt.clientX, mouseEvt.clientY);
    }
  }

  /*
      Instance an SVGPoint object with given coordinates.
  */
  private getSvgClientPoint(clientPoint) {

    const p = this.context.svg.createSVGPoint();

    const box = this.context.container.getBoundingClientRect();
    p.x = clientPoint.clientX - box.left;
    p.y = clientPoint.clientY - box.top;

    return p;
  }

  /*
      get center zoom point
  */

  private getDefaultPoint() {

    const p = this.context.svg.createSVGPoint();

    const box = this.context.container.getBoundingClientRect();
    p.x = (box.right - box.left) / 2;
    p.y = (box.bottom - box.top) / 2;

    return p;
  }

  /*
      Sets the current transform matrix of an element.
  */

  private setCTM(matrix: DOMMatrix, evt: Event) {

    const s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";

    this.viewPort.setAttribute("transform", s);

    // Debounce event dispatch to avoid spamming listeners during pan/zoom
    this.scheduleViewChanged(evt);
  }

  private scheduleViewChanged(evt: Event) {
    if (this.viewChangedDebounceTimer !== null) {
      clearTimeout(this.viewChangedDebounceTimer);
    }
    this.viewChangedDebounceTimer = window.setTimeout(() => {
      this.viewChangedDebounceTimer = null;
      this.dispatchViewChanged(evt);
    }, this.viewChangedDebounceDelay);
  }

  private dispatchViewChanged(evt: Event) {
    const viewChangedEvent = new CustomEvent<IViewChangedEventData>('svgpublish_ViewChanged', {
      cancelable: false,
      detail: {
        context: this.context,
        triggerEvent: evt
      }
    });
    this.context.events.dispatchEvent(viewChangedEvent);
  }

  /*
      zoom in or out on mouse wheel
  */

  private handleMouseWheel = (evt) => {

    if (!this.enableZoom)
      return;

    if (this.context?.diagram?.settings?.enableZoomCtrl && !evt.ctrlKey)
      return;
    if (this.context?.diagram?.settings?.enableZoomShift && !evt.shiftKey)
      return;

    evt.preventDefault();

    evt.returnValue = false;

    const delta = (evt.wheelDelta)
      ? evt.wheelDelta / 360 // Chrome/Safari
      : evt.detail / -9; // Mozilla

    const z = Math.pow(1 + this.zoomScale, delta);

    this.zoom(z, evt);
  }

  /*
      zoom with given aspect at given (client) point
  */

  public zoom(z: number, evt?: MouseEvent | TouchEvent) {

    const evtPt = evt
      ? this.getSvgClientPoint(this.getEventClientPoint(evt))
      : this.getDefaultPoint();

    const p = evtPt.matrixTransform(this.viewPort.getCTM().inverse());

    // Compute new scale matrix in current mouse position
    const k = this.context.svg.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

    this.setCTM(this.viewPort.getCTM().multiply(k), evt);

    if (!this.stateTf)
      this.stateTf = this.viewPort.getCTM().inverse();

    this.stateTf = this.stateTf.multiply(k.inverse());
  }

  public highlightShape(shapeId: string) {

    const element = document.getElementById(shapeId);
    if (element) {
      element.animate([
        { opacity: 1 },
        { opacity: 0.3 },
        { opacity: 1 },
        { opacity: 0.3 },
        { opacity: 1 }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
    }

    const selection = this.context.services?.selection;
    if (selection) {
      selection.setSelection(shapeId);
    }
  }

  /*
          continue pan (one touch or mouse) or pinch (with two touches)
  */

  private handleMouseMove = (evt: MouseEvent | TouchEvent) => {

    if (!this.state)
      return;

    evt.preventDefault();

    evt.returnValue = false;

    const clientPt = this.getEventClientPoint(evt);

    if (this.state === 'pinch') {

      const touches = evt['touches'] as TouchList;
      if (touches && touches.length === 2) {

        const pt1 = Geometry.makeClientPoint(touches[0].clientX, touches[0].clientY);
        const pt2 = Geometry.makeClientPoint(touches[1].clientX, touches[1].clientY);

        const currentDiff = Geometry.diff(pt1, pt2);

        this.zoom(currentDiff / this.stateDiff, evt);

        this.stateDiff = currentDiff;

        const pp = this.getSvgClientPoint(clientPt).matrixTransform(this.stateTf);
        this.setCTM(this.stateTf.inverse().translate(pp.x - this.stateOriginSvg.x, pp.y - this.stateOriginSvg.y), evt);
      }
    }

    if (this.state === 'down') {

      if (Geometry.diff(clientPt, this.stateOriginClient) > this.panDelta)
        this.state = 'pan';
    }

    if (this.state === 'pan') {
      const sp = this.getSvgClientPoint(clientPt).matrixTransform(this.stateTf);
      this.setCTM(this.stateTf.inverse().translate(sp.x - this.stateOriginSvg.x, sp.y - this.stateOriginSvg.y), evt);
    }
  }

  /*
      start pan (one touch or mouse) or pinch (with two touches)
  */

  private handleMouseDown = (evt: MouseEvent) => {

    if (!this.enablePan)
      return false;

    if (evt.button !== 0)
      return false;

    if (evt.target && !(evt.target instanceof SVGElement)) {
      return false;
    }

    evt.preventDefault();

    this.state = 'down';
    this.setStartState(evt);
  }

  private handleTouchStart = (evt: TouchEvent) => {

    if (!this.enablePan)
      return false;

    if (evt.target && !(evt.target instanceof SVGElement)) {
      return false;
    }

    const touches = evt.touches;

    if (touches && touches.length === 2) {

      const pt1 = Geometry.makeClientPoint(touches[0].clientX, touches[0].clientY);
      const pt2 = Geometry.makeClientPoint(touches[1].clientX, touches[1].clientY);

      this.stateDiff = Geometry.diff(pt1, pt2);

      this.state = 'pinch';

    } else {

      if (this.context.diagram.settings?.twoFingersTouch && touches) {
        this.state = null;
        return;
      }

      this.state = 'down';
    }

    this.setStartState(evt);
  }

  private setStartState(evt: MouseEvent | TouchEvent) {
    this.stateTf = this.viewPort.getCTM().inverse();
    this.stateOriginClient = this.getEventClientPoint(evt);
    this.stateOriginSvg = this.getSvgClientPoint(this.stateOriginClient).matrixTransform(this.stateTf);
  }

  /*
      reset state on mouse up
  */

  private handleClick = (evt: MouseEvent) => {

    // prevent firing 'click' event in case we pan or zoom
    if (this.state === 'pan' || this.state === 'pinch') {
      evt.stopPropagation();
    }

    this.state = null;
  }

  public renderMarkdown(markdown: string, data: any): string {
    const md = markdown && Mustache.render(markdown, data);
    if (!md) return md;

    // Check if the markdown contains block-level elements
    const hasBlockElements = /(?:^|\n)(?:#|\*\s|-\s|\d+\.\s|>\s|\||\n\s*\n)/.test(md);

    const content = hasBlockElements
      ? marked.parse(md) as string
      : marked.parseInline(md) as string;
    return content;
  }

  public getViewMatrix(): string {
    const matrix = this.viewPort.getCTM();
    return `${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f}`;
  }

  public setViewMatrix(matrixString: string): void {
    const values = matrixString.split(',').map(v => parseFloat(v.trim()));
    if (values.length !== 6 || values.some(v => isNaN(v))) {
      console.warn('Invalid view matrix format:', matrixString);
      return;
    }

    const matrix = this.context.svg.createSVGMatrix();
    matrix.a = values[0];
    matrix.b = values[1];
    matrix.c = values[2];
    matrix.d = values[3];
    matrix.e = values[4];
    matrix.f = values[5];

    this.setCTM(matrix, null);
  }

  public getAvailablePropertyNames(): string[] {

    const shapes = this.context?.diagram?.shapes
    if (!shapes) {
      return [];
    }

    const usedPropSet: { [key: string]: boolean } = {};

    for (const shapeId in shapes) {
      const shape = shapes[shapeId];
      if (shape.Props) {
        for (const propName in shape.Props) {
          usedPropSet[propName] = true;
        }
      }
    }

    return Object.keys(usedPropSet).sort();
  }

}
