import React from 'react';
import {Icon, Table} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';

const JobsList = ({jobs, onClick, active}) => (
  <Table basic="very" celled compact="very">
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
        <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
        <Table.HeaderCell textAlign="center">Active</Table.HeaderCell>
        <Table.HeaderCell textAlign="center" width="4">
          Next Run
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {jobs.length ? (
        jobs.map(({node}) => (
          <Table.Row
            key={node.id}
            active={active === node.id}
            onClick={() => onClick(node.id)}
            className="cursor-pointer"
          >
            <Table.Cell>{node.name}</Table.Cell>
            <Table.Cell textAlign="center">
              {node.scheduled ? 'Scheduled' : 'Triggered'}
            </Table.Cell>
            <Table.Cell textAlign="center">
              {node.failing ? (
                <>
                  <Icon color="red" name="warning sign" /> Failing
                </>
              ) : (
                'Ok'
              )}
            </Table.Cell>
            <Table.Cell textAlign="center">
              {node.active ? 'Active' : 'Disabled'}
            </Table.Cell>
            <Table.Cell textAlign="center">
              {<TimeAgo date={node.enqueuedAt} live={false} />}
            </Table.Cell>
          </Table.Row>
        ))
      ) : (
        <Table.Row>
          <Table.Cell colSpan="5">No Jobs are scheduled or have run</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>
);

export default JobsList;
