import {Button, Popup} from 'semantic-ui-react';

import {FLATFILE_LICENSE_KEY} from '../../../common/globals';
import {FlatfileButton} from '@flatfile/react';
import React from 'react';
import TSV from 'tsv';

/**
 * FlatFile component for column mapping before document created
 */

const FlatFile = ({flatfileSettings, dataSource, setMappedData, fileName}) => {
  var CSV = require('tsv').CSV;
  if (
    flatfileSettings.length > 0 &&
    !flatfileSettings.startsWith('ERROR: ') &&
    dataSource
  ) {
    return (
      <Button
        as={FlatfileButton}
        type="button"
        labelPosition="right"
        icon="lightbulb"
        content="Start Mapping"
        color="violet"
        licenseKey={FLATFILE_LICENSE_KEY}
        customer={{
          companyId: 'CHOP',
          companyName: 'CHOP',
          email: 'test@example.com',
          name: 'Admin',
          userId: 'admin',
        }}
        settings={JSON.parse(flatfileSettings)}
        onData={async results => {
          const processedData = results.allData.map(row => {
            const keys = Object.keys(row);
            var formatedRow = {};
            keys.map(key => {
              if (key.startsWith('$')) {
                Object.keys(row[key]).map(k => {
                  formatedRow[k] = row[key][k];
                  return true;
                });
              } else {
                formatedRow[key] = row[key];
              }
              return true;
            });
            return formatedRow;
          });
          if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            setMappedData(processedData);
          } else if (fileName.endsWith('.tsv')) {
            setMappedData(TSV.stringify(processedData));
          } else if (fileName.endsWith('.csv')) {
            setMappedData(CSV.stringify(processedData));
          }
          return 'Done!';
        }}
        source={dataSource}
      />
    );
  } else {
    return (
      <Popup
        position="top center"
        disabled={flatfileSettings.length === 0}
        trigger={
          <div>
            <Button
              disabled
              labelPosition="right"
              icon="lightbulb"
              content="Start Mapping"
              color="violet"
            />
          </div>
        }
      >
        <small className="text-red">
          {dataSource
            ? flatfileSettings
            : 'Invalid file type. File mapping supports .csv .tsv .xlsx and .xls file.'}
        </small>
      </Popup>
    );
  }
};

export default FlatFile;
