import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { sp } from '@pnp/sp';

import { TopFrame } from './components/TopFrame';
import { Configuration } from './properties/Configuration';
import { IWebPartProps } from './IWebPartProps';
import { SettingsService } from './services/SettingsService';
import { BlankPlaceholder } from './components/BlankPlaceholder';
import { DefaultDiagramSettings, ISvgSource } from 'svgpublish';

const NON_SETTINGS_KEYS = ['url', 'protectedSettings', 'width', 'height'];
const ENUM_KEYS = ['selectionMode', 'tooltipTheme', 'tooltipTrigger', 'tooltipPlacement', 'sidebarType'];

export default class WebPart extends BaseClientSideWebPart<IWebPartProps> {

  public async onInit() {

    await super.onInit();

    if (!this.properties.protectedSettings) {
      this.properties.protectedSettings = [];
    }

    if (!this.properties.width) {
      this.properties.width = await SettingsService.getDefaultWidth(this.context);
    }

    if (!this.properties.height) {
      this.properties.height = await SettingsService.getDefaultHeight(this.context);
    }

    for (const key in DefaultDiagramSettings) {
      if (typeof this.properties[key] === 'undefined' || !this.properties.protectedSettings.includes(key)) {
        this.properties[key] = DefaultDiagramSettings[key];
      }
    }

    sp.setup({ spfxContext: this.context as any });
  }

  private diagramSettings = DefaultDiagramSettings;
  private availableProperties: string[] = [];

  async sourceResolver(url: string, defaultResolver: (url: string) => Promise<ISvgSource>): Promise<ISvgSource> {

    const result = await defaultResolver(url);

    this.diagramSettings = { ...DefaultDiagramSettings, ...result.diagramInfo.settings };

    // Extract available properties from diagram shapes
    this.availableProperties = SettingsService.extractAvailableProperties(result.diagramInfo);

    // Refresh property pane if it's open to update available properties
    if (this.context.propertyPane.isPropertyPaneOpen()) {
      this.context.propertyPane.refresh();
    }

    for (const key in this.diagramSettings) {
      if (this.properties.protectedSettings.includes(key))
        continue;
      if (ENUM_KEYS.includes(key) && this.diagramSettings[key] === '')
        continue;
      this.properties[key] = this.diagramSettings[key];
    }

    const settings = { ...this.properties };
    for (const key of NON_SETTINGS_KEYS) {
      delete settings[key];
    }

    for (const key of this.properties.protectedSettings) {
      settings[key] = this.properties[key];
    }

    return {
      svgXml: result.svgXml,
      viewBox: result.viewBox,
      diagramInfo: { ...result.diagramInfo, settings }
    }
  }

  public render(): void {

    const params = new URLSearchParams(window.location.search);
    const paramsUrl = params.get('svgpublish-url');
    const url = paramsUrl || this.properties.url;

    const element = url
      ? React.createElement(TopFrame, {
        url,
        properties: this.properties,
        sourceResolver: this.sourceResolver.bind(this)
      })
      : React.createElement(BlankPlaceholder, {
        isTeams: !!this.context.sdks?.microsoftTeams,
        isPropertyPaneOpen: this.context.propertyPane.isPropertyPaneOpen(),
        isReadOnly: this.displayMode === DisplayMode.Read,
        onConfigure: () => this.context.propertyPane.open(),
      });

    ReactDom.render(element, this.domElement);
  }

  public onPropertyPaneConfigurationStart() {
    this.render();
  }

  public onPropertyPaneConfigurationComplete() {
    this.render();
  }

  protected onPropertyPaneFieldChanged(propertyPath: keyof IWebPartProps, oldValue: any, newValue: any): void {

    if (!NON_SETTINGS_KEYS.includes(propertyPath) && !this.properties.protectedSettings.includes(propertyPath)) {
      this.properties.protectedSettings.push(propertyPath);
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === 'protectedSettings') {
      const diagramSettings = { ...DefaultDiagramSettings, ...this.diagramSettings };
      for (const key in diagramSettings) {
        this.properties[key] = diagramSettings[key];
      }
      this.context.propertyPane.refresh();
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return Configuration.get(this.context, this.properties, this.availableProperties);
  }
}
