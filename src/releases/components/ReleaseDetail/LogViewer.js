import React, {useState} from 'react';
import {Segment, Icon, Menu} from 'semantic-ui-react';
import {Log} from './';

const LogMenu = ({options, onClick, activeItem}) => (
  <Menu attached="top" tabular>
    {options.map(item => (
      <Menu.Item
        name={item}
        content={
          <>
            <Icon name={item === 'release' ? 'tag' : 'server'} />{' '}
            {item.replace(/\w\S*/g, w =>
              w.replace(/^\w/, c => c.toUpperCase()),
            )}
          </>
        }
        active={activeItem === item}
        onClick={() => onClick(item)}
      />
    ))}
  </Menu>
);

const LogViewer = ({logs}) => {
  const [activeItem, setActiveItem] = useState('release');

  return (
    <>
      <LogMenu
        activeItem={activeItem}
        options={Object.keys(logs)}
        onClick={setActiveItem}
      />

      <Segment attached="bottom">
        <Log log={logs[activeItem]} />
      </Segment>
    </>
  );
};

export default LogViewer;
