'use strict';

/******************************************************************************/

function _getValuesInfo(propsOrSchema, fieldName) {
  if (!propsOrSchema) {
    return null;
  }

  let schema;
  if (propsOrSchema.entitySchema) {
    schema = propsOrSchema.entitySchema;
  } else {
    schema = propsOrSchema;
  }
  return schema.get(`${fieldName}.valuesInfo`);
}

function getGlyph(propsOrSchema, fieldName, value) {
  const valuesInfo = _getValuesInfo(propsOrSchema, fieldName);
  return valuesInfo ? valuesInfo.get(`${value}.glyph`) : null;
}

function getColor(propsOrSchema, fieldName, value) {
  const valuesInfo = _getValuesInfo(propsOrSchema, fieldName);
  return valuesInfo ? valuesInfo.get(`${value}.color`) : null;
}

function getText(propsOrSchema, fieldName, value) {
  const valuesInfo = _getValuesInfo(propsOrSchema, fieldName);
  return valuesInfo ? valuesInfo.get(`${value}.text`) : fieldName;
}

//-----------------------------------------------------------------------------

module.exports = {
  getGlyph,
  getColor,
  getText,
};
