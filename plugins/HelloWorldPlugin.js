
const { validate } =  require('schema-utils')
const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
class HelloWorldPlugin {
    constructor(options = {}) {
        validate(schema, options, 'Hello World Plugin');
        console.log(options);
    }
    apply(compiler) {
      // 注册指定hook逻辑
      compiler.hooks.done.tap('Hello World Plugin', (
        stats /* stats is passed as an argument when done hook is tapped.  */
      ) => {
        console.log('Hello World!');
      });
    }
}
  
module.exports = HelloWorldPlugin;