import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {
  Button,
  Header,
  Label,
  List,
  Table,
  Icon,
  Popup,
  Progress,
  Rating,
} from 'semantic-ui-react';
import CavaticaLogo from '../../assets/CavaticaLogo';

const PopupButton = ({header, content, icon, label}) => (
  <Popup
    inverted
    header={header}
    content={content}
    position="top right"
    trigger={
      <Button icon={icon} style={{position: 'relative'}} content={label} />
    }
  />
);

/**
 * Formats a link to a release
 */
const Release = () => (
  <Link to="/">
    0.1.0{' '}
    <Icon.Group>
      <Icon name="tag" />
      <Icon corner="top right" name="external" />
    </Icon.Group>
  </Link>
);

const ActionButtons = study => (
  <Button.Group icon basic>
    <PopupButton
      header="Study Information"
      content={
        <>
          <p>Missing 4 Fields:</p>
          <List bulleted>
            <List.Item>Attribution</List.Item>
            <List.Item>Organization</List.Item>
            <List.Item>Release Date</List.Item>
          </List>
        </>
      }
      icon="info"
      label={<Label empty corner circular color="orange" />}
    />
    <PopupButton header="Documents" content="hello" icon="file" />
    <PopupButton
      header="Cavatica Projects"
      content="hello"
      icon={<CavaticaLogo className="mr-5 vertical-middle" />}
    />
    <PopupButton header="Collaborators" content="users" icon="users" />
  </Button.Group>
);

const renderRow = node => ({
  key: node.kfId,
  cells: [
    {
      key: 'name',
      content: (
        <Header size="medium">
          <Link to={'/study/' + node.kfId + '/basic-info/info'}>
            {node.name}
          </Link>
          <Header.Subheader>
            {(node.collaborators.edges.length &&
              node.collaborators.edges[0].node.username) ||
              node.shortName}
          </Header.Subheader>
        </Header>
      ),
    },
    {
      key: 'kfId',
      width: 1,
      content: <code>{node.kfId}</code>,
      textAlign: 'center',
    },
    {
      key: 'version',
      textAlign: 'center',
      width: 1,
      content: <Release study={node} />,
    },
    {
      key: 'actions',
      textAlign: 'right',
      content: <ActionButtons study={node} />,
      width: 1,
    },
  ],
});

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  history,
  myProfile,
  isResearch,
}) => {
  if (loading) {
    return <h2>loading studies</h2>;
  }

  const studies = studyList.map(({node}) => node);

  const header = [
    {key: 'name', content: 'Name'},
    {key: 'kfId', content: 'Kids First ID', textAlign: 'center'},
    {key: 'version', content: 'Version', textAlign: 'center'},
    {key: 'actions', content: 'Actions', textAlign: 'center'},
  ];

  return (
    <Table
      singleLine
      striped
      selectable
      sortable
      celled
      headerRow={header}
      tableData={studies}
      renderBodyRow={renderRow}
    />
  );
};

export default withRouter(StudyTable);
