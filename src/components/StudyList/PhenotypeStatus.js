import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Table} from 'semantic-ui-react';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../../state/queries';
import {CHANGE_PHENOTYPE_STATUS} from '../../state/mutations';
import {hasPermission} from '../../common/permissions';
import StatusSelector from './StatusSelector';

const PhenotypeStatus = ({study}) => {
  const {data: profileData, loading: profileLoading} = useQuery(MY_PROFILE);
  const [changeStatus, {loading: changing}] = useMutation(
    CHANGE_PHENOTYPE_STATUS,
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
      key: 'NOTRECEIVED',
      text: 'Not Received',
      value: 'NOTRECEIVED',
    },
    {
      key: 'INREVIEW',
      text: 'In Review',
      value: 'INREVIEW',
    },
    {
      key: 'APPROVED',
      text: 'Approved',
      value: 'APPROVED',
    },
  ];

  if (!profileLoading && hasPermission(user, 'change_phenotype_status')) {
    return (
      <Table.Cell
        singleLine
        width="1"
        positive={['APPROVED'].includes(study.phenotypeStatus)}
        error={['UNKNOWN'].includes(study.phenotypeStatus)}
        warning={['INREVIEW'].includes(study.phenotypeStatus)}
        data-cy="phenotype status cell"
      >
        <StatusSelector
          loading={changing}
          value={study.phenotypeStatus}
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
      positive={['APPROVED'].includes(study.phenotypeStatus)}
      error={['UNKNOWN'].includes(study.phenotypeStatus)}
      warning={['INREVIEW'].includes(study.phenotypeStatus)}
      data-cy="phenotype status cell"
    >
      {options.find(op => op.key === study.phenotypeStatus).text}
    </Table.Cell>
  );
};

export default PhenotypeStatus;
