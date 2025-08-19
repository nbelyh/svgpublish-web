import * as React from 'react';
import { IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { ThemeProvider } from '@fluentui/react/lib/Theme';
import { LinkClickedEvent, SelectionChangedEvent, SvgPublishContext } from 'svgpublish';
import { ErrorPlaceholder } from './ErrorPlaceholder';
import { AppSidebar } from './sidebar/AppSidebar';
import { UtilsService } from '../services/UtilsService';
import { Header } from './Header';
import { ISvgSource } from 'svgpublish';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { IWebPartPropertiesCallback } from './../IWebPartPropertiesCallback'

const ADDITIONAL_PROPERTIES = [
  'url',
  'width',
  'height',
  'protectedSettings',
];

interface ITarget {
  pageUrl: string;
  zoom?: string;
  shapeId?: string;
}

export function TopFrame(props: {
  url: string;
  properties: IWebPartProps;
  onPageLoad: (url: string, propertiesCallback: IWebPartPropertiesCallback, defaultSourceResolver: (url: string) => Promise<ISvgSource>) => Promise<ISvgSource>;
  onViewReset?: () => void;
}) {

  const [source, setSource] = React.useState<ITarget>({ pageUrl: props.url });
  React.useEffect(() => setSource({ pageUrl: props.url }), [props.url]);

  const [context, setContext] = React.useState<SvgPublishContext>();

  const onBreadcrumbClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
    setBreadcrumb(b => b.slice(0, b.findIndex(i => i.key === item.key) + 1));
    setSource({ pageUrl: item.key });
    setError(undefined);
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

  const navigateToPage = (pageUrl: string, pageName: string, shapeId?: string, zoom?: string) => {
    setBreadcrumb(b => [...b, { key: pageUrl, text: pageName, onClick: onBreadcrumbClick }]);
    setSource({ pageUrl: pageUrl, zoom, shapeId });
  }

  const navigateToShape = (shapeId: string) => {
    // For current page shapes, just highlight and focus without page reload
    const view = context?.services.view;
    if (view) {
      view.setFocusShape(shapeId);
      view.highlightShape(shapeId);
    }

  }

  React.useEffect(() => {

    const newContext = new SvgPublishContext(containerRef.current);

    const sourceResolver = async (url: string, defaultResolver: (url: string) => Promise<ISvgSource>): Promise<ISvgSource> => {
      const propertiesCallback: IWebPartPropertiesCallback = {
        getAvailableProperties: () => newContext.services.view.getAvailablePropertyNames(),
        getViewMatrix: () => newContext.services.view.getViewMatrix(),
        resetView: () => newContext.services.view.reset(),
      }
      const source = await props.onPageLoad(url, propertiesCallback, defaultResolver);
      return source;
    }

    newContext.init(source.pageUrl, sourceResolver).then(() => {
      setContext(newContext);

      const zoom = +source.zoom;
      if (zoom) {
        newContext.services.view.zoom(zoom);
      } else if (props.properties.savedViewMatrix && source.pageUrl === props.url) {
        // Only apply saved view matrix if we're on the root page
        newContext.services.view.setViewMatrix(props.properties.savedViewMatrix);
      }

      const shapeId = source.shapeId;
      if (shapeId) {
        newContext.services.view.setFocusShape(shapeId);
        newContext.services.view.highlightShape(shapeId);
      }

    }).catch(err => {
      console.error(err);
      setError(err);
    });

    return () => {
      newContext.destroy();
      // setContext(undefined)
    }
  }, [source]);

  // Update services when non-reload properties change
  React.useEffect(() => {
    if (context) {
      for (const key in props.properties) {
        if (!ADDITIONAL_PROPERTIES.includes(key)) {
          context.diagram.settings[key] = props.properties[key];
        }
      }
      context.configureServices();
    }
  }, [context, JSON.stringify(props.properties)]);

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
      navigateToPage(pageUrl, args.shape.Text, args.link.ShapeId, args.link.Zoom);
    } else {

      let linkAddress = args.link.Address;
      if (linkAddress) {

        if (props.properties.rewriteVisioHyperlinks && linkAddress.endsWith('.vsdx')) {
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

  const [error, setError] = React.useState();

  // Initialize sidebar state based on configuration
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Track selection state for showSidebarOnSelection functionality
  const [selectedShapeId, setSelectedShapeId] = React.useState<string | undefined>(undefined);

  // Reset selection when page URL changes
  React.useEffect(() => {
    setSelectedShapeId(undefined);
  }, [source.pageUrl]);

  const onOpenSidebar = () => {
    // Only allow opening if sidebar is enabled
    if (props.properties.enableSidebar) {
      setIsSidebarOpen(true);
    }
  }

  const onCloseSidebar = () => {
    setIsSidebarOpen(false);
  }

  const onToggleSidebar = () => {
    if (props.properties.enableSidebar) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  }

  // Handle selection changes for showSidebarOnSelection functionality
  const onSelectionChanged = (evt: SelectionChangedEvent) => {
    const selectedShapeIdValue = evt.detail?.shapeId;
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

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const onToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerRef = React.useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {
    width: props.properties.width,
    height: props.properties.height,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...(isFullscreen ? {
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 999999
    } : {}),
  };

  return (
    <ThemeProvider style={style}>

      {props.properties.enableHeader && (
        <Header
          url={source.pageUrl}
          breadcrumb={breadcrumb}
          settings={props.properties}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={onToggleSidebar}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
      )}

      {!!error && <ErrorPlaceholder error={error} />}

      <div style={{ flex: 1 }} ref={containerRef} />

      {props.properties.enableSidebar && (
        <AppSidebar
          isOpen={isSidebarOpen}
          onDismiss={onCloseSidebar}
          context={context}
          selectedShapeId={selectedShapeId}
          settings={props.properties}
          onNavigateToPage={navigateToPage}
          onNavigateToShape={navigateToShape}
          baseUrl={props.url}
        />
      )}

    </ThemeProvider>
  );
}
