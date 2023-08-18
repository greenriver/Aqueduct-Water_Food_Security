/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable constructor-super */
import React, { PureComponent } from 'react';

export default class NewUpdatesModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidMount() {
    if (!localStorage.getItem('updateModalFood')) {
      this.setState({ show: true });
    }
  }

  closeUpdatesModal() {
    localStorage.setItem('updateModalFood', 'true');
    this.setState({ show: false });
  }

  render() {
    const { show } = this.state;
    return show ? (
      <div className="updates-modal">
        <header>
          <button type="button" onClick={() => this.closeUpdatesModal()}>X</button>
        </header>
        <p>Aqueduct Food data does not yet use the Aqueduct 4.0 methodology and is
          not comparable to the Water Risk Atlas and Country Rankings. We will
          update it soon. Thank you for your patience. For more information, please click &nbsp;
          <a target="_blank" href="https://www.wri.org/research/aqueduct-40-updated-decision-relevant-global-water-risk-indicators?auHash=74cRjEQPsH0NDpgT1NqIfNpqV-QpYNR4oiPo1HRhpGs">here</a>.
        </p>
      </div>
    ) : null;
  }
}
