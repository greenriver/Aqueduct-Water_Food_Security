import { WATER_INDICATORS_METADATA } from './constants';

export const parseMetadataLayer = (layer = {}) => {
  if (layer.dataset === '979e6a3e-3905-401f-ab81-cd83c5c50c6c' || layer.dataset === '1ab7ce3e-a8b4-45d4-b136-7f6015662a09') {
    let { slug } = layer;

    if (slug.slice(slug.length - 2) === '_1') {
      slug = slug.slice(0, slug.length - 2);
    }

    const { description, sources } = WATER_INDICATORS_METADATA[slug];

    return ({
      ...layer,
      metadata: {
        ...layer.metadata,
        ...description && { description },
        info: {
          ...layer?.metadata?.info && { info: layer.metadata.info },
          ...sources && { sources }
        }
      }
    });
  }

  return layer;
};

export default { parseMetadataLayer };
