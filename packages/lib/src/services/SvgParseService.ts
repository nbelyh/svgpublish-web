import { IDiagramInfo } from '../interfaces';
import { ISvgSource } from '../interfaces/ISvgSource';

export class SvgParseService {

  private static fetchText = async (url: string) => {
    const response = await fetch(url);
    if (response.ok) {
      const content = await response.text();
      return content;
    } else {
      throw new Error(`Failed to load content from ${url}`);
    }
  }

  private static parseSvg(content: string): ISvgSource {

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
    const diagramInfo: IDiagramInfo = diagramNode ? JSON.parse(diagramNode.textContent) : {};

    const viewBox = diagramInfo.viewBox || doc.documentElement.getAttribute('viewBox');
    doc.documentElement.removeAttribute('viewBox');
    doc.documentElement.setAttribute('width', '100%');
    doc.documentElement.setAttribute('height', '100%');

    const svgXml = doc.documentElement.outerHTML;

    return {
      svgXml,
      viewBox,
      diagramInfo
    }
  }

  public static async defaultResolver(url: string): Promise<ISvgSource> {
    const content = await SvgParseService.fetchText(url);
    return SvgParseService.parseSvg(content);
  }

}
