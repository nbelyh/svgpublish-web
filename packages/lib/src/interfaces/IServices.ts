import { IViewService } from './IViewService';
import { ISelectionService } from './ISelectionService';
import { IHoverService } from './IHoverService';
import { ILinksService } from './ILinksService';
import { ITooltipService } from './ITooltipService';
import { ISidebarService } from './ISidebarService';
// import { IBasicService } from './IBasicService';

export interface IServices {
  view?: IViewService;
  selection?: ISelectionService;
  links?: ILinksService;
  hover?: IHoverService;
  tooltip?: ITooltipService;
  sidebar?: ISidebarService;
  // [key: string]: IBasicService;
};
