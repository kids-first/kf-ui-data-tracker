import GenerateSchema from 'generate-schema';
import {saveAs} from 'file-saver';

const saveSchema = async (eventType, eventProps, cb) => {
  try {
    let schema = GenerateSchema.json(eventType, eventProps);

    schema = {
      $id: `https://kf-ui-datatracker.kidsfirstdrc.org/event_schemas/${
        eventType.split('__')[0]
      }/${eventType}.schema.json`,
      ...schema,
      $schema: 'http://json-schema.org/draft-07/schema#',
      description: '',
      properties: {
        ...schema.properties,
        path: {
          $ref:
            'http://kf-ui-data-tracker.kidsfirstdrc.org/src/analyticsTracking/event_schemas/common_defs.schema.json#/definitions/path',
        },
        route: {
          $ref:
            'http://kf-ui-data-tracker.kidsfirstdrc.org/src/analyticsTracking/event_schemas/common_defs.schema.json#/definitions/route',
        },
        view: {
          $ref:
            'http://kf-ui-data-tracker.kidsfirstdrc.org/src/analyticsTracking/event_schemas/common_defs.schema.json#/definitions/view',
        },
      },
      allAdditonalProperites: false,
      required: ['path', 'route', 'view'],
    };

    var blob = new Blob([JSON.stringify(schema)], {
      type: 'text/plain;charset=utf-8',
    });

    const schemaFile = await saveAs(blob, `${eventType}.schema.json`);
    if (typeof cb == 'function') cb(schemaFile, schema);
  } catch (e) {
    console.error(e);
  }
};

export default saveSchema;
