(function () {

    var schemas = {}

    schemas.user = {
      type: 'object',
      properties: {
        username: {
          required: true,
          type: 'string',
          format: 'alphanumeric',
          length: [2, 60]
        },
        email: {
          required: true,
          type: 'string',
          format: 'email'
        },
        password: {
          required: true,
          type: 'string',
          length: [6,100],
        }
      }
    };


  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = schemas;
  } else if (typeof define !== 'undefined') {
    define(function() {
      return schemas;
    });
  } else {
    this.schemas = schemas;
  }


}());




