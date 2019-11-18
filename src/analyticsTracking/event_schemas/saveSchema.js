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
      description: '',
      allOf: [
        {$ref: '../common_defintions.json#/path'},
        {$ref: '../common_defintions.json#/route'},
        {$ref: '../common_defintions.json#/view'},
        {properties: schema.properties},
      ],
    };

    delete schema.properties;

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
