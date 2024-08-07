import { WATER_INDICATORS_METADATA } from './constants';

export const parseMetadataLayer = (layer = {}) => {
  if (layer.dataset === '113258c9-14fc-4624-8b5c-76b064ac1ae9' || layer.dataset === '3cca5144-63d2-4ddb-af53-094603b702f3') {
    const { description, sources } = WATER_INDICATORS_METADATA[layer.slug];
    return ({
      ...layer,
      metadata: {
        ...layer.metadata,
        ...description && { description },
        info: {
          ...layer.metadata.info,
          ...sources && { sources }
        }
      }
    });
  }

  return layer;
};

export default { parseMetadataLayer };
