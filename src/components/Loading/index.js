import React from 'react';
import { branch, renderComponent } from 'recompose';

export const LoadingPlaceholder = () => <h1 className="col-12">LOADING ....</h1>;

export const renderWhileLoading = (component, propName = 'data') =>
  branch(props => props[propName] && props[propName].loading, renderComponent(component));
