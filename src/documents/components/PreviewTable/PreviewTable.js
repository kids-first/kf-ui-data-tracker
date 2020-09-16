import React from 'react';
import {HotTable} from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const PreviewTable = ({data}) => {
  const settings = {
    data: data.slice(1),
    rowHeaders: true,
    colHeaders: data[0],
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
    columnSorting: true,
  };

  return (
    <HotTable settings={settings} licenseKey="non-commercial-and-evaluation" />
  );
};

export default PreviewTable;
