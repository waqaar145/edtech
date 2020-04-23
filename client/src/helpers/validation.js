const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

export const validateFinally = (errors, values) => {
  for (let value in values) {
    if (values[value] === '' || values[value] === null) {
      return 'Please check form data that you have entered'
    }
  }

  for (let error in errors) {
    if (errors[error] !== '') {
      return 'Please check form data error that you have recieved'
    }
  }
  return true;
}

export const stringValidation = (data, field, min, max) => {
  if (data.length >= min && data.length <= max) {
    return true
  }
  let name = field.split('_').join(' ');
  return `${name} must be minimum of ${min} and maximum of ${max} characters long`;
}

export const numberValidation = (data, field, min, max) => {
  let number = Number(data)
  if (typeof number === 'number' && data >= min && data <= max) {
    return true
  }
  let name = field.split('_').join(' ');
  return `${name} must be minimum of ${min} and maximum of ${max}`;
}

export const booleanValidation = (data, field) => {
  if (typeof data === "boolean") {
    return true;
  }
  return 'Is active field should be either true or false';
}

export const emailValidation = (data, field) => {
  if (validEmailRegex.test(data)) {
    return true;
  }
  return 'Enter a valid email';
}
