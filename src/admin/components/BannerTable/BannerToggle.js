import React, {useState} from 'react';
import {Table, Radio} from 'semantic-ui-react';
import {useHistory} from 'react-router-dom';

const BannerToggle = ({displayed, isActive, bannerId, updateBanner}) => {
  const history = useHistory();
  const [enabled, setEnabled] = useState(isActive);
  const toggle = e => {
    setEnabled(!enabled);

    let data = {
      variables: {
        input: {enabled: !enabled},
        id: bannerId,
      },
    };
    updateBanner(data)
      .then(resp => {
        history.push(`/banners`);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Table.Cell>
      <Radio
        toggle
        label={displayed ? 'Displayed' : ''}
        checked={enabled}
        onChange={toggle}
        disabled={!updateBanner}
      />
    </Table.Cell>
  );
};

export default BannerToggle;
