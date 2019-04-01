import React from 'react';
import {Button} from 'kf-uikit';

const NewTokenForm = ({onSubmit, error, loading}) => (
  <form onSubmit={onSubmit} className="FileEditor">
    <div className="w-full">
      <label>
        Name:
        <input type="text" name="name" className="FileEditor--Input" />
      </label>
      <div className="float-right">
        {error && (
          <span className="text-red px-2">
            {error.networkError.result.errors.map(err => err.message)}
          </span>
        )}
        <Button type="submit" disabled={loading}>
          Create
        </Button>
      </div>
    </div>
  </form>
);

export default NewTokenForm;
