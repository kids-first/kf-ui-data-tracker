import React from 'react';
import StudyCard from './StudyCard';
import {Card, Placeholder} from 'semantic-ui-react';

const GridSkeleton = () => (
  <Card.Group stackable itemsPerRow={4}>
    {[1, 2, 3, 4].map(i => (
      <Card key={i}>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="long" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
        <Card.Content extra>
          <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line length="short" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
      </Card>
    ))}
  </Card.Group>
);

const StudyGrid = ({studyList, loading}) => {
  if (loading) return <GridSkeleton />;
  return (
    <Card.Group stackable itemsPerRow={4}>
      {studyList.map((node, i) => (
        <StudyCard
          key={i}
          title={node.node.kfId}
          body={node.node.name || node.node.shortName}
          lastUpdate={new Date(node.node.modifiedAt)}
        />
      ))}
    </Card.Group>
  );
};

export default StudyGrid;
