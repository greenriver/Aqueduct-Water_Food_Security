import { replace } from 'react-router-redux';

export function updateMapUrl() {
  return (dispatch, state) => {
    const { map, filters } = state();
    const { year, country, crop, food, irrigation, scope, water, changeFromBaseline } = filters;
    const locationDescriptor = {
      pathname: '/',
      query: {
        lat: map.latLng.lat.toFixed(2),
        lng: map.latLng.lng.toFixed(2),
        zoom: map.zoom,
        year,
        country,
        crop,
        food,
        irrigation: (irrigation) ? irrigation.join(',') : undefined,
        scope,
        water,
        changeFromBaseline
      }
    };
    dispatch(replace(locationDescriptor));
  };
}

export function updateCompareUrl() {
  return (dispatch, state) => {
    const { compare, filters } = state();
    const { year, crop, food, irrigation, water, changeFromBaseline } = filters;
    const locationDescriptor = {
      pathname: '/compare',
      query: {
        countries: compare.countries.join(','),
        year,
        crop,
        food,
        irrigation: irrigation.join(','),
        scope: 'country',
        water,
        changeFromBaseline
      }
    };
    dispatch(replace(locationDescriptor));
  };
}
