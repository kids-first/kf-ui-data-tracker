import React from 'react';
import {Card, Placeholder} from 'semantic-ui-react';
import StudyCard from './StudyCard';
import {
  countStudyNotification,
  countProjectNotification,
  countFileNotification,
} from '../../common/notificationUtils';

const GridSkeleton = () => (
  <Card.Group stackable itemsPerRow={3}>
    {[1, 2, 3].map(i => (
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

const StudyGrid = ({studyList, loading, isAdmin, isResearch}) => {
  if (loading) return <GridSkeleton />;
  return (
    <Card.Group stackable itemsPerRow={3}>
      {studyList.map((node, i) => (
        <StudyCard
          isResearch={isResearch}
          key={i}
          studyId={node.node.kfId}
          studyName={node.node.name || node.node.shortName}
          lastUpdate={new Date(node.node.modifiedAt)}
          files={node.node.files.edges}
          projects={node.node.projects.edges}
          missingValue={countStudyNotification(node.node, isResearch)}
          missingProject={countProjectNotification(node.node)}
          requiredFileChanges={countFileNotification(node.node)}
        />
      ))}
    </Card.Group>
  );
};

export default StudyGrid;
