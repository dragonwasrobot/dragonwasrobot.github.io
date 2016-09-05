---
layout: post
title: "Transpiling and linting ECMAScript 6"
category: programming
description: "In this post, we briefly explain how to set up an ECMAScript 6 project."
tags: [JavaScript, Grunt, ECMAScript 6, Babel, Brainfuck]
---

{% include JB/setup %}

#### prerequisites: basic JavaScript and Grunt knowledge.

*“All problems in computer science*<br/>
*can be solved by another level of indirection,*<br/>
*except of course for the problem*<br/>
*of too many indirections.”*<br/>
-- David Wheeler

### Introduction

In this post, I briefly explain how to set up a development loop for a
ECMAScript 6 (ES6) style JavaScript project.

Our example project will be a simple
[brainfuck](http://en.wikipedia.org/wiki/Brainfuck) tokenizer, with the
following basic project structure:

```
.eslintrc
Gruntfile.js
package.json
dist/
  |-- app.js
src/
  |-- tokenizer.js
```

where:

- `.eslintrc` is the config file for our linting tool,
- `Gruntfile.js` is our Grunt config file,
- `package.json` is our npm config file,
- `dist` is the folder containing our transpiled ES6 code into
  JavaScript, `app.js`, and
- `src` is the folder containing our ES6 code, `tokenizer.js`.

I will go through each of these files in turn.

### package.json

As with most JavaScript projects, we start by creating a `package.json` file,
which describes the project:

{% highlight javascript linenos %}
{
  "name": "brainfuck-tokenizer",
  "description": "A brainfuck tokenizer written in ECMAScript 6",
  "version": "1.0.0",
  "devDependencies": {
    "babel": "^5.0.8",
    "babel-eslint": "^2.0.2",
    "eslint": "^0.18.0",
    "grunt": "^0.4.5",
    "grunt-babel": "^5.0.0",
    "grunt-contrib-clean": "^0.6.0",
    "grunt-contrib-watch": "^0.6.1",
    "grunt-eslint": "^10.0.0",
  }
}
{% endhighlight %}

Besides giving it a name, description and a version number, we state the
following dependencies:

- [babel](https://github.com/babel/babel/): Our ES6 to JavaScript transpiler,
- [babel-eslint](https://github.com/babel/babel-eslint): an eslint plugin for
  ES6 source code,
- [eslint](https://github.com/eslint/eslint): a pluggable linting utility for
  JavaScript,
- [grunt](https://github.com/gruntjs/grunt): our task runner for setting up a
  development loop,
- [grunt-babel](https://github.com/babel/grunt-babel): a grunt task for
  transpiling ES6 source code,
- [grunt-eslint](https://github.com/sindresorhus/grunt-eslint): a grunt task for
  linting our ES6 source code,
- [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean): a grunt
  task for cleaning the destination folder before transpiling the source code,
  and
- [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch): a grunt
  task for watching our code for changes and redoing the linting and
  transpiling.

While this is quite a mouthful we show next how to compose these into something
meaningful.

### Gruntfile

Having written our `package.json` file and run `npm install` to fetch all
dependencies, we stitch everything together with the following Gruntfile:

{% highlight javascript linenos %}
(function() {
    "use strict";

    module.exports = function(grunt) {

        var gruntConfig = {};

        gruntConfig.babel = {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    "dist/app.js": "src/*.js"
                }
            }
        };

        gruntConfig.eslint = {
            target: ["src/*.js"]
        };

        gruntConfig.clean = {
            dist: {
                src: ["dist/"]
            }
        };

        gruntConfig.watch = {
            dev: {
                files: "src/*.js",
                tasks: ["eslint", "clean:dist", "babel"],
                options: {
                    atBegin: true
                }
            }
        };

        grunt.initConfig(gruntConfig);

        // Load and register tasks
        grunt.loadNpmTasks('grunt-babel');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-eslint');

        grunt.registerTask('dev', ['watch:dev']);

    };
}());
{% endhighlight %}

where we:

- Tell babel to take all source code in the `src` folder and transpile it into
  the file `dist/app.js` (and generate source map for it),
- tell eslint to lint all source code in the `src` folder,
- create a clean target for wiping the `dist` folder, and
- create a watch task, `dev`, which runs the three previous tasks whenever a
  change in the source code occurs.

Now, we just need to configure the eslint tool before we can start writing some
ES6 code.

### .eslintrc
In order to get eslint to recognize ES6 source code, we set up the following
config file:

{% highlight javascript linenos %}
{
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "quotes": [2, "single"],
        "eol-last": [0],
        "no-underscore-dangle": [0],
        "comma-spacing": [0],
        "no-extra-strict": [0],
        "strict": [0]
    }
}
{% endhighlight %}

Here, we tell it to use the `babel-eslint` parser, set the environment to
browser and node.js, and add a set of arbitrary style rules to be enforced.

### tokenizer.js
Having set up our project structure, dependencies, Gruntfile and eslint
configuration, we are now ready to write our brainfuck tokenizer in ES6:

{% highlight javascript linenos %}
let tokenMap = {
    '>': 'INC_POINTER',
    '<': 'DEC_POINTER',
    '+': 'INC_BYTE',
    '-': 'DEC_BYTE',
    '.': 'OUTPUT_BYTE',
    ',': 'INPUT_BYTE',
    '[': 'START_BLOCK',
    ']': 'END_BLOCK'
};

let tokenize = program => program.split('')
    .map(char => tokenMap[char])
    .filter(token => token);

let brainfuckProgram = `
    ++++++++
    [
        >++++
        [
            >++
            >+++
            >+++
            >+
            <<<<-
        ]
        >+
        >+
        >-
        >>+
        [<]
        <-
    ]

    >>.
    >---.
    +++++++..+++.
    >>.
    <-.
    <.
    +++.------.--------.
    >>+.
    >++.
    `;

console.log(tokenize(brainfuckProgram));
{% endhighlight %}

In this sample program, we start by defining a map from symbols to tokens using
the `let` syntax. Then, we define a `tokenize` function using both the `let` and
the `=>` (fat arrow) syntax. The function `tokenize` takes the string
representation of a brainfuck program and splits it up into an array of
characters, maps each of the characters to a corresponding token in the
brainfuck language, and filters away anything that is not a defined token (in
this case comments). Lastly, we pass the sample brainfuck program, which we have
defined using the multiline string syntax, to the tokenizer and print the
result.

Now, in order to lint and transpile our `tokenizer.js` code we simply run `grunt
dev` in the root of the project folder, which start the development loop, and
then the resulting transpiled ES6 code can be found in `dist/app.js`:

{% highlight javascript linenos %}
'use strict';

var tokenMap = {
    '>': 'INC_POINTER',
    '<': 'DEC_POINTER',
    '+': 'INC_BYTE',
    '-': 'DEC_BYTE',
    '.': 'OUTPUT_BYTE',
    ',': 'INPUT_BYTE',
    '[': 'START_BLOCK',
    ']': 'END_BLOCK'
};

var tokenize = function tokenize(program) {
    return program.split('').map(function (char) {
        return tokenMap[char];
    }).filter(function (token) {
        return token;
    });
};

var brainfuckProgram = '\n    ++++++++\n    [\n        >++++\n        [\n            >++\n            >+++\n            >+++\n            >+\n            <<<<-\n        ]\n        >+\n        >+\n        >-\n        >>+\n        [<]\n        <-\n    ]\n\n    >>.\n    >---.\n    +++++++..+++.\n    >>.\n    <-.\n    <.\n    +++.------.--------.\n    >>+.\n    >++.\n    ';

console.log(tokenize(brainfuckProgram));
//# sourceMappingURL=app.js.map
{% endhighlight %}

We note how the transpiled code is far from as aesthetically pleasing as our
original ES6 code in the `tokenizer.js` file. Furthermore, we can now run the
transpiled code by executing `node dist/app.js` resulting in the following
tokenized representation of the original brainfuck program:

{% highlight javascript linenos %}
[ 'INC_BYTE',
  'INC_BYTE',
  ...,
  'INC_POINTER',
  'INC_BYTE',
  'INC_BYTE',
  'OUTPUT_BYTE'
].
{% endhighlight %}
