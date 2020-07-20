import React, {useState} from 'react';
import {Button, Dropdown, Modal, Icon, List, Table} from 'semantic-ui-react';

const concepts = [
  'PARTICIPANT.ID',
  'PARTICIPANT.GENDER',
  'BIOSPECIMEN.ID',
  'PHENOTYPE.OBSERVED',
  'PHENOTYPE.EVENT_AGE_DAYS',
  'PHENOTYPE.NAME',
  'PARTICIPANT.MOTHER_ID',
  'PARTICIPANT.FATHER_ID',
];
const options = concepts.map(c => ({key: c, value: c, text: c}));

const ConceptDropdown = () => (
  <Dropdown options={options} fluid clearable search selection />
);

const constants = ['GENDER.FEMALE', 'GENDER.MALE', 'GENDER.NULL'];
const constantOptions = constants.map(c => ({key: c, value: c, text: c}));
const ConstantDropdown = () => (
  <Dropdown options={constantOptions} fluid clearable search selection />
);

const ColumnTable = ({showEnumModal}) => (
  <Table compact="very" definition>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell width="2">Column</Table.HeaderCell>
        <Table.HeaderCell width="4">Concept Mapping</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Uniques</Table.HeaderCell>
        <Table.HeaderCell>Nulls</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>participant_id</Table.Cell>
        <Table.Cell>
          <ConceptDropdown />
        </Table.Cell>
        <Table.Cell>ID</Table.Cell>
        <Table.Cell>999</Table.Cell>
        <Table.Cell>0</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>gender</Table.Cell>
        <Table.Cell>
          <ConceptDropdown />
        </Table.Cell>
        <Table.Cell>
          enum - <a href="/">2/3 values mapped</a>{' '}
          <Button onClick={() => showEnumModal()} primary icon="wrench" />
        </Table.Cell>
        <Table.Cell>3</Table.Cell>
        <Table.Cell>0</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Father</Table.Cell>
        <Table.Cell>
          <ConceptDropdown />
        </Table.Cell>
        <Table.Cell>ID</Table.Cell>
        <Table.Cell>1229</Table.Cell>
        <Table.Cell>23</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Mother</Table.Cell>
        <Table.Cell>
          <ConceptDropdown />
        </Table.Cell>
        <Table.Cell>ID</Table.Cell>
        <Table.Cell>1229</Table.Cell>
        <Table.Cell>14</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

const EnumModal = ({open, hideEnumModal}) => (
  <Modal open={open} closeIcon={true} onClose={() => hideEnumModal()}>
    <Modal.Header>Configure Enum Mapping</Modal.Header>
    <Modal.Content>
      <p>
        The following values were found in the column selected for the{' '}
        <code>PARTICIPANT.GENDER</code> concept. Make sure values are properly
        mapped to constants.
      </p>
      <Table compact="very" definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Value</Table.HeaderCell>
            <Table.HeaderCell>Constant Mapping</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>M</Table.Cell>
            <Table.Cell>
              <ConstantDropdown />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>F</Table.Cell>
            <Table.Cell>
              <ConstantDropdown />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>null</Table.Cell>
            <Table.Cell>
              <ConstantDropdown />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Modal.Content>
    <Modal.Actions>
      <Button primary content="Save" onClick={() => hideEnumModal()} />
    </Modal.Actions>
  </Modal>
);

const Mapper = () => {
  const [enumModalVisible, setEnumModalVisible] = useState(false);
  return (
    <>
      <p>Concept mappings required:</p>
      <List horizontal>
        <List.Item>
          <Icon name="check" color="green" /> PARTICIPANT.ID
        </List.Item>
        <List.Item>
          <Icon name="check" color="green" /> PARTICIPANT.MOTHER_ID
        </List.Item>
        <List.Item>
          <Icon name="x" color="red" /> PARTICIPANT.FATHER_ID
        </List.Item>
      </List>
      <ColumnTable showEnumModal={() => setEnumModalVisible(true)} />
      <EnumModal
        open={enumModalVisible}
        hideEnumModal={() => setEnumModalVisible(false)}
      />
    </>
  );
};

export default Mapper;
