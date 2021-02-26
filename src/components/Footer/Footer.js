import React from 'react';
import {useQuery} from '@apollo/client';
import {STATUS} from '../../state/queries';
import {Container, Segment, Label, List} from 'semantic-ui-react';
import {systemEnvColors} from '../../common/enums';

const Footer = () => {
  const {data} = useQuery(STATUS);
  const status = data && data.status;
  const lastVersion = process.env.REACT_APP_LAST_VERSION;
  const syslevel = process.env.REACT_APP_ENV;
  const commitHash = process.env.REACT_APP_COMMITHASH;

  return (
    <Segment className="footer">
      <Container className="text-10">
        <List horizontal>
          {syslevel !== 'production' && (
            <List.Item>
              <Label
                className="text-10"
                basic
                horizontal
                color={systemEnvColors[syslevel]}
              >
                {syslevel}
              </Label>
            </List.Item>
          )}
          <List.Item>
            UI{' '}
            {lastVersion && lastVersion.split('-').length === 1 ? (
              <a
                href={`https://github.com/kids-first/kf-ui-data-tracker/releases/tag/${lastVersion}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {lastVersion}
              </a>
            ) : (
              <a
                href={`https://github.com/kids-first/kf-ui-data-tracker/commit/${commitHash}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {lastVersion}
              </a>
            )}
          </List.Item>
          {status && (
            <List.Item>
              Study Creator API{' '}
              {status.version.split('-').length === 1 ? (
                <a
                  href={
                    status.version === 'LOCAL'
                      ? '#'
                      : `https://github.com/kids-first/kf-api-study-creator/releases/tag/${status.version}`
                  }
                  rel="noopener noreferrer"
                  target={status.version === 'LOCAL' ? null : '_blank'}
                >
                  {status.version}
                </a>
              ) : (
                <a
                  href={`https://github.com/kids-first/kf-api-study-creator/commit/${
                    status.commit
                  }`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {status.version}
                </a>
              )}
            </List.Item>
          )}
        </List>
      </Container>
    </Segment>
  );
};

export default Footer;
