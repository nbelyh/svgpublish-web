// Widens the web part from its section to the width of the whole page area (keeping the page's own
// paddings), for team sites, where SharePoint does not offer custom web parts in full-width sections.
// It relies on SharePoint's page classes (CanvasZone, CanvasSection) and does nothing where they are
// missing (Teams, full-page app) or where the web part is not alone in a one-column section.
export class PageStretch {

  private zone: HTMLElement | null = null;
  private observer: ResizeObserver | null = null;

  constructor(private readonly element: HTMLElement) {
  }

  public enable() {
    if (this.observer) {
      this.update();
      return;
    }
    this.zone = this.element.closest('.CanvasZone');
    if (!this.zone || this.zone.classList.contains('CanvasZone--fullWidth')) {
      return;
    }
    // The zone changes width with the window, the left navigation and the edit-mode panes.
    this.observer = new ResizeObserver(this.update);
    this.observer.observe(this.zone);
    window.addEventListener('resize', this.update);
    this.update();
  }

  public disable() {
    this.observer?.disconnect();
    this.observer = null;
    window.removeEventListener('resize', this.update);
    this.reset();
  }

  private reset() {
    this.element.style.marginLeft = '';
    this.element.style.width = '';
  }

  private update = () => {
    this.reset();
    const section: HTMLElement | null = this.element.closest('.CanvasSection');
    if (!this.zone || !section?.parentElement) {
      return;
    }
    // In a section with several columns the web part would cover its neighbours.
    if (section.offsetWidth < section.parentElement.offsetWidth - 1) {
      return;
    }
    const zoneStyle = getComputedStyle(this.zone);
    const sectionStyle = getComputedStyle(section);
    const padLeft = parseFloat(zoneStyle.paddingLeft) + parseFloat(sectionStyle.paddingLeft);
    const padRight = parseFloat(zoneStyle.paddingRight) + parseFloat(sectionStyle.paddingRight);
    const zoneRect = this.zone.getBoundingClientRect();
    const ownRect = this.element.getBoundingClientRect();
    const width = zoneRect.width - padLeft - padRight;
    if (width <= ownRect.width) {
      return;
    }
    this.element.style.marginLeft = `${zoneRect.left + padLeft - ownRect.left}px`;
    this.element.style.width = `${width}px`;
  }
}
