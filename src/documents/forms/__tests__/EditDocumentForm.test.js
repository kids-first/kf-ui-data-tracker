import React from 'react';
import {render} from 'react-testing-library';
import EditDocumentForm from '../EditDocumentForm';
import {
  AnalyticsProviderMock,
  AmplitudeProxy,
} from '../../../analyticsTracking';

it('renders correctly for annotating new file before upload', () => {
  const cancelMock = jest.fn();
  const submitMock = jest.fn();
  const tree = render(
    <AnalyticsProviderMock>
      <AmplitudeProxy>
        {tracking => (
          <EditDocumentForm
            tracking={tracking}
            handleCancel={cancelMock}
            handleSubmit={submitMock}
          />
        )}
      </AmplitudeProxy>
    </AnalyticsProviderMock>,
  );
  expect(tree).toMatchSnapshot();
});

it('renders correctly for editing existing file', () => {
  const tree = render(
    <AnalyticsProviderMock>
      <AmplitudeProxy>
        {tracking => (
          <EditDocumentForm
            tracking={tracking}
            fileType="CLN"
            fileName="Existing File Name"
            fileDescription="Existing File Description"
            versionStatus="PEN"
            onNameChange={e => e.preventDefault()}
            onDescriptionChange={e => e.preventDefault()}
            onFileTypeChange={e => e.preventDefault()}
            onVersionStatusChange={versionStatusValue => {}}
          />
        )}
      </AmplitudeProxy>
    </AnalyticsProviderMock>,
  );
  expect(tree).toMatchSnapshot();
});
