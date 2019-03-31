import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import Badge from '../Badge/Badge';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */

const FileElementEmpty = ({className}) => {
  const fileElementEmptyClass = classes(
    'FileList--Element',
    'sm:flex-no-wrap',
    className,
  );

  return (
    <li className={fileElementEmptyClass}>
      <div className="FileList--ElementBadge sm:w-48">
        <Badge state="empty" />
        <Badge state="empty" />
      </div>
      <div className="flex-initial">
        <p className="mt-0 pt-2 font-bold text-sm">
          <span className="bg-lightGrey px-12 mx-4" />
          <span className="bg-lightGrey px-8 mx-4" />
          <span className="bg-lightGrey px-12 mx-4" />
        </p>
        <p className="mt-0 font-normal text-grey text-xs">
          <span className="bg-lightGrey px-12 mx-4" />
          <span className="bg-lightGrey px-8 mx-4" />
          <span className="bg-lightGrey px-6 mx-4" />
        </p>
      </div>
    </li>
  );
};

FileElementEmpty.propTypes = {
  /** Any additional classes to be applied to the empty study element*/
  className: PropTypes.string,
};

FileElementEmpty.defaultProps = {
  className: null,
};

export default FileElementEmpty;
