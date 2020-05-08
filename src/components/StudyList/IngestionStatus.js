import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Table} from 'semantic-ui-react';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../../state/queries';
import {CHANGE_INGESTION_STATUS} from '../../state/mutations';
import {hasPermission} from '../../common/permissions';
import StatusSelector from './StatusSelector';

const IngestionStatus = ({study}) => {
  const {data: profileData, loading: profileLoading} = useQuery(MY_PROFILE);
  const [changeStatus, {loading: changing}] = useMutation(
    CHANGE_INGESTION_STATUS,
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
      text: 'Unknown',
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

  if (!profileLoading && hasPermission(user, 'change_ingestion_status')) {
    return (
      <Table.Cell
        singleLine
        width="1"
        positive={['COMPLETE'].includes(study.ingestionStatus)}
        error={['UNKNOWN'].includes(study.ingestionStatus)}
        warning={['INPROG'].includes(study.ingestionStatus)}
        data-cy="ingestion status cell"
      >
        <StatusSelector
          loading={changing}
          value={study.ingestionStatus}
          options={options}
          onChange={onChange}
        />
      </Table.Cell>
    );
  }

  return (
    <Table.Cell
      singleLine
      width="1"
      positive={['COMPLETE'].includes(study.ingestionStatus)}
      error={['UNKNOWN'].includes(study.ingestionStatus)}
      warning={['INPROG'].includes(study.ingestionStatus)}
      data-cy="ingestion status cell"
    >
      {options.find(op => op.key === study.ingestionStatus).text}
    </Table.Cell>
  );
};

export default IngestionStatus;
