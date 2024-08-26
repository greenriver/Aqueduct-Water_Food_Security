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


(async () => {
  // main();
  // getDatasetLayers('4a2b250e-25ab-4da3-9b83-dc318995eee1');

  // water baseline
  // getDatasetLayers('113258c9-14fc-4624-8b5c-76b064ac1ae9');

  // new water baseline
  // getDatasetLayers('979e6a3e-3905-401f-ab81-cd83c5c50c6c');

  // water stress
  // printLayer('8074ac9b-9cca-4aaf-a112-26166a8e9c7d');
  // printLayer('160be93f-8c21-428a-b4c7-214b7ea4232d');
  // printLayer('b687f3e4-e362-4a8d-9a69-a610710efd6b');
  // printLayer('1c149343-fae5-4c2d-a6d4-60f988866d89');
  // printLayer('0eb346f7-83eb-4919-b032-8bc9957d2c2a');
  // printLayer('7520db69-3cf2-42ba-a0ee-5ee37b3085db');
  // printLayer('23662aa6-cb2a-4e46-9be8-4a2d617f26c9');
  // printLayer('11a98f9a-c03c-4757-b144-c2a78757f281');
  // printLayer('3c3d5714-1200-4af1-b7c9-e1e01402319e');

  // ----------------------------------------------

  // getDatasetLayers('3cca5144-63d2-4ddb-af53-094603b702f3');
  // await getDatasetLayers('6880e51c-fda2-4de5-8456-e981d548853a');
  // await getDatasetLayers('b6864a7c-4711-4fd1-9e39-3eb3b36761bf');
  // await getDatasetLayers('cfbe4903-2aaa-47e1-b26b-70a600363f5b');
  // await getDatasetLayers('c6d487f0-42ad-4513-ac99-108d4c51dab1');
  // await getDatasetLayers('57748f05-aa1d-476f-9044-9ae9ca8a09c5');
  // await getDatasetLayers('ea9dacf1-c11e-4e6a-ad63-8804111a75ba');
  // await getDatasetLayers('3cca5144-63d2-4ddb-af53-094603b702f3');
  // await printLayer('6f339b41-ea2f-4502-a454-d03bb22b540b');
  // await getDatasetPayload('3cca5144-63d2-4ddb-af53-094603b702f3');
  await getDatasetLayers('1ab7ce3e-a8b4-45d4-b136-7f6015662a09');
})();
