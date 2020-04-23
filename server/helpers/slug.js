const slugify = require('slugify');

const convertIntoSlug = (name) => {
  let slug = slugify(name, {
                       replacement: '-',
                       remove: /[*+~.(][)'"!:@, .:;`~!@#$%^&{}]/g,
                       lower: true
                     });
  return slug
}

module.exports = { convertIntoSlug };
