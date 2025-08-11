export interface IWebPartPropertiesCallback {
  getAvailableProperties(): string[];
  getViewMatrix(): string;
  resetView(): void;
}
