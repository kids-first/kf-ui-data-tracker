import React from 'react';
import {Container, Segment, Label, List} from 'semantic-ui-react';
import {systemEnvColors} from '../../common/enums';

const Footer = () => {
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
          <List.Item className="noMargin">
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
        </List>
      </Container>
    </Segment>
  );
};

export default Footer;
