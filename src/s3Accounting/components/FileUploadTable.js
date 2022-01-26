import {
  Container,
  Header,
  Icon,
  Menu,
  Message,
  Placeholder,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import React, {useState} from 'react';

import TimeAgo from 'react-timeago';
import {formatFileSize} from '../../documents/utilities';
import {longDate} from '../../common/dateUtils';

const FileUploadTable = ({
  loading,
  error,
  data,
  title,
  fetchMore,
  pages,
  setPages,
}) => {
  const pageSize = 4;
  const [currPage, setCurrPage] = useState(0);

  const pageInfo = data && data.pageInfo;
  const pagesLoaded = data && data.edges.length / pageSize;
  const loadingPage = data && pagesLoaded < currPage + 1;
  const content =
    data &&
    (!loadingPage
      ? data.edges.slice(currPage * pageSize, (currPage + 1) * pageSize)
      : data.edges.slice((currPage - 1) * pageSize, currPage * pageSize));
  // console.log(data);
  // console.log(pageInfo);

  if (loading)
    return (
      <Container as={Segment} basic vertical className="mt-30">
        <Placeholder>
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
      <Segment className="mt-30 mb-50">
        <Header as="h4">{title}</Header>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Segment>
    );

  const CutoffCell = ({content}) => (
    <>
      {content ? (
        <Popup
          size="tiny"
          content={content}
          trigger={
            <Table.Cell>
              {content.substring(0, 20)}
              {content.length > 20 && '...'}
            </Table.Cell>
          }
        />
      ) : (
        <Table.Cell>-</Table.Cell>
      )}
    </>
  );

  return (
    <Segment className="mt-30 mb-50">
      <Header as="h4">{title}</Header>
      {data && data.edges.length > 0 ? (
        <Table
          singleLine
          stackable
          selectable
          compact
          celled
          className="text-12"
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Expected Url
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Expected Hash
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Actual Hash
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Expected Size
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Actual Size
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Hash Algorithm
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Result</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Source Filename
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Created At</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {content.map(({node}) => (
              <Table.Row key={node.id}>
                <CutoffCell content={node.expectedUrl} />
                <CutoffCell content={node.expectedHash} />
                <CutoffCell content={node.actualHash} />
                <Table.Cell>
                  {node.expectedSize ? formatFileSize(node.expectedSize) : '-'}
                </Table.Cell>
                <Table.Cell>
                  {node.actualSize ? formatFileSize(node.actualSize) : '-'}
                </Table.Cell>
                <Table.Cell>
                  {node.hashAlgorithm ? node.hashAlgorithm : '-'}
                </Table.Cell>
                <Table.Cell>{node.result}</Table.Cell>
                <CutoffCell content={node.sourceFilename} />
                <Table.Cell>
                  <TimeAgo
                    live={false}
                    date={node.createdAt}
                    title={longDate(node.createdAt)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell textAlign="right" colSpan="9">
                {loadingPage && <Icon loading size="large" name="spinner" />}
                <Menu pagination floated="right" size="mini">
                  <Menu.Item
                    name="prev"
                    onClick={() => {
                      setCurrPage(currPage - 1);
                      setPages([...pages.splice(-1, 1)]);
                      fetchMore({
                        variables: pages[currPage - 1],
                      });
                    }}
                    disabled={currPage === 0 || loading}
                  />
                  <Menu.Item
                    name="next"
                    disabled={!pageInfo.hasNextPage}
                    onClick={() => {
                      setCurrPage(currPage + 1);
                      const variables = {
                        after: data.pageInfo.endCursor,
                        first: 10,
                      };
                      setPages([...pages, variables]);
                      fetchMore({
                        variables,
                      });
                    }}
                  />
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      ) : (
        <Container textAlign="center" className="mt-6">
          <Header disabled as="h5" className="mt-15 mb-15">
            No data avaliable
          </Header>
        </Container>
      )}
    </Segment>
  );
};

export default FileUploadTable;
