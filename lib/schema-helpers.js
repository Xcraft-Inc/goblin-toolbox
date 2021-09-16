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

function _normalizeModel(model) {
  if (model.startsWith('.')) {
    return model.substring(1); // remove "."
  } else {
    return model;
  }
}

function getComboList(entitySchema, model) {
  if (!entitySchema || !model) {
    return null;
  }

  model = _normalizeModel(model);
  const valuesInfo = entitySchema.get(`${model}.valuesInfo`);
  if (!valuesInfo) {
    return null;
  }

  const result = [];
  valuesInfo.forEach((value, id) => {
    const item = {
      id,
      text: value.get('text'),
      glyph: value.get('glyph'),
      color: value.get('color'),
    };
    result.push(item);
  });
  return result;
}

function getKind(entitySchema, model) {
  if (!entitySchema || !model) {
    return null;
  }

  model = _normalizeModel(model);
  const type = entitySchema.get(`${model}.type`, null);

  let kind = type;
  if (type === 'enum') {
    kind = 'combo';
  }

  return kind;
}

function getLabelText(entitySchema, model) {
  if (!entitySchema || !model) {
    return null;
  }

  model = _normalizeModel(model);
  return entitySchema.get(`${model}.text`, null);
}

function getTooltip(entitySchema, model) {
  if (!entitySchema || !model) {
    return null;
  }

  model = _normalizeModel(model);
  return entitySchema.get(`${model}.description`, null);
}

//-----------------------------------------------------------------------------

module.exports = {
  getGlyph,
  getColor,
  getText,

  getComboList,
  getKind,
  getLabelText,
  getTooltip,
};
