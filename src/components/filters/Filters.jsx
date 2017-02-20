import React from 'react';


// Components
import InfoModal from 'components/modal/InfoModal';
import AppDefinitions from 'data/app-definitions.json';
import {
  CheckboxGroup,
  SegmentedUi,
  Accordion,
  Icon,
  Timeline,
  RadioGroup,
  CustomSelect
} from 'aqueduct-components';
import { Link } from 'react-router';

// Filter options
import {
  waterOptions,
  foodOptions,
  scopeOptions,
  yearOptions,
  cropOptions,
  irrigationOptions,
  changeFromBaselineOptions
} from 'constants/filters';

import CountrySelect from 'containers/countries/CountrySelect';

export default class Filters extends React.Component {

  constructor(props) {
    super(props);

    // State
    this.state = {
      countryToCompare: null
    };

    // Bindings
    this.updateFilters = this.updateFilters.bind(this);
  }

  updateFilters(value, field) {
    const newFilter = {
      [field]: value
    };
    this.props.setFilters(newFilter);
  }

  openModal(slug) {
    this.props.toggleModal(true, {
      children: InfoModal,
      childrenProps: {
        info: AppDefinitions[slug]
      }
    });
  }

  render() {
    const timeline = (
      <div className="filter-item">
        {/* Year */}
        <div className="c-select">
          <div className="select-header">
            <span className="title">Timeframe</span>
            <button
              className="icon-container"
              onClick={() => this.openModal('timeframe')}
            >
              <Icon
                name="icon-question"
                className="title-icon"
              />
          </button>
          </div>
          <Timeline
            items={yearOptions}
            selected={yearOptions.find(i => i.value === this.props.filters.year)}
            onChange={(selected) => {
              selected && selected.value === 'baseline' && this.updateFilters(false, 'changeFromBaseline');
              selected && this.updateFilters(selected.value, 'year');
            }}
          />
          {this.props.filters.year !== 'baseline' &&
            <RadioGroup
              className="-filters"
              items={changeFromBaselineOptions}
              name="changeFromBaseline"
              defaultValue={this.props.filters.changeFromBaseline.toString()}
              onChange={selected => this.updateFilters(selected.value, 'changeFromBaseline')}
            />
          }
        </div>
      </div>
    );

    const columnClassName = 'small-12 medium-4 columns';
    return (
      <div className={`c-filters ${this.props.className ? this.props.className : ''}`}>
        {/* Scope */}
        {this.props.withScope &&
          <div className="filters-lead">
            <div className="row expanded collapse">
              <div className="small-12 column">
                <SegmentedUi
                  className="-tabs"
                  items={scopeOptions}
                  selected={this.props.filters.scope}
                  onChange={selected => this.updateFilters(selected.value, 'scope')}
                />
              </div>
            </div>
          </div>
        }
        <Accordion className="-filters" opened contentPosition="top" toggleIcon={<Icon name="icon-arrow-up-2" className="filters-collapse-btn" />}>
          <div>
            {this.props.withScope && this.props.filters.scope === 'country' &&
              <div className="filters-section -highlighted">
                <div className="row expanded collapse filters-group -commodities">
                  <div className="small-12 medium-4 columns">
                    <div className="filter-item">
                      {/* Country */}
                      <span className="title">Select a Country</span>
                      <CountrySelect
                        value={this.props.filters.country !== 'null' ? this.props.filters.country : null}
                        onValueChange={selected => this.updateFilters(selected && selected.value, 'country')}
                      />
                    </div>
                  </div>
                  <div className="small-12 medium-4 columns">
                    <div className="filter-item">
                      {/* Country to compare with */}
                      <span className="title">Compare With</span>
                      <CountrySelect
                        className={this.props.filters.country ? '' : '-disabled'}
                        placeholder={this.props.className === '-mobile' ? 'Compare with...' : 'Country name...'}
                        value={this.state.countryToCompare}
                        onValueChange={selected => this.setState({ countryToCompare: selected.value })}
                      />
                    </div>
                  </div>
                  <div className="small-12 medium-4 columns">
                    <div className="filter-item">
                      {/* Compare */}
                      {
                        <Link
                          className={`c-btn -filters -fluid ${this.state.countryToCompare ? '' : '-disabled'}`}
                          to={`/compare?countries=${this.props.filters.country},${this.state.countryToCompare}`}
                        >
                          Compare
                        </Link>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className="filters-section">
              <div className="row expanded collapse filters-group">
                <div className={columnClassName}>
                  {/* Crops */}
                  <div className="filter-item">
                    <div className="c-select">
                      <div className="select-header">
                        <span className="title">Crops</span>
                        <button
                          className="icon-container"
                          onClick={() => this.openModal('crops')}
                        >
                          <Icon
                            name="icon-question"
                            className="title-icon"
                          />
                      </button>
                      </div>
                      <CustomSelect
                        className="-no-search"
                        options={cropOptions}
                        value={this.props.filters.crop}
                        onValueChange={selected => selected && this.updateFilters(selected.value, 'crop')}
                      />
                    </div>
                    <CheckboxGroup
                      items={irrigationOptions}
                      onChange={selected => this.updateFilters(selected, 'irrigation')}
                      selected={this.props.filters.irrigation}
                      className="-inline"
                    />
                  </div>
                </div>
                <div className={columnClassName}>
                  {/* Water */}
                  <div className="filter-item">
                    <div className="c-select">
                      <div className="select-header">
                        <span className="title">Water Risk</span>
                        <button
                          className="icon-container"
                          onClick={() => this.openModal('water-risk')}
                        >
                          <Icon
                            name="icon-question"
                            className="title-icon"
                          />
                        </button>
                      </div>
                      <CustomSelect
                        options={waterOptions}
                        value={this.props.filters.water}
                        onValueChange={selected => selected && this.updateFilters(selected.value, 'water')}
                      />
                    </div>
                  </div>
                </div>
                <div className={columnClassName}>
                  {/* Food */}
                  <div className="filter-item">
                    <div className="c-select">
                      <div className="select-header">
                        <span className="title">Country data</span>
                        <button
                          className="icon-container"
                          onClick={() => this.openModal('country-data')}
                        >
                          <Icon
                            name="icon-question"
                            className="title-icon"
                          />
                        </button>
                      </div>
                      <CustomSelect
                        className={this.props.filters.scope === 'country' ? '-disabled -no-search' : '-no-search'}
                        options={foodOptions}
                        value={this.props.filters.food}
                        onValueChange={selected => selected && this.updateFilters(selected.value, 'food')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="filters-section -mobile-spacing">
              <div className="row expanded collapse filters-group">
                <div className="small-12 columns">
                  {timeline}
                </div>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    );
  }
}

Filters.propTypes = {
  setFilters: React.PropTypes.func,
  filters: React.PropTypes.object,
  withScope: React.PropTypes.bool,
  className: React.PropTypes.string,
  toggleModal: React.PropTypes.func
};
