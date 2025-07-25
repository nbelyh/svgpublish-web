import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { ISidebarService } from '../interfaces/ISidebarService';

export class SidebarService extends BasicService implements ISidebarService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
  }

  public reset() {
    this.destroy();
  }
}
