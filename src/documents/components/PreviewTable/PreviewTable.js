import React from 'react';
import {HotTable} from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const PreviewTable = ({data}) => {
  const settings = {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all',
    editor: false,
    filters: true,
    dropdownMenu: [
      'filter_by_value',
      'filter_by_condition',
      'filter_action_bar',
    ],
    height: window.innerHeight - 340,
  };

  return (
    <HotTable settings={settings} licenseKey="non-commercial-and-evaluation" />
  );
};

export default PreviewTable;
