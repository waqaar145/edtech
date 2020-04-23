import { formateKeyName } from './validateFinallyRedux'

export const stringHtmlValidationRedux = (data, key, required, type, min, max) => {
  if (type.name === 'String') {
    var div = document.createElement("div");
    div.innerHTML = data;
    let text = div.innerText
    if (required || text) {
      if (typeof(text) === 'string') {
        if (!(text.length >= min && text.length <= max)) {
          return {
            key: key,
            msg: `${formateKeyName(key)} field should be ${min} and ${max} characters long`
          }
        }
        return ''
      } else {
        return {
          key: key,
          msg: `${formateKeyName(key)} field should be characters`
        }
      }
    } else {
      return ''
    }
  } else {
    return {
      key: key,
      msg: `${formateKeyName(key)} field is required`
    }
  }
}

export const stringValidationRedux = (data, key, required, type, min, max) => {
  if (type.name === 'String') {
    if (required || data) {
      if (typeof(data) === 'string') {
        if (!(data.length >= min && data.length <= max)) {
          return {
            key: key,
            msg: `${formateKeyName(key)} field should be ${min} and ${max} characters long`
          }
        }
        return ''
      } else {
        return {
          key: key,
          msg: `${formateKeyName(key)} field should be characters`
        }
      }
    } else {
      return ''
    }
  } else {
    return {
      key: key,
      msg: `${formateKeyName(key)} field is required`
    }
  }
}

export const numberValidationRedux = (data, key, required, type, min, max) => {
  if (type.name === 'Number') {
    if (required || data) {
      if (typeof(data) === 'number') {
        if (!(data >= min && data <= max)) {
          return {
            key: key,
            msg: `${formateKeyName(key)} field should be between ${min} and ${max}`
          }
        }
        return ''
      } else {
        return {
          key: key,
          msg: `${formateKeyName(key)} field should be number`
        }
      }
    } else {
      return ''
    }
  } else {
    return {
      key: key,
      msg: `${formateKeyName(key)} field is required`
    }
  }
}


export const arrayValidationRedux = (data, key, required, type, min, max) => {
  if (type.name === 'Array') {
    if (required || data) {
      if (Array.isArray(data)) {
        if (!(data.length >= min && data.length <= max)) {
          return {
            key: key,
            msg: `${formateKeyName(key)} field should be between ${min} and ${max}`
          }
        }
        return ''
      } else {
        return {
          key: key,
          msg: `${formateKeyName(key)} field should be a list`
        }
      }
    } else {
      return ''
    }
  } else {
    return {
      key: key,
      msg: `${formateKeyName(key)} field is required`
    }
  }
}

export const booleanValidationRedux = (data, key, required, type) => {
  if (type.name === 'Boolean') {
    if (required || data) {
      if (!(typeof(data) === 'boolean')) {
        return {
          key: key,
          msg: `${formateKeyName(key)} field should be either true or false`
        }
      } else {
        return ''
      }
    } else {
      return ''
    }
  } else {
    return {
      key: key,
      msg: `${formateKeyName(key)} field is required`
    }
  }
}
