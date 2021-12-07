import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {GET_RELEASES} from '../../queries';
import {Icon, Table, Menu} from 'semantic-ui-react';
import ReleaseTable from './ReleaseTable';

const ReleaseController = () => {
  const pageSize = 10;
  const [currPage, setCurrPage] = useState(0);
  const [pages, setPages] = useState([{first: 10}]);
  const {data: releasesData, loading: releasesLoading, fetchMore} = useQuery(
    GET_RELEASES,
    {
      variables: pages[0],
    },
  );

  const pageInfo = releasesData && releasesData.allReleases.pageInfo;

  const pagesLoaded =
    releasesData && releasesData.allReleases.edges.length / pageSize;
  // Determine if the current page has been loaded or not by looking at how
  // many items are needed to fill the requested page vs how many are fetched
  const loadingPage = releasesData && pagesLoaded < currPage + 1;
  // Display the requested page if all the necessary items have been loaded
  // for the page, else display the page prior
  const releases =
    releasesData &&
    (!loadingPage
      ? releasesData.allReleases.edges.slice(
          currPage * pageSize,
          (currPage + 1) * pageSize,
        )
      : releasesData.allReleases.edges.slice(
          (currPage - 1) * pageSize,
          currPage * pageSize,
        ));

  const footer = () => (
    <Table.Row>
      <Table.HeaderCell textAlign="right" colSpan="6">
        {loadingPage && <Icon loading size="big" name="spinner" />}
        <Menu pagination floated="right">
          <Menu.Item
            name="prev"
            onClick={() => {
              setCurrPage(currPage - 1);
              setPages([...pages.splice(-1, 1)]);
              fetchMore({
                variables: pages[currPage - 1],
              });
            }}
            disabled={currPage === 0 || releasesLoading}
          />
          <Menu.Item
            name="next"
            disabled={
              (!pageInfo.hasNextPage && pagesLoaded <= currPage + 1) ||
              loadingPage
            }
            onClick={() => {
              setCurrPage(currPage + 1);
              const variables = {
                after: releasesData.allReleases.pageInfo.endCursor,
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
  );

  return <ReleaseTable releases={releases} footer={footer} />;
};

export default ReleaseController;
