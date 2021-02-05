const { getOptions } =  require('loader-utils');
const { validate } =  require('schema-utils');
const schema = {
    type: 'object',
    properties: {
        name: {
        type: 'string'
      }
    }
}
module.exports = function loader(source) {
  const options = getOptions(this);

  validate(schema, options, {
    name: 'Example Loader',
    baseDataPath: 'options'
  });

  const callback = this.async();

  source = source.replace(/\[name\]/g, options.name);

  callback(null, `export default ${ JSON.stringify(source) }` );


}