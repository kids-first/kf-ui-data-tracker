import schemas from './event_schemas';
console.log(schemas);
// only show error logs in non production environments
const showLogs =
  process.env.NODE_ENV !== 'prod' || process.env.NODE_ENV !== 'production';

const Ajv = require('ajv');
var ajv = new Ajv({
  allErrors: true,
  verbose: true,
  schemas,
});

const validate = (eventType, eventProps) => {
  if (!schemas[eventType] || Object.keys(schemas[eventType]).length < 1) {
    if (showLogs) {
      console.error(
        `[analytics-event-schemaValidator] EventTypeError: No matching schema found for eventType "${eventType}". Make sure you have defined json schema(s) for the event type and exported it in 'src/analyticsTracking/event_schemas/index.js'`,
      );
    }
    if (['CI', 'TESTING', 'test'].includes(process.env.NODE_ENV)) {
      throw new Error(
        `[analytics-event-schemaValidator] EventTypeError: No matching schema found for eventType "${eventType}". Make sure you have defined json schema(s) for the event type and exported it in 'src/analyticsTracking/event_schemas/index.js'`,
      );
    }
    return false;
  }

  const isValid = ajv.getSchema(
    'http://kf-ui-data-tracker.kidsfirstdrc.org/src/analyticsTracking/event_schemas/common_defs.schema.json',
  )(eventProps);

  if (isValid) {
    return true;
  } else if (showLogs) {
    console.error(
      `[analytics-eventSchemaValidator] EventPropertiesError: Malformed event properties given for event type "${eventType}"\n`,
      ajv
        .errorsText()
        .split(/,/gi)
        .join('\n'),
      eventProps,
    );
    console.error(
      `[analytics-eventSchemaValidator] Expected event properties for event type: ${eventType} -`,
      schemas[eventType].description,
      schemas[eventType].properties,
    );
  }
  return false;
};

export default validate;
