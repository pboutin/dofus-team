var fs = require('fs');

const images = {};

fs.readdirSync(__dirname).forEach(path => {
  if (path.includes('.')) return;

  fs.readdirSync(`${__dirname}/${path}`).forEach(fileName => {
    const match = fileName.match(/\.(png|jpg)$/);
    if (!match) return;

    const [, extension] = match;
    const imageName = `${path}/${fileName}`;
    const content = fs.readFileSync(`${__dirname}/${imageName}`, 'base64');
    images[imageName] = `data:image/${extension};base64,${content}`;
  });
});

fs.writeFileSync(`${__dirname}/images.json`, JSON.stringify(images, null, 2));
