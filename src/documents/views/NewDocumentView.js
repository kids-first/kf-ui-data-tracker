import React from 'react';
import {Segment, Container} from 'semantic-ui-react';

import Builder from '../../builder/views/Builder';

/**
 * The NewDocumentView displays a form to collect details about a new file.
 * It expects that the user lands on the page after being forwarded from a
 * file browser dialog and a file present in `location.state.file` as
 * populated by the router (eg: history.push('/new', {state: <File>}) )
 */
const NewDocumentView = ({match, history, location}) => {
  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.file) {
    history.push(`/study/${match.params.kfId}/documents`);
    return <></>;
  }

  return (
    <Container as={Segment} vertical basic>
      <Builder file={location.state.file} />
    </Container>
  );
};

export default NewDocumentView;
