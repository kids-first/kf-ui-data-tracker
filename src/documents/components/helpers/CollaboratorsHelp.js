import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import collaborators from '../../../assets/collaborators.svg';

const Help = () => (
  <BaseHelper title="About Study Collaborators" image={collaborators}>
    <p>
      Collaborators are members that contribute to delivering a study's data to
      an investigator and, later, the world. Users added as collaborators are
      able to see and work with a study and its data.
    </p>
    <p>
      Each collaborator has a <b>role</b> which signifies their function within
      the study. The <b>role</b> of a collaborator only represents their
      responsibilities and <em>does not</em> impact or restrict the permissions
      of a user within the study.
    </p>
  </BaseHelper>
);

export default Help;
