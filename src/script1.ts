const fs = require('fs');
const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://api.resourcewatch.org',
  headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzcwOTBiZTU5MTU5NmYyN2MxOThjYSIsInJvbGUiOiJBRE1JTiIsInByb3ZpZGVyIjoibG9jYWwiLCJlbWFpbCI6IkNhcmxvcy5EZWxSZWFsLjVAd3JpY29uc3VsdGFudC5vcmciLCJleHRyYVVzZXJEYXRhIjp7ImFwcHMiOlsicnciLCJhcXVlZHVjdCIsImFxdWVkdWN0LXdhdGVyLXJpc2siXX0sImNyZWF0ZWRBdCI6MTY4Njc3NTUyNTAyNSwicGhvdG8iOiJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vd3JpLWFwaS1iYWNrdXBzL3Jlc291cmNld2F0Y2gvc3RhZ2luZy9wcm9maWxlcy9hdmF0YXJzLzAwMC8wMDAvMjU4L29yaWdpbmFsL2RhdGE_MTY3NDA2ODA0NyIsIm5hbWUiOiJDYXJsb3MgRGVsIFJlYWwiLCJpYXQiOjE2ODY3NzU1MjV9.3J7HR6Et_5wmJbbfjnh_7ZvrClzIsRAdwaqMJEMmOuM' }
});

const getDatasetLayers = async (dataset) => {
  const { data } = await instance.get(`/v1/dataset/${dataset}?includes=layer`);
  // console.log(data.data.attributes);
  const layerIds = data.data.attributes.layer.map(({ id, attributes }) => ({ id, slug: attributes.slug, dataset: attributes.dataset }));
  console.table(layerIds);
};

const getDataset = async (dataset) => {
  const { data } = await instance.get(`/v1/dataset/${dataset}?includes=metadata`);
  // console.log(data.data);
  // console.log(JSON.stringify(data.data, null, 4));
  return data;
};

const printLayer = async (layerId) => {
  const { data } = await instance.get(`/v1/layer/${layerId}`);
  const attrb = data.data.attributes;

  const keysToDelete = [
    'interactionConfig', 'applicationConfig', 'staticImageConfig', 'createdAt', 'updatedAt', 'userId', 'iso', 'dataset'
  ];
  keysToDelete.forEach((k) => {
    delete attrb[k];
  });
  // delete attrb
  console.log(JSON.stringify(attrb, null, 4));
};

const main = async () => {
  const baseUrl = 'https://api.resourcewatch.org';
  const url = '/v1/dataset/4a2b250e-25ab-4da3-9b83-dc318995eee1';
  const data = await axios.get(baseUrl + url);
  console.log(data.data);
};

const getDatasetPayload = async (dataset) => {
  const baseUrl = 'https://api.resourcewatch.org';
  const url = `/v1/dataset/${dataset}`;
  const { data } = await axios.get(baseUrl + url);
  // console.log(data.data);

  const attrb = data.data.attributes;
  const keysTokep = [
    'name', 'connectorType', 'provider',
    'connectorUrl', 'application'
  ];
  const cleanedDataset = {};
  keysTokep.forEach((k) => {
    cleanedDataset[k] = attrb[k];
  });
  console.log(JSON.stringify(cleanedDataset, null, 4));
};

const cleanMetadata = metadata => ({
  type: 'metadata',
  attributes: {
    application: metadata.attributes.application,
    language: 'en',
    description: metadata.attributes.description,
    info: metadata.attributes.info,
    status: metadata.attributes.status
  }
});

const getMetadata = async (dataset) => {
  const { data } = await instance.get(`/v1/dataset/${dataset}?includes=metadata`);

  const metadata = data.data.attributes.metadata[0];
  if (!metadata) throw new Error(`there is not metadata ${dataset}`);

  // const cleanMeta = cleanMetadata(metadata);

  console.log(JSON.stringify(metadata, null, 4));
  return metadata;
};

const copyMetadata = async (sourceDS, targetDS) => {
  const cleanMeta = cleanMetadata(await getMetadata(sourceDS));
  console.log(JSON.stringify(cleanMeta, null, 4));

  try {
    const res = await instance.post(`/v1/dataset/${targetDS}/metadata`, cleanMeta.attributes);
    console.log(res.data);
  } catch (e) {
    console.log(e.response.data);
  }
};

// Metadata
const getWidgetById = async (metadataId) => {
  const { data } = await instance.get(`/v1/widget/${metadataId}`);

  console.log(JSON.stringify(data.data.attributes.widgetConfig.data[0].url, null, 4));

  try {
    fs.writeFileSync(`requests/widgets/${metadataId}.json`, JSON.stringify(data.data.attributes, null, 2));
    // file written successfully
  } catch (err) {
    console.error(err);
  }
};

const updateWidgetFromFile = async (metadataId) => {
  const widget = JSON.parse(fs.readFileSync(`requests/widgets/${metadataId}.json`, 'utf8'));

  // console.log(JSON.stringify(widget, null, 4));

  widget.widgetConfig.data[0].url = "https://wri-rw.carto.com/api/v2/sql?q= SELECT impactparameter AS name, sum(value)*1000 AS y FROM combined01_prepared_new_2020v1 WHERE impactparameter in ('Food Demand', 'Production', 'Net trade') and commodity<>'All Cereals' and commodity<>'All Pulses' {{and}} group by impactparameter";

  console.log(JSON.stringify(widget.widgetConfig.data[0].url, null, 4));

  try {
    const res = await instance.patch(`/v1/widget/${metadataId}`, widget);
    console.log(res.status);
  } catch (e) {
    console.log(e.response.data);
  }
};

