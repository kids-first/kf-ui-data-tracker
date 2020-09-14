import React, {useState, useEffect} from 'react';
import {
  Button,
  Header,
  Modal,
  Icon,
  Segment,
  Container,
  Placeholder,
  Message,
} from 'semantic-ui-react';
import {fileSortedVersions} from '../utilities';
import {KF_STUDY_API} from '../../common/globals';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CopyButton from '../../components/CopyButton/CopyButton';

/**
 * A skeleton placeholder for the loading state
 */
const HeaderSkeleton = () => (
  <Container as={Segment} basic>
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
    </Placeholder>
  </Container>
);

const ExtractConfigModal = ({studyId, fileNode, onCloseDialog}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState('');
  const versionId = fileSortedVersions(fileNode)[0].node.kfId;
  const configUrl = `${KF_STUDY_API}/extract_config/study/${studyId}/file/${
    fileNode.kfId
  }/version/${versionId}`;
  const getData = () => {
    setLoading(true);
    fetch(configUrl, {
      headers: new Headers({
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      }),
    }).then(function(res) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      reader.read().then(function(result) {
        const contents = decoder.decode(result.value);
        if (res.ok) {
          setData(contents);
        } else {
          setError(contents);
        }
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    if (configUrl && data.length === 0 && error.length === 0) {
      getData();
    }
  });

  return (
    <Modal open={true} onClose={onCloseDialog} closeIcon>
      <Header>
        {'Document Config: ' + fileNode.name + ' - '}
        <code>{versionId + '_config.py'}</code>
      </Header>
      <Modal.Content scrolling>
        {loading && <HeaderSkeleton />}
        {data.length > 0 && (
          <SyntaxHighlighter
            className="mt-0"
            language="python"
            style={atomOneLight}
          >
            {data}
          </SyntaxHighlighter>
        )}
        {error.length > 0 && (
          <Message
            warning
            icon="warning sign"
            header="Failed to extract config file"
            content={error}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <CopyButton
          disabled={data.length <= 0 && error.length > 0}
          textToCopy={data || ''}
          text="COPY CODE"
          color="blue"
          labelPosition="left"
          size="mini"
          position="top left"
          tooltip="Copy download link"
        />
        <Button
          disabled={data.length <= 0 && error.length > 0}
          color="yellow"
          icon
          labelPosition="left"
          size="mini"
          onClick={() => window.open(configUrl, '_blank')}
        >
          <Icon name="download" />
          DOWNLOAD CONFIG
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ExtractConfigModal;
