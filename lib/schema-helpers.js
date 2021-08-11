/******************************************************************************/

function _getValuesInfo(props, fieldName) {
  return props && props.entitySchema
    ? props.entitySchema.get(`${fieldName}.valuesInfo`)
    : null;
}

function getGlyph(props, fieldName, value) {
  const valuesInfo = _getValuesInfo(props, fieldName);
  return valuesInfo ? valuesInfo.get(`${value}.glyph`) : null;
}

function getColor(props, fieldName, value) {
  const valuesInfo = _getValuesInfo(props, fieldName);
  return valuesInfo ? valuesInfo.get(`${value}.color`) : null;
}

//-----------------------------------------------------------------------------

module.exports = {
  getGlyph,
  getColor,
};