// Layer
const getLayerById = async (layerId) => {
  const { data } = await instance.get(`/v1/layer/${layerId}`);
  const datasetId = data.data.attributes.dataset;

  console.log(JSON.stringify(data.data.attributes.layerConfig.body.layers[1].options.sql, null, 4));
  console.log(JSON.stringify(data.data.attributes.layerConfig.body.layers[1].options.cartocss, null, 4));

  try {
    fs.writeFileSync(`requests/layers/${layerId}.json`, JSON.stringify(data.data.attributes, null, 2));
    // file written successfully
    return { layerId, datasetId };
  } catch (err) {
    console.error(err);
    return { layerId, datasetId };
  }
};

const updateLayerFromFile = async (datasetId, layerId) => {
  const layer = JSON.parse(fs.readFileSync(`requests/layers/${layerId}.json`, 'utf8'));

  layer.layerConfig.body.layers[1].options.cartocss = '#layer{polygon-fill: #FF6600; polygon-opacity: 1; line-color: #FF6600; line-width: 0.5; line-opacity: 1; comp-op: dst-in;}';
  layer.layerConfig.body.layers[1].options.sql = 'SELECT cartodb_id, the_geom_webmercator FROM crop_baseline_2020v1r1 {{where}}';


  console.log('******************************************');
  console.log(JSON.stringify(layer.layerConfig.body.layers[0].options.sql, null, 4));
  console.log(JSON.stringify(layer.layerConfig.body.layers[0].options.cartocss, null, 4));


  try {
    const res = await instance.patch(`/v1/dataset/${datasetId}/layer/${layerId}`, layer);
    console.log(res.status);
  } catch (e) {
    console.log(e.response.data);
  }
};

const getMetadataByWidgetId = async (widgetId) => {
  const { data } = await instance.get(`/v1/widget/${widgetId}`);
  const datasetId = data.data.attributes.dataset;
  const dataset = await getDataset(datasetId);
  const metadataId = dataset.data.attributes.metadata[0].id;

  // console.log(JSON.stringify(dataset.data.attributes.metadata[0], null, 4));
  console.log({ count: dataset.data.attributes.metadata.length });
  const metadata = dataset.data.attributes.metadata[0].attributes;

  console.log(JSON.stringify(metadata.description, null, 4));
  console.log(JSON.stringify(metadata.info, null, 4));

  try {
    fs.writeFileSync(`requests/metadata/${metadataId}.json`, JSON.stringify(metadata, null, 2));
    // file written successfully
    return { metadataId, datasetId };
  } catch (err) {
    console.error(err);
    return { metadataId, datasetId };
  }
};

const updateMetadataFromFile = async (datasetId, metadataId) => {
  const metadata = JSON.parse(fs.readFileSync(`requests/metadata/${metadataId}.json`, 'utf8'));

  console.log(JSON.stringify(metadata.description, null, 4));
  console.log(JSON.stringify(metadata.info, null, 4));

  metadata.description = 'This figure displays annual domestic production, demand for food, and net trade for the crop and timeframe selected.';

  metadata.info.sources = [
    // {
    //   'source-url': 'https://doi.org/10.46830/writn.23.00061',
    //   'source-name': 'Aqueduct 4.0'
    // },
    // {
    //   'source-url': 'https://mapspam.info/data/',
    //   'source-name': 'MapSPAM 2020'
    // },
    {
      'source-url': 'https://hdl.handle.net/10568/148953',
      'source-name': 'IFPRI IMPACT Model 3.6'
    },
    {
      'source-url': 'https://doi.org/10.1016/j.gfs.2024.100755',
      'source-name': 'Research paper'
    }
  ];

  // metadata.info.units = '2019 USD/mt';
  // metadata.info.resolution = 'global';
  // delete metadata.info.scenario;

  console.log('******************************************');
  console.log(JSON.stringify(metadata.description, null, 4));
  console.log(JSON.stringify(metadata.info, null, 4));

  try {
    const res = await instance.patch(`/v1/dataset/${datasetId}/metadata`, metadata);
    console.log(res.status);
  } catch (e) {
    console.log(e.response.data);
  }
};


(async () => {
  // UPDATE METADATA //
  // const widgetId = '5c9336fa-955d-4dcf-b7a8-c871c5f49b01';
  // const { metadataId, datasetId } = await getMetadataByWidgetId(widgetId);

  // console.log({ metadataId, datasetId });
  // if (process.argv[2] === 'write') {
  //   console.log('****** WRITING ******');
  //   await updateMetadataFromFile(datasetId, metadataId);
  // }

  // UPDATE WIDGET //
  // const widgetId = 'c0de6729-7ca5-4c0b-ab23-e04b97659e26';

  // await getWidgetById(widgetId);

  // if (process.argv[2] === 'write') {
  //   console.log('****** WRITING ******');
  //   await updateWidgetFromFile(widgetId);
  // }


  // UPDATE LAYER //
  const layerId = '606023da-06d0-4fa2-8784-c4901c7d167e';

  const { datasetId } = await getLayerById(layerId);

  if (process.argv[2] === 'write') {
    console.log('****** WRITING ******');
    await updateLayerFromFile(datasetId, layerId);
  }
})();
