const fs = require('fs');

fs.readFile('.env-example', 'utf8', (err, data) => {
  if (err) throw err;
  fs.writeFile('.env', data, (err) => {
    if (err) throw err;
  });
});
