// key should be underscore separated for now

export const formateKeyName = (key) => {
  let data = key.split('_');
  let final_key = [];
  if (data.length > 0) {
    for (let d of data) {
      final_key.push(d[0].toUpperCase() + d.slice(1, d.length))
    }
    return final_key.join(' ')
  }
  return data[0].toUpperCase() + data[0].slice(1)
}

export const validateFinallyWithOptional = (values) => {
  const errors = []
  for (let [key, value] of Object.entries(values)) {
    if (value.type.name === 'Number') {
      let min = value.condition.min;
      let max = value.condition.max;
      if (typeof(value.data) === 'number') {
        if (value.required || value.data) {
          if (value.data >= min && value.data <= max) {
            continue;
          } else {
            errors.push({
              key: key,
              msg: `${formateKeyName(key)} field should be between ${min} and ${max}`
            })
          }
        }
      } else {
        errors.push({
          key: key,
          msg: `${formateKeyName(key)} should be only number`
        })
      }
    }
    if (value.type.name === 'String') {
      let min = value.condition.min;
      let max = value.condition.max;
      if (typeof(value.data) === 'string') {
        if (value.required || value.data) {
          if (value.data.length >= min && value.data.length <= max) {
            continue;
          } else {
            errors.push({
              key: key,
              msg: `${formateKeyName(key)} field should be ${min} and ${max} characters long`
            })
          }
        }
      } else {
        errors.push({
          key: key,
          msg: `${formateKeyName(key)} should be only string`
        })
      }
    }
    if (value.type.name === 'Array') {
      let min = value.condition.min;
      let max = value.condition.max;
      if (Array.isArray(value.data)) {
        if (value.required || value.data) {
          if (value.data.length >= min && value.data.length <= max) {
            continue;
          } else {
            errors.push({
              key: key,
              msg: `${formateKeyName(key)} field should have items selected between ${min} and ${max}`
            })
          }
        }
      } else {
        errors.push({
          key: key,
          msg: `${formateKeyName(key)} should be only list`
        })
      }
    }
    if (value.type.name === 'Boolean') {
      if (value.required || value.data) {
        if (typeof(value.data) === 'boolean') {
          continue;
        } else {
          errors.push({
            key: key,
            msg: `${formateKeyName(key)} field should be either true of false`
          })
        }
      }
    }
  }

  if (errors.length > 0) {
    return errors;
  }
  return [];
}

export const showError = (errors, key) => {
  let indexIs = errors.findIndex(error => {
    return error.key === key
  })

  if (indexIs > -1) {
    return errors[indexIs].msg
  }
  return '';
}

export const customStyles = {
  control: (provided, state) =>
    true
    ? {
        ...provided,
        boxShadow: "0 0 0 1px red !important",
        borderColor: "red !important"
      }
    : provided
}
