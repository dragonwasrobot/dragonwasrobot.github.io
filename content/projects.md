+++
title = 'Projects'
date = 2025-04-20T00:00:00+00:00
draft = false
layout = "static"
+++

<section class="category-group">

### JSON Schema parser

#### Description

The [json_schema](https://github.com/dragonwasrobot/json_schema) project is
an [Elixir](https://elixir-lang.org/) library for parsing, inspecting and
manipulating [JSON Schema](http://json-schema.org/) documents, thus making it
easier for third parties to create new tools based on JSON schema
specifications, e.g. JSON schema validators or code generation tools.

The project was created as a result of
my [json-schema-to-elm](https://github.com/dragonwasrobot/json-schema-to-elm)
project growing sufficiently large that it started to make sense to split it
into two projects: the JSON schema parser and the [Elm](http://elm-lang.org/)
code generator.

#### Links

- [Online documentation](https://hexdocs.pm/json_schema/readme.html)
- [hex.pm page](https://hex.pm/packages/json_schema)
- [GitHub page](https://github.com/dragonwasrobot/json_schema)

</section>

<section class="category-group">

### JSON Schema to Elm code generator

#### Description

The [json-schema-to-elm](https://github.com/dragonwasrobot/json-schema-to-elm)
project is a command line tool, written in [Elixir](https://elixir-lang.org/),
which takes as input a list of [JSON schema](http://json-schema.org/) files,
describing some API, and outputs [Elm](http://elm-lang.org/) type declarations,
JSON decoders and encoders, and Fuzz tests for manipulating the types specified
by the JSON schema files in Elm.

The project was created as I found the act of writing all these JSON decoders
and encoders by hand rather tedious and error prone, so it made sense to
investigate the alternative of generating them based on a
specification. Furthermore, this had the added advantage of giving me some hands
on experience writing both parser and code generation logic for a real world use
case.

#### Links

- [GitHub page](https://github.com/dragonwasrobot/json-schema-to-elm)
- [Conference Presentation](https://www.slideshare.net/slideshow/it-can-t-be-that-hard-elm-serializers-and-fuzz-testing-for-free/278693036)

</section>

<section class="category-group">

### i18n to Elm code generator

#### Description

The [i18n-to-elm](https://github.com/dragonwasrobot/i18n-to-elm) project is a
command line tool, written in [Elixir](https://elixir-lang.org/), which takes as
input a list of
[i18n resource](https://en.wikipedia.org/wiki/Internationalization_and_localization)
files, containing translations of string assets in different languages, and
outputs type safe [Elm](http://elm-lang.org/) code for handling these i18n
resources.

The project was created after
reading
["Elm i18n and Type Safety"](https://www.gizra.com/content/elm-i18n-type-safety/) --
and having already written a working first version of
the [json-schema-to-elm](https://github.com/dragonwasrobot/json-schema-to-elm)
tool -- as a way of solving yet
another [boilerplate](https://en.wikipedia.org/wiki/Boilerplate_code)-related
issue when working with Elm. This also had the effect of allowing me to test
some of the Elm code generating logic on a slightly different use case than the
JSON schema files.

#### Links

- [GitHub page](https://github.com/dragonwasrobot/i18n-to-elm)

</section>

<section class="category-group">

### CHIP-8 emulator

#### Description

The [chip-8](https://github.com/dragonwasrobot/chip-8) project is a web
application, written in [Elm](http://elm-lang.org/), which implements
a [CHIP-8](https://en.wikipedia.org/wiki/CHIP-8) emulator in the browser.

The project was created for two reasons:

- Learning about emulators by implementing one, and
- writing an emulator in a functional programming language.

#### Links

- [Running emulator](https://www.dragonwasrobot.com/chip-8/)
- [GitHub page](https://github.com/dragonwasrobot/chip-8)

</section>

<section class="category-group">

### Brainfuck interpreter

#### Description

The [brainfuck](https://github.com/dragonwasrobot/brainfuck) project is a web
application, written in [Elm](http://elm-lang.org/), which implements
a [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) interpreter in the
browser.

The project was created for two reasons:

- Learning about interpreters implementing one, and
- writing an interpreter in a functional programming language.

#### Links

- [Running interpreter](https://www.dragonwasrobot.com/brainfuck/)
- [GitHub page](https://github.com/dragonwasrobot/brainfuck)

</section>

<section class="category-group">

### b.el

#### Description

The [b.el](https://github.com/dragonwasrobot/b.el) project is an Emacs package,
written in [Emacs Lisp](https://en.wikipedia.org/wiki/Emacs_Lisp), which
provides a range of standard functions for manipulating and parsing bytes
centered around three distinct representations for bytes as decimal, hexadecimal
and binary values, respectively.

The project was create to aid developers who either want to rapidly prototype a
parser for a binary format, and would prefer to do this from the comforts of an
Emacs buffer, or simply want become better acquainted with bytes as a
fundamental building block for software development and how these can be
manipulated and represented.

#### Links

- [GitHub page](https://github.com/dragonwasrobot/b.el)

</section>

<section class="category-group">

### ExRerun

#### Description

The [ex_rerun](https://github.com/dragonwasrobot/ex_rerun) project is an
[Elixir](https://elixir-lang.org/) library for monitoring your source code and
running a set of custom `mix` tasks, like `compile` or `test`, whenever source
files change. The tool is made to be pluggable allowing developers to add their
own `mix` tasks to be run by the tool, e.g. for compiling frontend code or
generating API documentation.

The project was created because I was developing a RESTful Elixir backend, in
[cowboy](https://ninenines.eu/docs/en/cowboy/2.6/guide/), which was bundled with
a corresponding CRUD frontend in [Elm](http://elm-lang.org/), and wanted to
compile the Elm code alongside the Elixir code whenever either of the code bases
changed.

#### Links

- [Online documentation](https://hexdocs.pm/ex_rerun/getting-started.html)
- [hex.pm page](https://hex.pm/packages/ex_rerun)
- [GitHub page](https://github.com/dragonwasrobot/ex_rerun)

</section>

<section class="category-group">

### Helm Bitbucket

#### Description

The [helm-bitbucket](https://github.com/dragonwasrobot/helm-bitbucket) project
is an Emacs package, written in [Emacs
Lisp](https://en.wikipedia.org/wiki/Emacs_Lisp), which adds
[Helm](https://emacs-helm.github.io/helm/) support for searching Bitbucket
repositories, of which you are a member, and opening the corresponding the
Bitbucket web page in the browser.

The project was created to easily lookup a Bitbucket repository while
developing, e.g. to compare some piece of code or check on a pull request.

#### Links

- [GitHub page](https://github.com/dragonwasrobot/helm-bitbucket)

</section>
