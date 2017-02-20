import React from 'react';
import { OnlyOn } from 'aqueduct-components';
import ComparePageDesktop from './Content/Desktop';
import ComparePageMobile from './Content/Mobile';

export default function ComparePage(props) {
  return (
    <div>
      <OnlyOn device="mobile">
        <ComparePageMobile {...props} />
      </OnlyOn>
      <OnlyOn device="desktop">
        <ComparePageDesktop {...props} />
      </OnlyOn>
    </div>
  );
}
