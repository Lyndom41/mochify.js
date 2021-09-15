'use strict';

const syntax_highlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (config) {
  // Default layout for all pages (available since 11ty v1):
  config.addGlobalData('layout', 'home');

  // Copy assets:
  config.addPassthroughCopy('assets');

  const font_awesome = '../node_modules/@fortawesome/fontawesome-free';
  config.addPassthroughCopy({
    [`${font_awesome}/webfonts/*`]: 'assets/webfonts/',
    [`${font_awesome}/css/all.min.css`]: 'assets/css/fontawesome.min.css'
  });

  // Add syntax highlighting plugin:
  config.addPlugin(syntax_highlight);
};
