// underscore (_) separated key to space separated name for headings
export const formateKeyName = (key) => {
  if (!key) return;
  let formatted_key = []
  for (let k of key.split('_')) {
    formatted_key.push(k[0].toUpperCase() + k.slice(1, k.length))
  }
  return formatted_key.join(' ');
}
// space separated text to underscore (_) separated key name
export const formateNameKey = (key) => {
  if (!key) return;
  return key.split(' ').join('_').toLowerCase();
}

export const showInputFieldError = (errors, key) => {
  let indexIs = errors.findIndex((error) => {
    return error.key === key
  })
  if (indexIs > -1) {
   return errors[indexIs].msg;
  }
  return;
}

export const convertFileToBase64 = file => new Promise((resolve, reject) => {
  if (!file) {
    resolve({
      base64: ''
    });
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve({
    base64: reader.result
  });
  reader.onerror = reject;
});