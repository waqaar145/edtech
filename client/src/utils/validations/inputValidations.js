import {formateKeyName} from './common';
//eslint-disable-next-line
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

export const stringValidation = async (key, value, required, min, max) => {
  if (value || required) {
    if (required && !value) {
      return {
        key: key,
        msg: `${formateKeyName(key)} is required`
      }
    }
    if (typeof(value) === 'string') {
      if (!(value.length >= min && value.length <= max)) {
        if (min === max) {
          return {
            key: key,
            msg: `${formateKeyName(key)} should be ${min} characters long`
          }
        }
        return {
          key: key,
          msg: `${formateKeyName(key)} should be between ${min} and ${max} characters long`
        }
      }
      return '';
    } else {
      return {
        key: key,
        msg: `${formateKeyName(key)} should be a characters`
      }
    }
  } else {
    return '';
  }
}

export const stringHtmlValidation = (key, value, required, min, max) => {
  if (required || value) {
    if (!value) {
      return {
        key: key,
        msg: `${formateKeyName(key)} is required`
      }
    }

    var div = document.createElement("div");
    div.innerHTML = value;
    let text = div.innerText

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
    return '';
  }
}

export const numberValidation = async (key, value, required, min, max) => {
  let number = value ? Number(value) : '';
  if (number || required) {
    if (required && !number) {
      return {
        key: key,
        msg: `${formateKeyName(key)} is required`
      }
    }
    if (typeof(number) === 'number') {
      let data = number;
      if (!(data.toString().length >= min && data.toString().length <= max)) {
        if (min === max) {
          return {
            key: key,
            msg: `${formateKeyName(key)} should be ${min} digits long`
          }
        }
        return {
          key: key,
          msg: `${formateKeyName(key)} should be between ${min} and ${max} digits long`
        }
      }
      return '';
    } else {
      return {
        key: key,
        msg: `${formateKeyName(key)} should be a number`
      }
    }
  } else {
    return '';
  }
}

export const arrayValidation = (key, value, required, min, max) => {
  if (required || value) {
    if (Array.isArray(value)) {
      if (!(value.length >= min && value.length <= max)) {
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
}

export const emailValidation = (key, value, required) => {
  if (value || required) {
    if (required && !value) {
      return {
        key: key,
        msg: `${formateKeyName(key)} is required`
      }
    }
    if (validEmailRegex.test(value)) {
      return '';
    } else {
      return {
        key: key,
        msg: `${formateKeyName(key)} should be a valid`
      }
    }
  } else {
    return '';
  }
}

export const imageValidation = (key, value, required, size, dimensions, image_type) => {
  if (required || value) {
    if (!value) {
      return {
        key: key,
        msg: `${formateKeyName(key)} is required`
      }
    }
    // Checking image size, in mb
    if (size * 1000 * 1000 <= value.size) {
      return {
        key: key,
        msg: `${formateKeyName(key)} size must not be greater than ${size} mb`
      }
    }

    if (!value.name.match(/\.(png|jpeg|jpg)$/)) {
      return {
        key: key,
        msg: `${formateKeyName(key)} image file should be only of jpg, jpeg, png`
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export const booleanValidation = (key, value, required) => {
  if (required || value) {
    if (!(value === false || value === true)) {
      return {
        key: key,
        msg: `${formateKeyName(key)} Should be either True or False`
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
}


export const objectValidation = (key, value, required, pattern) => {
  if (required || value) {
    let error = false
    for (let p of pattern) {
      if (!(value.hasOwnProperty(p.key) && value[p.key])) {
        error = true
      }
    }

    if (error && required) {
      return {
        key: key,
        msg: `${formateKeyName(key)} is required, ${pattern.map(key => key.key).join(', ')} shoule not be empty, PLEASE ASK THE CONCERNED ONE IF YOU ARE NOT SURE WHY IT'S HAPPENING`
      } 
    } else {
      return '';
    }

  } else {
    return '';
  }
}


export const validateFinally = async (form) => {
  let errors = []
  for (const [key, value] of Object.entries(form)) {
    if (key === 'client_errors' || key === 'server_errors') { // should be the last two keys in the object so every 
      break;                                                  // other keys can be iterated
    }
    for (const [key1, value1] of Object.entries(value)) {
      let error = {};
      if (value1.type.name === 'String') {
        error = await stringValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
      } else if (value1.type.name === 'Number') {
        error = await numberValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
      } else if (value1.type.name === 'Email') {
        error = await emailValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
      } else if (value1.type.name === 'File') {
        error = await imageValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
      } else if (value1.type.name === 'Boolean') {
        error = await booleanValidation(key1, value1.input_val, value1.required)
      }
      if (error) errors.push(error);
    }
  }
  if (errors.length > 0) {
    let error_object = {
      error_type: 'CLIENT',
      errors
    }
    throw error_object;
  }
  return errors;
}

export const validateFinallySimple = async (values) => {
  let errors = []
  for (const [key1, value1] of Object.entries(values)) {
    if (key1 === 'client_errors' || key1 === 'id') break;
    let error = {};
    if (value1.type.name === 'String') {
      error = await stringValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
    } else if (value1.type.name === 'htmlString') {
      error = await stringHtmlValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
    } else if (value1.type.name === 'Number') {
      error = await numberValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
    }  else if (value1.type.name === 'Array') {
      error = await arrayValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max);
    } else if (value1.type.name === 'Email') {
      error = await emailValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
    } else if (value1.type.name === 'File') {
      error = await imageValidation(key1, value1.input_val, value1.required, value1.condition.min, value1.condition.max)
    } else if (value1.type.name === 'Boolean') {
      error = await booleanValidation(key1, value1.input_val, value1.required)
    } else if (value1.type.name === 'Object') {
      error = await objectValidation(key1, value1.input_val, value1.required, value1.condition.pattern)
    }
    if (error) errors.push(error);
  }

  if (errors.length > 0) {
    let error_object = {
      error_type: 'CLIENT',
      errors
    }
    throw error_object;
  }
  return errors;
}