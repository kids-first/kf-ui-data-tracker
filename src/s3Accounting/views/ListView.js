import {
  Container,
  Header,
  Icon,
  Message,
  Placeholder,
  Segment,
  Table,
} from 'semantic-ui-react';

import {ALL_STORAGE_ANALYSES} from '../queries';
import {Helmet} from 'react-helmet';
import {ImageMessage} from '../../components/ImageMessage';
import KfId from '../../components/StudyList/KfId';
import {MY_PROFILE} from '../../state/queries';
import React from 'react';
import TimeAgo from 'react-timeago';
import {hasPermission} from '../../common/permissions';
import {longDate} from '../../common/dateUtils';
import s3 from '../../assets/s3.png';
import {useHistory} from 'react-router-dom';
import {useQuery} from '@apollo/client';

const ListView = ({match}) => {
  const history = useHistory();

  const {data: profileData, loading: myProfileLoading} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;

  const {loading, error, data} = useQuery(ALL_STORAGE_ANALYSES);
  const storageAnalyses =
    data && data.allStorageAnalyses.edges.length > 0
      ? data.allStorageAnalyses.edges
      : [];
  console.log(myProfile);
  if (
    !myProfileLoading &&
    myProfile &&
    !hasPermission(myProfile, 'list_all_storageanalysis')
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

  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Header as="h3" className="mt-15 mb-15">
          <Icon name="chart bar" />
          S3 Accounting Reports
        </Header>
        <p className="text-grey">
          View snapshots of your study's data files in cloud storage and compare
          them against the file upload manifests that your users submitted. This
          will help you understand the differential between what a user tried to
          upload and what actually got uploaded to your cloud storage.
        </p>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );

  if (error)
    return (
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>{`KF Data Tracker - S3 Accounting - Error`}</title>
        </Helmet>
        <Header as="h3" className="mt-15 mb-15">
          <Icon name="chart bar" />
          S3 Accounting Reports
        </Header>
        <p className="text-grey">
          View snapshots of your study's data files in cloud storage and compare
          them against the file upload manifests that your users submitted. This
          will help you understand the differential between what a user tried to
          upload and what actually got uploaded to your cloud storage.
        </p>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - S3 Accounting`}</title>
      </Helmet>
      <Header as="h3" className="mt-15 mb-15">
        <Icon name="chart bar" />
        S3 Accounting Reports
      </Header>
      <p className="text-grey">
        View snapshots of your study's data files in cloud storage and compare
        them against the file upload manifests that your users submitted. This
        will help you understand the differential between what a user tried to
        upload and what actually got uploaded to your cloud storage.
      </p>
      {storageAnalyses.length > 0 ? (
        <Table
          singleLine
          stackable
          selectable
          compact
          celled
          className="mt-30 mb-50"
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Study Name</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Study ID</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Updated At</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Files Found
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Files Missing
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Files Moved
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {storageAnalyses.map(({node}) => {
              const audit = node.stats
                ? JSON.parse(node.stats).audit
                : {
                    matched: {total_count: '-'},
                    missing: {total_count: '-'},
                    moved: {total_count: '-'},
                  };
              return (
                <Table.Row
                  key={node.id}
                  onClick={() =>
                    history.push(`/s3-accounting/${node.study.kfId}#comparison`)
                  }
                >
                  <Table.Cell>{node.study.shortName}</Table.Cell>
                  <KfId kfId={node.study.kfId} key={node.study.kfId} />
                  <Table.Cell textAlign="center">
                    <TimeAgo
                      date={node.refreshedAt}
                      live={false}
                      title={longDate(node.refreshedAt)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center" className="text-green">
                    {audit.matched.total_count}
                  </Table.Cell>
                  <Table.Cell textAlign="center" className="text-red">
                    {audit.missing.total_count}
                  </Table.Cell>
                  <Table.Cell textAlign="center" className="text-yellow">
                    {audit.moved.total_count}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <Container Container textAlign="center" className="mt-6">
          <Header disabled as="h5" className="mt-30 mb-15">
            No data avaliable
          </Header>
        </Container>
      )}
    </Container>
  );
};

export default ListView;
