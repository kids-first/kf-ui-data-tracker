import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Amplitude} from '@amplitude/react-amplitude';
import TimeAgo from 'react-timeago';
import propTypes from 'prop-types';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
  Container,
  Grid,
  Header,
  Placeholder,
  Popup,
  Icon,
  Input,
  Button,
  Label,
} from 'semantic-ui-react';
import {GET_STUDY_RELEASES} from '../../state/queries';
import {KF_COORD_UI} from '../../common/globals';
import {statusyMessage} from '../../common/enums';

const KfId = ({kfId}) => {
  const [copied, setCopied] = useState(false);

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'kfid']
          : ['kfid'],
      })}
    >
      {({logEvent}) => (
        <Popup
          inverted
          position="top right"
          popperDependencies={[copied]}
          trigger={
            <CopyToClipboard
              text={kfId}
              onCopy={() => {
                setCopied(true);
                logEvent('copy');
                setTimeout(() => {
                  setCopied(false);
                }, 700);
              }}
            >
              <code>{kfId}</code>
            </CopyToClipboard>
          }
          content={
            copied ? <Icon name="check" color="green" /> : 'Copy to clipboard'
          }
        />
      )}
    </Amplitude>
  );
};

const Release = ({release}) => {
  if (!release) {
    return 'No published releases yet';
  }

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'release version']
          : ['release version'],
      })}
    >
      {({logEvent}) => (
        <>
          Last Published Release:{' '}
          <Popup
            header={release.name}
            position="top center"
            trigger={
              <a
                href={`${KF_COORD_UI}/releases/${release.kfId}`}
                onClick={() => logEvent('click')}
              >
                {release.version + ' '}
                <Icon.Group>
                  <Icon name="tag" />
                  <Icon corner="top right" name="external" />
                </Icon.Group>
              </a>
            }
            content={
              <>
                {release.version} <Icon name="tag" /> -{' '}
                <code>{release.kfId}</code>
                <p>
                  Published <TimeAgo date={release.createdAt} />
                </p>
                <em>View in the Release Coordinator</em>
              </>
            }
          />
        </>
      )}
    </Amplitude>
  );
};

const StudyHeader = ({study, loading, newStudy, showModal, updateStudy}) => {
  const [slackInput, setSlackInput] = useState(
    study && study.slackChannel ? study.slackChannel : '',
  );
  const [open, setOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  const submitUpdate = values => {
    updateStudy({
      variables: {
        id: study.id,
        input: values,
      },
    })
      .then(() => {
        setApiErrors(null);
        setOpen(false);
      })
      .catch(err => setApiErrors(err.message));
  };

  const relayId =
    study && Buffer.from('StudyNode:' + study.kfId).toString('base64');
  const {data: releasesData, loading: releasesLoading} = useQuery(
    GET_STUDY_RELEASES,
    {
      variables: {
        id: relayId,
      },
      context: {clientName: 'coordinator'},
    },
  );

  const latestRelease =
    releasesData &&
    releasesData.study &&
    releasesData.study.releases.edges[0].node;

  const currentStatus =
    newStudy && newStudy.length > 0 && newStudy[0].split('_')[2]
      ? newStudy[0].split('_')[2]
      : 'STR';

  if (loading) {
    return (
      <Container>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Container>
    );
  }

  return (
    <Grid container columns={2}>
      <Grid.Column textAlign="left" width={10}>
        <Header as="h1">
          {study.shortName || study.name || 'Unknown study name'}
          {study.name && (
            <Header.Subheader className="study--header-sub">
              {study.name}
            </Header.Subheader>
          )}
        </Header>
      </Grid.Column>
      <Grid.Column textAlign="right" width={6}>
        {study.kfId && (
          <p className="noMargin">
            <KfId kfId={study.kfId} />
          </p>
        )}
        <span className="noMargin display-block">
          {study.slackChannel ? (
            <pre className="display-inline text-blue">
              <Icon name="slack hash" size="small" />
              {study.slackChannel}
            </pre>
          ) : (
            <span>No Slack Channel</span>
          )}
          {updateStudy && (
            <Popup
              on="click"
              position="bottom right"
              header="Edit Slack Channel"
              open={open}
              onOpen={() => {
                setSlackInput(study.slackChannel || '');
                setOpen(true);
              }}
              onClose={() => {
                setApiErrors(null);
                setOpen(false);
              }}
              trigger={
                <Label
                  as={Button}
                  size="mini"
                  primary
                  basic
                  animated="vertical"
                  className="ml-5"
                >
                  <Button.Content hidden>EDIT</Button.Content>
                  <Button.Content className="mr-8" visible>
                    <Icon className="noMargin" name="pencil" />
                  </Button.Content>
                </Label>
              }
              content={
                <>
                  {apiErrors ? (
                    <span className="text-red text-10">{apiErrors}</span>
                  ) : (
                    <>
                      <Input
                        className="mt-6"
                        aria-label="edit slack channel"
                        size="mini"
                        placeholder="slack_channel_name"
                        onChange={(e, {value}) => {
                          setSlackInput(value);
                        }}
                        value={slackInput}
                        action={
                          <Button
                            color="blue"
                            content="SAVE"
                            size="mini"
                            onClick={e => {
                              submitUpdate({slackChannel: slackInput});
                            }}
                          />
                        }
                      />
                    </>
                  )}
                </>
              }
            />
          )}
        </span>
        {releasesLoading ? (
          'Loading releases...'
        ) : (
          <Release release={latestRelease} />
        )}
        {newStudy && newStudy.length > 0 && (
          <p>
            <small
              className={statusyMessage[currentStatus].class}
              onClick={() => {
                showModal(true);
              }}
            >
              <Icon name={statusyMessage[currentStatus].icon} />
              <span className="text-underline">
                {statusyMessage[currentStatus].text}
              </span>
            </small>
          </p>
        )}
      </Grid.Column>
    </Grid>
  );
};

StudyHeader.propTypes = {
  /** the kf_id (SD_XXXXXXX) for the study  */
  kfId: propTypes.string,
  /** datetime of when the study was last updated */
  modifiedAt: propTypes.string,
  /** user friendly name for the study  */
  shortName: propTypes.string,
  /** long programatic name for the study  */
  name: propTypes.string,
  /** Loading state of the study header*/
  loading: propTypes.bool,
};

const AnalyticsWrapper = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'study header']
        : ['study header'],
    })}
  >
    <StudyHeader {...props} />
  </Amplitude>
);

export default AnalyticsWrapper;
