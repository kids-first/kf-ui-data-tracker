import React from 'react';
import {Dropdown} from 'semantic-ui-react';

/**
 * A wrapper around the Dropdown component that provides sorting and display
 * specific for selecting one or multiple studies.
 */
const StudySelector = ({studies, ...props}) => {
  const options =
    studies && studies.length > 0
      ? studies
          .sort(({node: n1}, {node: n2}) => n1.kfId.localeCompare(n2.kfId))
          .map(({node}) => ({
            key: node.id,
            value: node.name,
            content: (
              <>
                <b>{node.kfId}</b> - {node.name}
              </>
            ),
            study: node,
          }))
      : [];

  const search = (options, query) => {
    return options.filter(({study: s}) =>
      [s.kfId, s.name, s.shortName]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  };

  const renderLabel = (item, index, defaultLabelProps) => {
    return item;
  };

  return (
    <Dropdown
      multiple
      selection
      search={search}
      options={options}
      renderLabel={renderLabel}
      {...props}
    />
  );
};

export default StudySelector;
