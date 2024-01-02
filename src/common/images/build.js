var fs = require('fs');

// Build classes
fs.writeFileSync(
  `${__dirname}/classes.ts`,
  `export default ${JSON.stringify(
    fs.readdirSync(`${__dirname}/classes`).reduce((acc, fileName) => {
      if (!/\.jpg$/.test(fileName)) return acc;

      const [, className, gender] = fileName.match(/(\w+)-(female|male).jpg/);

      const content = fs.readFileSync(`${__dirname}/classes/${fileName}`, 'base64');
      const key = `${className}-${gender}`;
      acc[key] = `data:image/jpg;base64,${content}`;

      return acc;
    }, {}),
  )};`,
);

// Build avatars
const AVATAR_MAPPING = {
  1: 'feca',
  2: 'osamodas',
  3: 'enutrof',
  4: 'sram',
  5: 'xelor',
  6: 'ecaflip',
  7: 'eniripsa',
  8: 'iop',
  9: 'cra',
  10: 'sadida',
  11: 'sacrieur',
  12: 'pandawa',
  13: 'roublard',
  14: 'zobal',
  15: 'steamer',
  16: 'eliotrope',
  17: 'huppermage',
  18: 'ouginak',
  20: 'forgelance',
};
fs.writeFileSync(
  `${__dirname}/avatars.ts`,
  `export default ${JSON.stringify(
    fs.readdirSync(`${__dirname}/avatars`).reduce((acc, fileName) => {
      if (!/\.png/.test(fileName)) return acc;

      const [, classId, genderId, avatarId] = fileName.match(/(\d+)(\d)_(\d).png/);

      const content = fs.readFileSync(`${__dirname}/avatars/${fileName}`, 'base64');
      const key = `${AVATAR_MAPPING[classId]}-${genderId === '0' ? 'male' : 'female'}-${avatarId}`;
      acc[key] = `data:image/png;base64,${content}`;

      return acc;
    }, {}),
  )};`,
);
