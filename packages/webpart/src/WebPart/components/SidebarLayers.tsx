import * as React from 'react';
import {
  Stack,
  Text,
  Checkbox,
  DefaultButton,
  ActionButton,
  SearchBox
} from '@fluentui/react';
import { ISvgPublishContext, ILayerInfo } from 'svgpublish-react';

export const SidebarLayers = (props: {
  context?: ISvgPublishContext;
  enableLayerLookup?: boolean;
  enableLayerSort?: boolean;
  enableLayerShowAll?: boolean;
}) => {
  const { context, enableLayerLookup, enableLayerSort, enableLayerShowAll } = props;

  // Get layers from the layers service
  const layersService = context?.services?.layers;
  const layers: ILayerInfo[] = layersService?.getLayers() || [];

  // Use props first, then fall back to context layerView options
  const lookupEnabled = enableLayerLookup ?? context?.diagram?.layerView?.enableLayerLookup ?? false;
  const sortEnabled = enableLayerSort ?? context?.diagram?.layerView?.enableLayerSort ?? false;
  const showAllEnabled = enableLayerShowAll ?? context?.diagram?.layerView?.enableLayerShowAll ?? true;

  const [layerStates, setLayerStates] = React.useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // Sort layers alphabetically if enabled
  const sortedLayers = React.useMemo(() => {
    if (sortEnabled) {
      const collator = Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      return [...layers].sort((a, b) => collator.compare(a.Name, b.Name));
    }
    return layers;
  }, [layers, sortEnabled]);

  // Filter layers based on search term
  const filteredLayers = React.useMemo(() => {
    if (!searchTerm) return sortedLayers;
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return sortedLayers.filter(layer => regex.test(layer.Name));
  }, [sortedLayers, searchTerm]);

  // Initialize layer states from the layer data
  React.useEffect(() => {
    const initialStates: { [key: string]: boolean } = {};
    layers.forEach(layer => {
      initialStates[layer.Name] = layer.Visible;
    });
    setLayerStates(initialStates);
  }, [layers]);

  const handleLayerToggle = (layerName: string, checked: boolean) => {
    setLayerStates(prev => ({
      ...prev,
      [layerName]: checked
    }));

    // Use the layers service to update layer visibility
    if (layersService) {
      layersService.setLayerVisible(layerName, checked);
    }
  };

  const handleShowAll = () => {
    if (layersService) {
      layersService.showAllLayers();

      // Update local state
      const newStates: { [key: number]: boolean } = {};
      layers.forEach(layer => {
        newStates[layer.Name] = true;
      });
      setLayerStates(newStates);
    }
  };

  const handleHideAll = () => {
    if (layersService) {
      layersService.hideAllLayers();

      // Update local state
      const newStates: { [key: number]: boolean } = {};
      layers.forEach(layer => {
        newStates[layer.Name] = false;
      });
      setLayerStates(newStates);
    }
  };

  // If no layers exist
  if (!layers || layers.length === 0) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="medium">
          No Layers Available
        </Text>
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginLeft: '8px' } }}>
      {(lookupEnabled || showAllEnabled) &&
        <Stack horizontal wrap tokens={{ childrenGap: 16 }}>
          {lookupEnabled && <Stack.Item grow>
              <SearchBox placeholder="Search layers..." value={searchTerm} onChange={(_, newValue) => setSearchTerm(newValue || '')} />
          </Stack.Item>}
          {showAllEnabled && <Stack horizontal tokens={{ childrenGap: 8 }}>
            <DefaultButton text="Show All" onClick={handleShowAll} />
            <DefaultButton text="Hide All" onClick={handleHideAll} />
          </Stack>}
        </Stack>
      }

      <Stack tokens={{ childrenGap: 4 }}>
        {filteredLayers.map(layer => (
          <Checkbox
            key={layer.Index}
            label={layer.Name}
            checked={layerStates[layer.Name] || false}
            onChange={(ev, checked) => handleLayerToggle(layer.Name, !!checked)}
          />
        ))}
      </Stack>

    </Stack>
  );
};
