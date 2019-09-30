import React from 'react';
import {Link} from 'react-router-dom';
import {List, Icon, Popup, Label, Button} from 'semantic-ui-react';
import {projectOptions} from '../../common/enums';

const CavaticaCounts = ({projects, title}) => {
  if (projects && projects.length > 0) {
    const types = projects.map(({node: {projectType}}) => projectType);
    const typeCounts = types.reduce((count, type) => {
      count[type] = (count[type] || 0) + 1;
      return count;
    }, {});
    return (
      <List horizontal>
        <List.Item
          as={Link}
          to={`/study/${title}/cavatica`}
          onClick={e => e.stopPropagation()}
        >
          <Icon name="code branch" />
          {projects.length} projects
        </List.Item>
        {projectOptions.map(
          type =>
            type.value in typeCounts && (
              <Popup
                inverted
                position="top center"
                size="small"
                content={type.text}
                key={type.key}
                trigger={
                  <List.Item>
                    <Label circular empty size="mini" color="olive" />{' '}
                    {typeCounts[type.key]}
                  </List.Item>
                }
              />
            ),
        )}
      </List>
    );
  } else {
    return (
      <List horizontal>
        <List.Item>
          <Icon color="red" name="code branch" />
          <Button.Group size="mini" compact basic>
            <Button
              primary
              size="mini"
              icon="linkify"
              content="LINK"
              as={Link}
              to={`/study/${title}/cavatica#link-cavatica-project`}
              onClick={e => e.stopPropagation()}
            />
            <Button
              basic
              primary
              size="mini"
              icon="add"
              content="NEW "
              as={Link}
              to={`/study/${title}/cavatica#add-cavatica-project`}
              onClick={e => e.stopPropagation()}
            />
          </Button.Group>
        </List.Item>
      </List>
    );
  }
};

export default CavaticaCounts;
