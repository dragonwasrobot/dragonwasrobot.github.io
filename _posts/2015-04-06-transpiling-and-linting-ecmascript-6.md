---
layout: post
title: "Transpiling and linting ECMAScript 6"
category: javascript
description: "In this post, I will briefly explain how to set up a development
loop for a ECMAScript 6 style JavaScript project."
tags: [JavaScript, Grunt, ECMAScript 6]
---

{% include JB/setup %}

#### prerequisites: basic JavaScript and Grunt knowledge.

*"All problems in computer science can be solved by another level of
 indirection, except of course for the problem of too many
 indirections."*<br/>
-- David Wheeler

### Introduction

In this post, I will very briefly explain how to set up a development loop
for a ECMAScript 6 (ES6) style JavaScript project.

Our example project will be a simple
[brainfuck](http://en.wikipedia.org/wiki/Brainfuck) tokenizer, with the
following basic project structure:

{% gist dragonwasrobot/a7a17cb055b166c18754 project.txt %}

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

{% gist dragonwasrobot/a7a17cb055b166c18754 package.json %}

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

{% gist dragonwasrobot/a7a17cb055b166c18754 Gruntfile.js %}

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

{% gist dragonwasrobot/a7a17cb055b166c18754 .eslintrc %}

Here, we tell it to use the `babel-eslint` parser, set the environment to
browser and node.js, and add a set of arbitrary style rules to be enforced.

### tokenizer.js
Having set up our project structure, dependencies, Gruntfile and eslint
configuration, we are now ready to write our brainfuck tokenizer in ES6:

{% gist dragonwasrobot/a7a17cb055b166c18754 tokenizer.js %}

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

{% gist dragonwasrobot/a7a17cb055b166c18754 app.js %}

We note how the transpiled code is far from as aesthetically pleasing as our
original ES6 code in the `tokenizer.js` file. Furthermore, we can now run the
transpiled code by executing `node dist/app.js` resulting in the following
tokenized representation of the original brainfuck program:
`[ 'INC_BYTE', 'INC_BYTE', ..., 'INC_POINTER', 'INC_BYTE', 'INC_BYTE', 'OUTPUT_BYTE' ].`
