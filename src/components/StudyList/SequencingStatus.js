import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../../state/queries';
import {CHANGE_SEQUENCING_STATUS} from '../../state/mutations';
import {hasPermission} from '../../common/permissions';
import StatusSelector from './StatusSelector';

const SequencingStatus = ({study}) => {
  const {data: profileData, loading: profileLoading} = useQuery(MY_PROFILE);
  const [changeStatus, {loading: changing}] = useMutation(
    CHANGE_SEQUENCING_STATUS,
    {
      refetchQueries: [
        {
          query: GET_STUDY_BY_ID,
          variables: {
            kfId: study.kfId,
          },
        },
      ],
    },
  );

  const user = profileData && profileData.myProfile;

  const onChange = (ev, {value}) =>
    changeStatus({variables: {study: study.id, data: {status: value}}});

  const options = [
    {
      key: 'UNKNOWN',
      text: 'Unkown',
      value: 'UNKNOWN',
    },
    {
      key: 'NOTSTART',
      text: 'Not Started',
      value: 'NOTSTART',
    },
    {
      key: 'INPROG',
      text: 'In Progress',
      value: 'INPROG',
    },
    {
      key: 'COMPLETE',
      text: 'Complete',
      value: 'COMPLETE',
    },
  ];

  if (!profileLoading && hasPermission(user, 'change_sequencing_status')) {
    return (
      <StatusSelector
        loading={changing}
        value={study.sequencingStatus}
        options={options}
        onChange={onChange}
      />
    );
  }

  return options.find(op => op.key === study.sequencingStatus).text;
};

export default SequencingStatus;
