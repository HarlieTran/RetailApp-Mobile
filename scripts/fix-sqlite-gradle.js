const fs = require('fs');
const path = require('path');

const gradlePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-sqlite-storage',
  'platforms',
  'android',
  'build.gradle',
);

if (!fs.existsSync(gradlePath)) {
  process.exit(0);
}

const original = fs.readFileSync(gradlePath, 'utf8');
const updated = original.replace('jcenter()', 'mavenCentral()');

if (updated !== original) {
  fs.writeFileSync(gradlePath, updated);
  console.log('Patched react-native-sqlite-storage Android Gradle repositories.');
}
