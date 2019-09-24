import React from 'react';
import PropTypes from 'prop-types';
import {Form, Label, Message, Dropdown, List} from 'semantic-ui-react';
import CavaticaProjectItem from '../components/CavaticaProjectList/CavaticaProjectItem';

const LinkProjectForm = ({formikProps, apiErrors, allProjects, disabled}) => {
  const {errors, touched, handleBlur, setFieldValue} = formikProps;
  const options =
    allProjects && allProjects.edges && allProjects.edges.length > 0
      ? allProjects.edges.map(({node}) => ({
          key: node.id,
          value: node.id,
          text: node.name,
          content: (
            <List>
              <CavaticaProjectItem
                projectNode={node}
                disableLink
                editable={false}
              />
            </List>
          ),
        }))
      : [];
  return (
    <>
      <Form.Field>
        <label>Link Project:</label>
        <Dropdown
          selection
          id="projectId"
          name="projectId"
          disabled={options.length === 0 || disabled}
          onBlur={handleBlur}
          options={options}
          placeholder={
            options.length === 0
              ? 'There are no projects to link'
              : 'Choose a project'
          }
          onChange={(e, {name, value}) => {
            setFieldValue('projectId', value);
          }}
          error={
            touched.projectId !== undefined &&
            errors.projectId !== undefined &&
            errors.projectId.length > 0 &&
            !disabled
          }
        />
        {touched.projectId &&
          errors.projectId &&
          errors.projectId.length > 0 &&
          !disabled && (
            <Label pointing basic color="red">
              {errors.projectId}
            </Label>
          )}
      </Form.Field>
      {apiErrors && <Message negative content={apiErrors} />}
    </>
  );
};

LinkProjectForm.propTypes = {
  /** Error message returned from server or API */
  apiErrors: PropTypes.string,
  /** Array of all unlinked projects */
  allProjects: PropTypes.object,
};

export default LinkProjectForm;
