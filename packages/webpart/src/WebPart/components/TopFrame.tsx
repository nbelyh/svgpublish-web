import * as React from 'react';
import { IBreadcrumbItem, ThemeProvider } from '@fluentui/react';
import { ISvgPublishContext, LinkClickedEvent, SelectionChangedEvent, SvgPublishContext } from 'svgpublish';
import { ErrorPlaceholder } from './ErrorPlaceholder';
import { AppSidebar } from './AppSidebar';
import { UtilsService } from '../services/UtilsService';
import { Header } from './Header';
import { ISvgSource } from 'svgpublish';
import { IWebPartProps } from 'WebPart/IWebPartProps';

interface ITarget {
  pageUrl: string;
  zoom?: string;
  shapeId?: string;
}

export function TopFrame(props: {
  url: string;
  properties: IWebPartProps;
  sourceResolver: (url: string, defaultResolver: (url: string) => Promise<ISvgSource>) => Promise<ISvgSource>;
}) {

  const [source, setSource] = React.useState<ITarget>({ pageUrl: props.url });
  React.useEffect(() => setSource({ pageUrl: props.url }), [props.url]);

  const [context, setContext] = React.useState<ISvgPublishContext>();

  const onBreadcrumbClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
    setBreadcrumb(b => b.slice(0, b.findIndex(i => i.key === item.key) + 1));
    setSource({ pageUrl: item.key });
    setError('');
  };

  const [breadcrumb, setBreadcrumb] = React.useState<IBreadcrumbItem[]>([{ key: props.url, text: "Home", onClick: onBreadcrumbClick }]);

  React.useEffect(() => {
    if (context) {
      context.events.addEventListener('svgpublish_LinkClicked', onLinkClicked);
      return () => context.events.removeEventListener('svgpublish_LinkClicked', onLinkClicked);
    }
  }, [context]);

  React.useEffect(() => {
    if (context) {
      context.events.addEventListener('svgpublish_SelectionChanged', onSelectionChanged);
      return () => context.events.removeEventListener('svgpublish_SelectionChanged', onSelectionChanged);
    }
  }, [context]);

  const navigateToPage = (pageUrl: string, pageName: string, zoom?: string, shapeId?: string) => {
    setBreadcrumb(b => [...b, { key: pageUrl, text: pageName, onClick: onBreadcrumbClick }]);
    setSource({ pageUrl: pageUrl, zoom, shapeId });
  }

  React.useEffect(() => {

    const newContext = new SvgPublishContext(containerRef.current);
    newContext.init(source.pageUrl, props.sourceResolver).then(() => {
      setContext(newContext);

      const zoom = +source.zoom;
      if (zoom) {
        newContext.services.view.zoom(zoom);
      }

      const shapeId = source.shapeId;
      if (shapeId) {
        newContext.services.view.highlightShape(shapeId);
      }

    }).catch(err => {
      console.error(err);
      setError(UtilsService.stringifyError(err));
    });

    return () => {
      newContext.destroy();
      setContext(undefined)
    }
  }, [source, JSON.stringify(props.properties)]);

  const onLinkClicked = (evt: LinkClickedEvent) => {

    // Prevent navigation if CTRL key is held down (similar to vp-links.js logic)
    if (evt.detail.triggerEvent && evt.detail.triggerEvent.ctrlKey) {
      return;
    }

    evt.preventDefault();

    const args = evt.detail;
    const baseUrl = props.url.substring(0, props.url.lastIndexOf('/') + 1)

    const pageId = args.link.PageId;
    if (pageId >= 0) {
      const diagram = evt.detail.context.diagram;
      const page = diagram.pages.find(p => p.Id === pageId);
      const pageUrl = baseUrl + page.FileName;
      navigateToPage(pageUrl, args.shape.Text, args.link.Zoom, args.link.ShapeId);
    } else {

      let linkAddress = args.link.Address;
      if (linkAddress) {

        if (props.properties.rewriteVsdxHyperlinks && linkAddress.endsWith('.vsdx')) {
          linkAddress = linkAddress.replace('.vsdx', '.svg');
        }

        if (!linkAddress.startsWith('https:') && linkAddress.endsWith('.svg')) { // another local diagram
          const pageUrl = baseUrl + linkAddress;
          navigateToPage(pageUrl, args.shape.Text);
        } else {

          const fileUrl = UtilsService.isUrlAbsolute(linkAddress)
            ? new URL(linkAddress)
            : new URL(linkAddress, baseUrl);

          if (props.properties.rewriteOfficeHyperlinks && UtilsService.isOfficeFileExtension(linkAddress)) {
            fileUrl.searchParams.append('web', '1');
          }
          const target = props.properties.openHyperlinksInNewWindow ? '_blank' : '_self';
          window.open(fileUrl, target);
        }
      }
    }
  };

  const [error, setError] = React.useState('');

  // Initialize sidebar state based on configuration
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Track selection state for showSidebarOnSelection functionality
  const [hasSelection, setHasSelection] = React.useState(false);
  const [selectedShapeId, setSelectedShapeId] = React.useState<string | undefined>(undefined);

  const onOpenSidebar = () => {
    // Only allow opening if sidebar is enabled
    if (props.properties.enableSidebar) {
      setIsSidebarOpen(true);
    }
  }

  const onCloseSidebar = () => {
    setIsSidebarOpen(false);
  }

  // Handle selection changes for showSidebarOnSelection functionality
  const onSelectionChanged = (evt: SelectionChangedEvent) => {
    const selectedShapeIdValue = evt.detail?.shapeId;
    setHasSelection(!!selectedShapeIdValue);
    setSelectedShapeId(selectedShapeIdValue);

    // Auto-open sidebar on selection if configured
    if (props.properties.showSidebarOnSelection && selectedShapeIdValue && props.properties.enableSidebar) {
      setIsSidebarOpen(true);
    }
    // Auto-close sidebar when deselecting if configured
    else if (props.properties.showSidebarOnSelection && !selectedShapeIdValue) {
      setIsSidebarOpen(false);
    }
  };

  // Determine if sidebar should be shown
  const shouldShowSidebar = props.properties.enableSidebar &&
    (!props.properties.showSidebarOnSelection || hasSelection || isSidebarOpen);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {
    width: props.properties.width,
    height: props.properties.height,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <ThemeProvider style={style}>

      {props.properties.enableHeader && (
        <Header
          url={source.pageUrl}
          breadcrumb={breadcrumb}
          settings={props.properties}
          onOpenSidebar={onOpenSidebar}
        />
      )}

      {!!error && <ErrorPlaceholder error={error} />}

      <div style={style} ref={containerRef} />

      {shouldShowSidebar && (
        <AppSidebar
          isOpen={isSidebarOpen}
          onDismiss={onCloseSidebar}
          context={context}
          selectedShapeId={selectedShapeId}
          settings={props.properties}
        />
      )}

    </ThemeProvider>
  );
}
