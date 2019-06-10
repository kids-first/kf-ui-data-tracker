import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import ReactPaginate from 'react-paginate';
import {Icon} from 'kf-uikit';

const Pagination = ({
  className,
  rowCount,
  currentPageNum,
  pageCount,
  page,
  onPageClick,
}) => {
  const ContainerClass = classes('Pagination', className);
  return (
    <div className={ContainerClass}>
      <p className="inline-block m-0 pt-12 text-sm text-mediumGrey  text-left">
        Showing {currentPageNum} of {rowCount} files
      </p>
      <ReactPaginate
        previousLabel={<Icon kind="previous" size="4" />}
        nextLabel={<Icon kind="next" size="4" />}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        forcePage={page}
        onPageChange={onPageClick}
        containerClassName={'Pagination--PageList'}
        activeClassName={'Pagination--active'}
      />
    </div>
  );
};

Pagination.propTypes = {
  /** Any additional classes to be applied to the pagination container element*/
  className: PropTypes.string,
  /** number of total rows  */
  rowCount: PropTypes.number,
  /** number of the current page offset (Showing X of xx)  */
  currentPageNum: PropTypes.number,
  /** The total number of pages */
  pageCount: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
  /** current page number */
  page: PropTypes.number,
  /** The method to call when a page is clicked.   */
  onPageClick: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  className: '',
};

export default Pagination;
