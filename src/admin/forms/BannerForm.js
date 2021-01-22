import React from 'react';
import {useHistory} from 'react-router-dom';
import {Formik} from 'formik';
import {Button, Form, Message} from 'semantic-ui-react';
import {toYearMonthDay} from '../../common/dateUtils';

const SEVERITY = [
  {key: 'INFO', name: 'Info'},
  {key: 'WARN', name: 'Warning'},
  {key: 'ERROR', name: 'Error'},
];

const BannerForm = ({isUpdate, mutation, banner, loading, err}) => {
  const history = useHistory();

  // Validate banner
  const validate = (banner) => {
    const errors = {};

    // Incomplete date range
    if (!banner.startDate && banner.endDate) {
      errors.startDate = `Cannot submit an end date with no start date. 
        However, a start date without an end date is valid.
        The banner will be displayed indefinitely from the start date.`;

      // Invalid date range
    } else if (banner.startDate && banner.endDate) {
      const ds = Date.parse(banner.startDate);
      const de = Date.parse(banner.endDate);
      if (ds >= de) {
        errors.startDate = 'Start date must be earlier than end date';
      }
    }
    return errors;
  };
  // Form submission
  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);

    let data = {};
    for (const key in values) {
      data[key] = values[key];

      // Store dates with midnight local time
      if (key.endsWith('Date')) {
        if (values[key]) {
          // yyyy-mm-dd format gets interpreted as UTC midnight
          // but we want the dates at local time midnight
          let parts = data[key].split('-');
          data[key] = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
          data[key] = data[key].toISOString();
        } else {
          data[key] = null;
        }
      }
    }
    data['enabled'] = values.enabled;

    let body = {variables: {input: data}};
    if (isUpdate) {
      body.variables.id = banner.id;
    }
    // Create or update banner mutation
    mutation(body)
      .then((resp) => {
        history.push(`/banners`);
      })
      .catch((err) => {
        console.log(err);
      });
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        message: banner.message,
        enabled: banner.enabled,
        startDate: toYearMonthDay(banner.startDate),
        endDate: toYearMonthDay(banner.endDate),
        url: banner.url,
        urlLabel: banner.urlLabel,
        severity: banner.severity,
      }}
      validateOnChange={false}
      validate={(values) => validate(values)}
      onSubmit={handleSubmit}
    >
      {({values, errors, handleSubmit, handleChange, setFieldValue}) => {
        return (
          <Form onSubmit={handleSubmit}>
            {/* Enabled */}
            <Form.Radio
              toggle
              label={values.enabled ? 'Enabled' : 'Disabled'}
              key="enabled"
              name="enabled"
              checked={values.enabled}
              onChange={(e) => setFieldValue('enabled', !values.enabled)}
            />
            {/* Message */}
            <Form.Input
              required
              label="Message"
              key="message"
              name="message"
              placeholder="The message to display in the banner"
              maxLength={1000}
              value={values.message}
              onChange={handleChange}
            />

            {/* Date Range */}
            <Form.Group>
              <Form.Input
                key="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                value={values.startDate}
                onChange={handleChange}
              />
              <Form.Input
                key="endDate"
                name="endDate"
                label="End Date"
                type="date"
                value={values.endDate}
                onChange={handleChange}
              />
            </Form.Group>

            {/* URL */}
            <Form.Group widths="equal">
              <Form.Input
                fluid
                key="url"
                name="url"
                label="URL"
                placeholder="http://myurl"
                value={values.url}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                key="urlLabel"
                name="urlLabel"
                label="URL Label"
                maxLength={200}
                disabled={!values.url}
                placeholder="Label for the url"
                value={values.urlLabel}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Severity */}
            <Form.Group inline>
              <label>Severity</label>
              {SEVERITY.map((item) => (
                <Form.Radio
                  key={item.key + '-severity'}
                  id={item.key}
                  name="severity"
                  label={item.name}
                  value={item.key}
                  onChange={handleChange}
                  checked={item.key === values.severity}
                />
              ))}
            </Form.Group>

            {Object.keys(errors).length > 0 && (
              <Message
                negative
                header="Error"
                content={Object.values(errors).join('\n')}
              />
            )}

            <Button
              color="blue"
              type="submit"
              content="Submit"
              loading={loading}
              className="mt-30"
              disabled={values.message.length <= 0}
            />
            <Button
              type="button"
              content="Cancel"
              className="mt-30"
              onClick={() => history.push(`/banners`)}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default BannerForm;
