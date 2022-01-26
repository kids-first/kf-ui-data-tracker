import {
  Button,
  Container,
  Header,
  Icon,
  Menu,
  Segment,
} from 'semantic-ui-react';
import React, {useState} from 'react';

import {ALL_STORAGE_ANALYSES} from '../queries';
import ComparisonTab from '../components/ComparisonTab';
import FileUploadsTab from '../components/FileUploadsTab';
import {Helmet} from 'react-helmet';
import {ImageMessage} from '../../components/ImageMessage';
import {MY_PROFILE} from '../../state/queries';
import S3InventoryTab from '../components/S3InventoryTab';
import {hasPermission} from '../../common/permissions';
import s3 from '../../assets/s3.png';
import {useQuery} from '@apollo/client';

const DetailView = ({match, history}) => {
  const [tab, setTab] = useState(0);
  const {data: profileData, loading: myProfileLoading} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;

  const {loading, error, data} = useQuery(ALL_STORAGE_ANALYSES, {
    variables: {
      studyKfId: match.params.studyId,
    },
  });
  const storageAnalyses =
    data && data.allStorageAnalyses.edges.length > 0
      ? data.allStorageAnalyses.edges[0].node
      : {};
  const study = storageAnalyses && storageAnalyses.study;
  const studyName = study ? study.name || study.shortName : 'Uknown Study';

  const navTab = [
    {
      tab: 'Comparison',
      hash: '#comparison',
    },
    {
      tab: 'S3 Inventory',
      hash: '#s3-inventory',
    },
    {
      tab: 'File Uploads',
      hash: '#file-uploads',
    },
  ];

  if (
    !myProfileLoading &&
    myProfile &&
    !(
      hasPermission(myProfile, 'list_all_storageanalysis') ||
      hasPermission(myProfile, 'list_all_fileaudits')
    )
  )
    return (
      <ImageMessage
        image={s3}
        title="There was a problem retrieving S3 accounting reports"
        message={
          <>
            You may not have been granted permissions for analysis of files in
            study's a cloud storage. <br /> Please contact us at{' '}
            <a href="mailto:support@kidsfirstdrc.org">
              support@kidsfirstdrc.org
            </a>
          </>
        }
      />
    );

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - S3 Accounting`}</title>
      </Helmet>
      <Button
        basic
        primary
        compact
        size="mini"
        floated="right"
        className="mt-15"
        content={match.params.studyId}
        onClick={() =>
          history.push(`/study/${match.params.studyId}/basic-info/info`)
        }
      />
      <Header as="h4" className="mt-15 mb-15">
        <Icon name="chart bar" />
        {studyName}
      </Header>
      <p className="text-grey">
        View snapshots of your study's data files in cloud storage and compare
        them against the file upload manifests that your users submitted. This
        will help you understand the differential between what a user tried to
        upload and what actually got uploaded to your cloud storage.
      </p>
      <Menu color="blue" compact secondary pointing>
        {navTab.map((item, i) => (
          <Menu.Item
            key={i}
            name={item.tab}
            active={tab === i}
            onClick={() => {
              setTab(i);
              window.history.pushState(
                {},
                '',
                history.location.pathname + navTab[i].hash,
              );
            }}
          >
            {item.tab}
          </Menu.Item>
        ))}
      </Menu>
      {tab === 0 && (
        <ComparisonTab
          match={match}
          loading={loading}
          error={error}
          data={data}
        />
      )}
      {tab === 1 && (
        <S3InventoryTab
          match={match}
          loading={loading}
          error={error}
          data={data}
        />
      )}
      {tab === 2 && (
        <FileUploadsTab
          match={match}
          loading={loading}
          error={error}
          data={data}
        />
      )}
    </Container>
  );
};
export default DetailView;
