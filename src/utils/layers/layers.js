export const DATASETS = [
  {
    id: 'c4fa0841-a0c6-44bd-a047-a93fc752a8f0',
    layerId: '3be8f820-30f0-4e08-b450-b77bfc543cb8',
    name: 'Food demand for crop',
    category: 'food',
    timeline: true,
    layerOptions: {
      topSize: 10,
      sort: 'desc'
    }
  },
  {
    id: 'db8801e4-9623-417c-bd27-7c3a8abc9070',
    layerId: 'f97563e4-100b-4324-bf5a-35d71276f631',
    name: 'Total crop production',
    category: 'food',
    timeline: true,
    layerOptions: {
      topSize: 10,
      sort: 'desc'
    }
  },
  {
    id: '54685b70-138d-4b10-aabf-70c17f0579a1',
    layerId: '1ebd2349-2d27-4c24-819b-1c0ffa159c60',
    name: 'Crop net trade',
    category: 'food',
    timeline: true,
    layerOptions: {
      dataManipulator: (data = []) => {
        const sortFunction = (a, b) => {
          if (a.properties.value < b.properties.value) return 1;
          if (a.properties.value > b.properties.value) return -1;
          return 0;
        };
        const sortedData = data.sort(sortFunction);
        const firstFive = sortedData.slice(0, 5);
        const lastFive = sortedData.slice(Math.max(sortedData.length - 5, 1));

        return [...firstFive, ...lastFive];
      }
    }
  },
  {
    id: 'e26e348b-ce47-48c2-945c-ba7c5caf1cc0',
    layerId: '24ece36f-b67a-4b71-a7a0-f6accaf630ab',
    name: 'Kilocalories per person',
    category: 'food',
    timeline: true,
    layerOptions: {
      topSize: 10,
      sort: 'asc'
    }
  },
  {
    id: 'db6bb708-5655-4ca7-8e17-ea380048e296',
    layerId: 'd22fba7c-2cdb-4341-9b33-1b82cfaaec4b',
    name: 'Population at risk of hunger',
    category: 'food',
    timeline: true,
    layerOptions: {
      topSize: 10,
      sort: 'desc'
    }
  },
  // baseline water
  {
    id: '979e6a3e-3905-401f-ab81-cd83c5c50c6c',
    name: 'Water Risk',
    category: 'water',
    family: 'baseline'
  },
  // projected water
  {
    id: '1ab7ce3e-a8b4-45d4-b136-7f6015662a09',
    name: 'Projected Water Risk',
    category: 'water',
    family: 'projected'
  },
  // country mask
  {
    id: 'ea9dacf1-c11e-4e6a-ad63-8804111a75ba',
    layerId: '533e0d69-8bb5-45c0-a036-642bf7b977df',
    name: 'Country mask',
    category: 'mask'
  },
  // all crops / one crop
  {
    id: '86d9f802-fabf-46e7-83ed-7c5505140208',
    layerId: '86d9f802-fabf-46e7-83ed-7c5505140208',
    name: 'All crops',
    category: 'crop'
  },
  // baseline water with threshold
  {
    id: '6ab25d91-bdff-4215-b0af-902f6c85141d',
    name: 'Water Risk with Threshold',
    category: 'water',
    family: 'baseline-threshold'
  }
];

export const FOOD_LAYERS = DATASETS.filter(_dataset => _dataset.category === 'food').map(_dataset => _dataset.layerId);
export const WATER_SPECS = DATASETS.filter(_dataset => _dataset.category === 'water').reduce((accumulator, nextValue) => ({
  ...accumulator,
  [nextValue.family]: nextValue.id
}), {});

export default DATASETS;
