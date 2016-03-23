# gulp-ng2-template-wrap

Gulp plugin to wrap Angular2 templates into separate ES6 module which can be used by other modules.
Allows you to avoid additional HTTP requests.

Initially was created to use in Ionic projects that support iOS "WKWebView". With this plugin local server plugins are not needed on iOS.

__note:__

* 0.0.1 the very first version of project, not tested. Not recommended to use in producti.

# Installation

```bash
npm install gulp-ng2-template-wrap --save-dev
```

# Configuration

You can pass a configuration object to the plugin.
```javascript
defaults = {
  baseDir: 'app',                         // Angular2 application base folder
  templatesModulePath: 'templates.js'     // Use components relative assset paths
  templateIdDelimiter: '.'                // Delimiters used for templates IDs
};
```

Defaults are configured for the following project structure
```
+-- app
|   +-- pages
    |   +-- page1.html
    |   +-- page2.html
|   +-- app.js
|   +-- templates.js (will be created)
+-- index.html
+-- gulpfile.js
+-- packages.json
```

# Example usage

```javascript
//...
var templatesWrap = require('gulp-ng2-template-wrap');

gulp.task('templates', function(){
  gulp.src('app/**/*.html').pipe(templatesWrap({
    templateIdDelimiter: '_'
  }));
});
```

# How it works

__app/pages/template1.html__
```html
<p>
  Hello world 1
</p>
```

__app/pages/template2.html__
```html
<p>
  Hello world 2
</p>
```

__result (app/templates.js)__
```javascript
var templates = {
  'pages_page1': ... // page1.html content
  'pages_page2': ... // page2.html content
}

export function getTemplate(id){
  return templates[id];
}
```


__othermodule (othermodule.js)__
```javascript
import {getTemplate} from 'templates';

@Page({
  template: getTemplate('pages.page1.page1')
})
export class ...

```

# Licence

MIT
