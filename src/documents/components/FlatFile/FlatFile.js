import React from 'react';
import {Button, Popup} from 'semantic-ui-react';
import {FlatfileButton} from '@flatfile/react';
const {parse} = require('json2csv');

/**
 * FlatFile component for column mapping before document created
 */

const LICENSE_KEY = 'e118c06a-55ed-47be-90e4-26feb38c3934';

const FlatFile = ({flatfileSettings, history}) => {
  if (flatfileSettings.length > 0 && !flatfileSettings.startsWith('ERROR: ')) {
    return (
      <Button
        as={FlatfileButton}
        labelPosition="right"
        icon="lightbulb"
        content="Try New Upload"
        color="violet"
        licenseKey={LICENSE_KEY}
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
          const fileName = results.fileName || 'data.csv';
          var file = new File([parse(processedData)], fileName, {
            type: 'text/plain',
          });
          history.push('documents/upload', {file});
          window.location.reload(false);
          return 'Done!';
        }}
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
              content="Try New Upload"
              color="violet"
            />
          </div>
        }
      >
        <small className="text-red">{flatfileSettings}</small>
      </Popup>
    );
  }
};

export default FlatFile;
