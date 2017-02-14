import React from 'react';
import { getWidgetSql } from 'utils/filters/filters';
import { Spinner } from 'aqueduct-components';
import { format } from 'd3-format';

export default class SummaryCountry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      country: '',
      loading: false,
      yield: '',
      area: ''
    };
  }

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.filters.country !== this.props.filters.country) || (nextProps.countries.length !== this.props.countries.length)) {
      const country = nextProps.countries.length ? nextProps.countries.find(c => c.id === nextProps.filters.country).name : '';
      this.setState({ country });
    }

    this.getData();
  }

  getData() {
    const sqlConfig = [
      {
        key: 'and',
        keyParams: [
          { key: 'iso' },
          { key: 'year' },
          { key: 'commodity' }
        ]
      }
    ];

    const url = `https://wri-01.carto.com/api/v2/sql?q=
      SELECT impactparameter AS name, sum(value) AS value
      FROM combined01_prepared WHERE impactparameter in ('Area', 'Yield')
      {{and}} group by impactparameter`;
    const config = getWidgetSql({ sqlConfig, paramsConfig: [], data: { url } }, this.props.filters);

    this.setState({ loading: true });

    fetch(new Request(config.data.url))
    .then((response) => {
      if (response.ok) return response.json();
      this.setState({ loading: false });
      throw new Error(response.statusText);
    })
    .then((data) => {
      this.setState({
        loading: false,
        yield: `${format('.3s')(data.rows[0].value)} tons/ha`,
        area: `${format('.3s')(data.rows[1].value)} ha`
      });
    });
  }

  render() {
    return (
      <div className="c-summary">
        <div className="summary-content">
          <span className="summary-title">{`${this.state.country} summary`}</span>
          <Spinner isLoading={this.state.loading} />
          <ul className="summary-list">
            <li>
              <span className="title">Yield</span>
              <span className="amount">{this.state.yield}</span>
            </li>
            <li>
              <span className="title">Area</span>
              <span className="amount">{this.state.area}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

SummaryCountry.propTypes = {
  filters: React.PropTypes.object,
  countries: React.PropTypes.array
};
