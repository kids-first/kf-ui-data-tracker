import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Amplitude} from '@amplitude/react-amplitude';
import EditDocumentForm from '../forms/EditDocumentForm';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import {CREATE_FILE} from '../mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {
  Card,
  Divider,
  Message,
  Segment,
  Container,
  Button,
  Header,
  Icon,
  Label,
  Table,
  Popup,
  Statistic,
  Form,
  Radio,
} from 'semantic-ui-react';
import {fileTypeDetail} from '../../common/enums';
import {Formik, Field} from 'formik';
import {lengthLimit} from '../utilities';

const Item = ({id, name, disabled, selected}) => (
  <Card
    link
    image={
      <center>
        <Icon
          name={fileTypeDetail[id].icon}
          size="large"
          bordered
          circular
          inverted
          color={disabled ? 'grey' : selected ? 'blue' : 'black'}
        />
      </center>
    }
    size="small"
    color={disabled ? 'grey' : selected ? 'blue' : null}
    header={fileTypeDetail[id].title}
    description={[fileTypeDetail[id].description].join('')}
    extra={
      disabled ? (
        <>
          <Icon name="warning" color="red" />
          File is missing columns 'sample_type', 'tissue_type'
        </>
      ) : (
        ''
      )
    }
  />
);
const Item2 = ({id, name, disabled, selected}) => (
  <Segment
    compact
    secondary={disabled}
    color={disabled ? 'grey' : selected ? 'blue' : null}
    className="selectionRadio--card"
  >
    <Radio
      name={name}
      id={id}
      value={id}
      label={() => (
        <Icon
          name={fileTypeDetail[id].icon}
          size="large"
          bordered
          circular
          inverted
          color={disabled ? 'grey' : selected ? 'blue' : null}
        />
      )}
    />
    <div>
      <p className="mb-5">
        <b>{fileTypeDetail[id].title}</b>
      </p>
      <p className="text-wrap-75 text-grey">{fileTypeDetail[id].description}</p>
    </div>
  </Segment>
);

const FileTable = () => (
  <Table compact="very" definition>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell width="2">Column</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Uniques</Table.HeaderCell>
        <Table.HeaderCell>Nulls</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>participant_id</Table.Cell>
        <Table.Cell>int</Table.Cell>
        <Table.Cell>999</Table.Cell>
        <Table.Cell>0</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>sex</Table.Cell>
        <Table.Cell>enum</Table.Cell>
        <Table.Cell>3</Table.Cell>
        <Table.Cell>20</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>biospecimen_id</Table.Cell>
        <Table.Cell>string</Table.Cell>
        <Table.Cell>1229</Table.Cell>
        <Table.Cell>23</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>shipmentDate</Table.Cell>
        <Table.Cell>datetime</Table.Cell>
        <Table.Cell>1229</Table.Cell>
        <Table.Cell>0</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

/**
 * The NewDocumentView displays a form to collect details about a new file.
 * It expects that the user lands on the page after being forwarded from a
 * file browser dialog and a file present in `location.state.file` as
 * populated by the router (eg: history.push('/new', {state: <File>}) )
 */
const NewDocumentView = ({match, history, location}) => {
  // Tracks any error state reported from the server
  const [errors, setErrors] = useState('');
  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
  });
  const [createDocument] = useMutation(CREATE_FILE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {query: GET_STUDY_BY_ID, variables: {kfId: match.params.kfId}},
    ],
    onError: error => {
      setErrors(error.message);
    },
  });

  const studyFiles =
    study.data && study.data.study ? study.data.study.files.edges : [];

  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.file) {
    history.push(`/study/${match.params.kfId}/documents`);
    return <></>;
  }

  const handleSubmit = (fileName, fileType, fileDescription) => {
    const studyId = match.params.kfId;
    const file = location.state.file;
    createDocument({
      variables: {
        file,
        studyId,
        name: fileName,
        fileType,
        description: fileDescription,
        tags: [],
      },
    }).then(resp => {
      history.push(`/study/${studyId}/documents`);
    });
  };
  return (
    <Container as={Segment} vertical basic>
      <Header as="h2">Upload a New Document</Header>
      <p className="text-wrap-75">
        Add a new document to this study to aid the Kids First Data Coordinating
        Center in processing for release.
      </p>
      <Divider />
      <b>Uploaded File:</b> {lengthLimit(location.state.file.name, 80)}
      <Icon className="ml-5" name="upload" color="blue" />
      <Label pointing="left" content="Upload new file" />
      <Header size="small">File Summary</Header>
      <Statistic.Group size="small" widths="4">
        <Statistic label="Columns" value="4" />
        <Statistic label="Rows" value="1229" />
        <Statistic label="Data Types" value="4" />
        <Statistic label="Disk Size" value="23MB" />
      </Statistic.Group>
      <FileTable />
      <Divider />
      <Container as={Segment} vertical basic>
        <Header as="h3">Tell us about your document</Header>
        <p className="text-wrap-75">
          Help us process and harmonize your study faster by categorizing and
          describing the document you are about to upload. If you have any
          questions, please contact us at{' '}
          <a href="mailto:support@kidsfirstdrc.org?subject=Kids First Data Tracker Help&body=Hello, I would like to upload a <insert_document_description_here> and am having trouble with the upload function">
            support@kidsfirstdrc.org
          </a>
          .
        </p>
        {errors && (
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={errors}
          />
        )}
      </Container>
      <Header>
        Document Type
        <Header.Subheader>
          Select which type of document this is. The Data Coordinating Center
          requires that files adhere to the proper <a>format guidelines</a> for
          the respective file types.
        </Header.Subheader>
      </Header>
      <Card.Group itemsPerRow={3}>
        {Object.keys(fileTypeDetail).map((item, i) => (
          <Item
            id={item}
            name={item}
            selected={i === 0}
            disabled={i !== 0 && i !== 4 && i !== 5}
          />
        ))}
      </Card.Group>
      <Header>
        Document Name
        <Header.Subheader>
          The document will use this display name in the Data Tracker.
        </Header.Subheader>
      </Header>
      <Form.Input label="Name:" fluid />
      <Header>
        Document Description
        <Header.Subheader>
          The document will use this display name in the Data Tracker.
        </Header.Subheader>
      </Header>
      <Segment>
        <MarkdownEditor />
      </Segment>
      <Button primary content="Upload" floated="right" />
      <Segment padded basic />
    </Container>
  );
};

export default NewDocumentView;
