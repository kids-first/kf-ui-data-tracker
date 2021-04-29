import React, {useState} from 'react';
import {useQuery} from '@apollo/client';

import {SingleColumn} from '../../components/layouts';
import {UserList} from '../../components/molecules';
import {Button, PageHeader} from '../../components/atoms';

import {ALL_USERS} from '../queries';
import {AllUsers, AllUsersVars} from '../../types';

const PAGE_SIZE = 10;

const Users = () => {
    const {loading, data, fetchMore} = useQuery<AllUsers, AllUsersVars>(
        ALL_USERS,
        {
            variables: {first: PAGE_SIZE},
        },
    );
    const [loadingPage, setLoadingPage] = useState(false);
    const [page, setPage] = useState(0);
    const [pagesLoaded, setPagesLoaded] = useState(0);

    const hasNextPage =
        data?.allUsers.pageInfo.hasNextPage || page < pagesLoaded;
    const hasPreviousPage = data?.allUsers.pageInfo.hasPreviousPage || page > 0;

    // Load previous page of data
    const loadPrevious = () => {
        setPage(page - 1);
    };
    // Load next page of data
    const loadNext = () => {
        setLoadingPage(true);
        fetchMore({
            variables: {
                first: 10,
                after: data?.allUsers.pageInfo.endCursor,
            },
        }).then(() => {
            setPage(page + 1);
            setPagesLoaded(Math.max(page + 1, pagesLoaded));
            setLoadingPage(false);
        });
    };

    return (
        <SingleColumn>
            <PageHeader>Manage Users</PageHeader>

            <div className="py-4">
                {loading && (
                    <div className="animate-pulse">Loading users...</div>
                )}
                {data && (
                    <>
                        <UserList
                            users={data.allUsers.edges.slice(
                                page * PAGE_SIZE,
                                (page + 1) * PAGE_SIZE,
                            )}
                        />

                        <nav
                            className="py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                            aria-label="Pagination"
                        >
                            <div className="flex-1 flex justify-between space-x-4 sm:justify-end">
                                {hasPreviousPage && (
                                    <Button onClick={loadPrevious}>
                                        Previous
                                    </Button>
                                )}
                                {hasNextPage && (
                                    <Button
                                        onClick={loadNext}
                                        loading={loadingPage}
                                        disabled={loadingPage}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </>
                )}
            </div>
        </SingleColumn>
    );
};

export default Users;
