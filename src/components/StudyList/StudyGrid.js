import React from 'react';
import {Card, Placeholder} from 'semantic-ui-react';
import StudyCard from './StudyCard';
import {
  countStudyNotification,
  countProjectNotification,
  countFileNotification,
} from '../../common/notificationUtils';

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

const StudyGrid = ({studyList, loading, isAdmin}) => {
  if (loading) return <GridSkeleton />;
  return (
    <Card.Group stackable itemsPerRow={4}>
      {studyList.map((node, i) => (
        <StudyCard
          key={i}
          studyId={node.node.kfId}
          studyName={node.node.name || node.node.shortName}
          lastUpdate={new Date(node.node.modifiedAt)}
          files={node.node.files.edges}
          projects={node.node.projects.edges}
          missingValue={isAdmin ? countStudyNotification(node.node) : 0}
          missingProject={isAdmin ? countProjectNotification(node.node) : 0}
          requiredFileChanges={isAdmin ? countFileNotification(node.node) : 0}
          eventProperties={{
            link: `/study/${node.node.kfId}/documents`,
            study: {
              kfId: node.node.kfId,
              study_name: node.node.name || node.node.shortName,
              files: node.node.files.edges.length,
              projects: node.node.projects.edges.length,
              missing_info_fields: countStudyNotification(node.node),
            },
            scope: 'STUDY_CARD',
          }}
        />
      ))}
    </Card.Group>
  );
};

export default StudyGrid;
