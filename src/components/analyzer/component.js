import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  SegmentedUi,
  RadioGroup,
} from 'aqueduct-components';
import isEmpty from 'lodash/isEmpty'
import CustomTable from 'components/ui/Table/Table';
import { ExportToCsv } from 'export-to-csv';
import {
  ID_LOOKUP,
  WATER_INDICATORS,
  ALLOWED_WATER_INDICATOR_KEYS_BY_SCOPE
} from 'constants/water-indicators';
import {
  extractTableValues,
} from 'constants/analyzer'
import CropFilter from 'components/filters/filter-items/crops/crop-select'
import BtnMenu from 'components/ui/BtnMenu';
import { APP_DEFINITIONS } from 'constants/definitions';
import AnalyzerUploadModal from './upload-modal'

// TODO: Remove this file once the analyzer is connected
import RESULT_DATA from './TEMP_DATA.json'

// components
import { DownloadableTable } from 'components/ui/analyzer';

const DATA = extractTableValues(RESULT_DATA)
const HEADERS = Object.keys(DATA[0]).map(k => ({ label: k, value: k }))

const Analyzer = ({ filters, setFilters, toggleModal }) => {
  const [imported, setImported] = useState(false)
  const [mapView, setMapView] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [locations, setLocations] = useState()
  const indicatorKey = filters.indicator ? ID_LOOKUP[filters.indicator] : undefined

  if (!ALLOWED_WATER_INDICATOR_KEYS_BY_SCOPE.supply_chain.includes(indicatorKey)) return null
  
  const indicatorSpec = WATER_INDICATORS[indicatorKey]

  const tab = filters.subscope

  const extractedLocations = !isEmpty(locations) ? extractTableValues({ locations, indicator: indicatorKey }) : undefined
  const headers = !isEmpty(extractedLocations) ? Object.keys(extractedLocations[0]).map(k => ({ label: k, value: k })) : []

  const downloadCSV = (event) => {
    if (event) event.preventDefault();
    const csvExporter = new ExportToCsv({
      showLabels: true,
      filename: `Prioritize Basins Analyzer - ${filters.indicator.name}`,
      headers: headers.map(c => c.label)
    });
    csvExporter.generateCsv(extractedLocations);
  };

  const openUploadModal = () => {
    const { props, ...info } = APP_DEFINITIONS['desired-condition-thresholds']
    toggleModal(true, {
      children: AnalyzerUploadModal,
      size: 'analyzer', // Actually just using this to inject a classname. I don't love this method.
      childrenProps: {
        filters,
        onDone: locations => {
          toggleModal(false)
          setModalOpen(false)
          setLocations(locations)
        }
      }
    });
    setModalOpen(true)
  }

  return (
    <React.Fragment>
      <div className="analyzer-tabs">
        <SegmentedUi
          className="-tabs-light"
          items={[
            { value: 'overall', label: 'Select Crops' },
            { value: 'analyzer', label: 'Supply Chain Analyzer' },
          ]}
          selected={filters.subscope || 'overall'}
          onChange={selected => setFilters({ subscope: selected.value })}
        />
      </div>
      <div className="analyzer">
        {tab !== 'analyzer' && (
          <React.Fragment>
            <div className="row expanded collapse align-justify align-bottom">
              <div className="small-12 medium-6 columns">
                <CropFilter
                  hideHelpIcon
                  crop={filters.crop}
                  irrigation={filters.irrigation}
                  onCropChange={crop => setFilters({ crop: crop.value })}
                  onIrrigationChange={irrigation => setFilters({ irrigation: irrigation.value })}
                />
              </div>
            </div>
          </React.Fragment>
        )}
        {tab === 'analyzer' && (
          <React.Fragment>
            {locations ? (
              <React.Fragment>
                <h4 className="title">Select Map View</h4>
                <div className="my-1">
                  <RadioGroup
                    name="map-view"
                    items={[
                      { value: 'all', label: 'Display all watersheds' },
                      { value: 'priority', label: 'Display priority watersheds' },
                    ]}
                    onChange={selected => setMapView(selected.value)}
                    selected={mapView}
                    className="-inline"
                  />
                </div>
                <h4 className="title">Supply Chain Analyzer Results</h4>
                <p className="subtitle">
                  <strong>{indicatorSpec.name}</strong> with desired condition set to <strong>&lt;{filters.threshold}{indicatorSpec.unit}</strong>
                </p>
                <div className="downloadable-table">
                  <DownloadableTable
                    onExpandTable={() => {}}
                    hideInstructions
                    noExpand // Should expand eventually
                    downloadOptions={[
                      { name: 'CSV', action: () => downloadCSV() }
                    ]}
                  >
                    <CustomTable
                      columns={headers}
                      data={extractedLocations}
                      pagination={{
                        // enabled: data.length > 10,
                        enabled: true,
                        pageSize: 10,
                        page: 0
                      }}
                    />
                  </DownloadableTable>
                </div>
                <div>
                  <button className="action-button" onClick={openUploadModal}>
                    Upload a new file
                  </button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>
                  Import File to find priority watersheds in your supply chain.
                </p>
                <div className='my-1'>
                  <BtnMenu
                    className="-theme-white"
                    items={[
                      {
                        label: 'Import File',
                        cb: () => {
                          openUploadModal()
                          // setImported(true)
                        }
                      }
                    ]}
                  />
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

Analyzer.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default Analyzer;
