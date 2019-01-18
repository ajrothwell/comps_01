import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support

// import fs from 'fs';
// import path from 'path';
// const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
// const external = Object.keys(pkg.dependencies || {});

export default {
  input: 'src/wrapper.js', // Path relative to package.json
  output: {
    name: 'MyComponent',
    exports: 'named',
  },
  // external,
  plugins: [
    vue({
        css: true, // Dynamically inject css as a <style> tag
        compileTemplate: true, // Explicitly convert template to render function
    }),
    buble({
      transforms: {
        dangerousForOf: true,
      },
    }),
  ],
};
