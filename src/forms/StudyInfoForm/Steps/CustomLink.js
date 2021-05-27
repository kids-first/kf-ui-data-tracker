import React, {useState} from 'react';

import {Form} from 'semantic-ui-react';
import ReactDOM from 'react-dom';
import {v4 as uuidv4} from 'uuid';

const ReactComponent = ({className, name, value}) => {
  const [inputName, setInputName] = useState(name);
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className={className}>
      <Form className="mb-15">
        <Form.Input
          fluid
          label="Link Title"
          placeholder="Title of this information"
          value={inputName}
          onChange={(e, {value}) => {
            e.preventDefault();
            setInputName(value);
          }}
        />
        <Form.Input
          fluid
          label="Link"
          placeholder="https://data-tracker.kidsfirstdrc.org/"
          value={inputValue}
          onChange={(e, {value}) => {
            e.preventDefault();
            setInputValue(value);
          }}
        />
      </Form>
    </div>
  );
};

export default class CustomLink {
  constructor({data, api, config}) {
    // provided by EditorJS
    this.api = api;
    this.config = config;
    this.data = data;

    this.container = undefined;

    this._CSS = {
      block: this.api.styles.block,
      react: 'react-component',
    };

    this.blockId = uuidv4();
  }

  static get toolbox() {
    return {
      title: 'Link',
      icon:
        '<svg width="13" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z" transform="translate(-3.667 -2.7)"></path></svg>',
    };
  }

  render() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.classList.add(this._CSS.block);

      ReactDOM.render(
        <ReactComponent
          {...this.data}
          className={this._CSS.react}
          blockId={this.blockId}
        />,
        this.container,
      );
    }
    return this.container;
  }

  rendered() {}

  moved() {}

  removed() {
    ReactDOM.unmountComponentAtNode(this.container);
  }

  save(element) {
    return {
      name:
        element.children[0].children[0].children[0].children[1].children[0]
          .value,
      value:
        element.children[0].children[0].children[1].children[1].children[0]
          .value,
    };
  }
}
