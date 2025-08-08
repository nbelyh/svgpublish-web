import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from 'WebPart/IWebPartProps';

// Import all the group modules
import { SourceFileGroup } from './groups/SourceFileGroup';
import { AppearanceGroup } from './groups/AppearanceGroup';
import { HeaderGroup } from './groups/HeaderGroup';
import { SelectionGroup } from './groups/SelectionGroup';
import { HighlightGroup } from './groups/HighlightGroup';
import { PrevNextHighlightGroup } from './groups/PrevNextHighlightGroup';
import { HyperlinksGroup } from './groups/HyperlinksGroup';
import { TooltipsGroup } from './groups/TooltipsGroup';
import { ContentGroup } from './groups/ContentGroup';
import { SidebarGroup } from './groups/SidebarGroup';
import { AboutGroup } from './groups/AboutGroup';

export class Configuration {

  public static get(context: WebPartContext, properties: IWebPartProps) {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            SourceFileGroup.get(context, properties),
            AppearanceGroup.get(context, properties),
            HeaderGroup.get(properties),
            SelectionGroup.get(properties),
            HighlightGroup.get(properties),
            PrevNextHighlightGroup.get(properties),
            HyperlinksGroup.get(properties),
            TooltipsGroup.get(properties),
            ContentGroup.get(properties),
            SidebarGroup.get(properties),
            AboutGroup.get(context, properties),
          ]
        }
      ]
    };
  }

}
