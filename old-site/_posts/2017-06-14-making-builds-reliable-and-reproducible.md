---
layout: post
title: "Making builds reliable and reproducible"
category: programming
description: "In this post, we present how to improve the reliability and reproducibility of software builds."
tags: [Dependency management]
---

### 1. Introduction

The goal of this blog post is to present a set of practices that significantly
improves the reliability and reproducibility of software builds. The common
theme of these practices is to introduce proper versioning of all dependencies,
from packages to tools and compilers.

The post is structured as follows. In Section
[2](#2-the-problem-of-unreliable-and-irreproducible-builds) we present the
problem of builds becoming unreliable over time through some common scenarios.
In Section [3](#3-locking-down-dependencies) we discuss how to lock the version
of your package dependencies, then in Section
[4](#4-making-build-scripts-self-contained) we discuss how to make your build scripts
self-contained, and finally we look at how to make the compiler and runtime
explicit in Section [5](#5-making-compiler-and-runtime-versions-explicit). We conclude
the post in Section [6](#6-conclusion).

### 2. The problem of unreliable and irreproducible builds

As a software developer, there is a certain class of bugs which tends to slowly
sneak their way into your code base when working on software that has one or
more of these characteristics:

- written by more than one person,
- over a longer period of time, and
- in several phases.

While most bugs - both syntactic and semantic ones - are usually caused by the
code written by you or your colleagues, this other class of bugs cannot
immediately be caught by your compiler or another test case. Specifically, the
class of bugs we are talking about are the ones that occur when a code base is
compiled, tested, or built on different machines or in different points in time,
where either:

1. the dependencies installed by the package manager,
2. the external tools used to test the code, or
3. the compiler used to compile the code,

have slowly drifted from the versions originally used to build and test the
project. A bug of this kind usually manifests itself as either:

- a -- potentially very subtle -- semantic bug,
- a failing test, or
- a broken build.

To illustrate this problem, we use as a -- slightly exaggerated -- example from
the real world where we actually managed to experience all three types of bugs
at different points in time in the same codebase. The concrete project was a web
app that was:

- implemented in [AngularJS](https://angularjs.org/) using
  [bower](https://bower.io/) to handle dependencies, and where
- build and tests scripts were written in [node.js](https://nodejs.org/en/)
   using [grunt](https://gruntjs.com/) to define and manage build steps, and
   where [npm](https://www.npmjs.com) was used to handle the dependencies of the
   build tool chain.

The cause and subsequent effect of each of the three types of bugs played out as
follows:

1. The first bug appeared because several of the AngularJS dependencies had been
   declared with a *bounded major version* number, `^1.2`, rather than a
   specific version number, `1.2.3`, or at least a *bounded minor version*
   number, `~1.2`, in the `bower.json` file. The effect was that over time these
   dependencies started to cause bugs on runtime, such as the classic `undefined
   is not a function`, or failing tests as these AngularJS dependencies started
   to introduce (unintended) breaking changes in their newer minor versions,
   which would then be installed the next time someone -- like our build server
   -- would build the project from scratch.
2. The second bug appeared when the `grunt` CLI, `grunt-cli`, introduced
   breaking changes in its newest version, as it was still running version
   `0.x.y`, and it subsequently turned out that each developer had installed
   their own version of the grunt CLI locally on their machine with `npm -g
   install grunt-cli`, rather than use the one specified in the project's
   `package.json`. Given that we used `grunt` for building, testing, and
   packaging our code, and a few other things, it was no surprise that the
   immediate effect was that our grunt tasks started breaking left and right
   making us unable to build our AngularJS web app.
3. The third and final bug appeared when `node.js` introduced a breaking change
   in their runtime API on which one of our dependencies in `package.json`
   depended on. The effect was that when we tried to run our built script, after
   having updated the `node.js` runtime, the script printed out the not so
   helpful error message `function not defined in nodejs version 8.0`,[^1] with
   no indication as to which function it was trying to invoke.

In each of the three cases above, the inevitable solution was to spend a
non-trivial amount of time doing detective work trying to figure out which
package-, tool-, and runtime version, respectively, that could successfully
build and test the project.[^2]

The causes of the three bugs above can be boiled down to:

1. Relying on a loosely defined version of a package,
2. relying on a globally installed version of a tool, and
3. relying on a globally installed version of a compiler or runtime environment.

These problem are all symptoms of the **"Works on my machine"** life style and
can have a frustrating impact on your colleagues, your build server, and your
future self as it steals a non-trivial amount of time when it appears at some
random point in the future -- usually close to a deadline -- where you may not
have that time to spend tracking down the cause.

In the next three sections we look at concrete practices that can help avoid
this class of bugs from happening while also discussing how different languages
handle this issue.

### 3. Locking down dependencies

As mentioned in the previous section, the first -- and most obvious -- cause of
dependency related bugs is *"relying on a loosely defined version of a
package"*. In the AngularJS case, the problem manifested by specifying our
dependencies in the `bower.json` file with just a bounded minor version:

{% highlight json %}
// bower.json
{
  ...
  "dependencies": {
    "angular": "^1.4",
    "angular-loader": "^1.4",
    "angular-resource": "^1.4",
    "angular-route": "^1.4",
    ...
  }
}
{% endhighlight %}

which would then break the application when the `angular` version `1.5` was
released with breaking changes. Fixing the issue is trivial by simply specifying
a concrete version, `1.4.0`, or a bounded minor version,[^3] `~1.4`, of each
dependency:

{% highlight json %}
// bower.json
{
  ...
  "dependencies": {
    "angular": "1.4.0",
    "angular-loader": "1.4.0",
    "angular-resource": "1.4.0",
    "angular-route": "1.4.0",
    ...
  }
}
{% endhighlight %}

Unfortunately, this does not protect us against the case where one of our
dependencies have defined one of their own dependency versions too loosely.

To illustrate the problem of locking down nested dependencies, we shift our
focus from the `bower` package manager and over to the `package.json` file and
the `npm` package manager. Going back to the AngularJS project, we now specify
our dependencies with a concrete version number like so:

{% highlight json %}
// package.json
{
  ...
  "devDependencies": {
    "jasmine-core": "2.8.0",
    "jasmine-reporters": "2.2.1",
    ...
  }
}
{% endhighlight %}

Unfortunately, it turns out that the `jasmine-reporters` dependency also uses
`^` when specifying some of its dependencies:

{% highlight json %}
// package.json (jasmine-reporters)
{
  ...
  "dependencies": {
    "mkdirp": "^0.5.1",
    "xmldom": "^0.1.22"
  }
}
{% endhighlight %}

Fortunately, to help fix the problem of locking down the versions of nested
dependencies, newer versions of `npm` have introduced the concept of a *lock
file*, `package-lock.json`, which locks down the versions of all dependencies,
both direct and nested by specifying them in the `package-lock.json` file, when
running `npm install`:

{% highlight json %}
// package-lock.json
{
  ...
  "dependencies": {
    "jasmine-core": {
      "version": "2.8.0",
      "resolved": "https://registry.npmjs.org/jasmine-core/-/jasmine-core-2.8.0.tgz",
      "integrity": "sha1-vMl5rh+f0FcB5F5S5l06XWPxok4=",
      "dev": true
    },
    "jasmine-reporters": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/jasmine-reporters/-/jasmine-reporters-2.2.1.tgz",
      "integrity": "sha1-3pqSATZ4RiaefKit/1tEIhZx/L0=",
      "dev": true,
      "requires": {
        "mkdirp": "^0.5.1",
        "xmldom": "^0.1.22"
      },
      "dependencies": {
        "mkdirp": {
          "version": "0.5.1",
          "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.1.tgz",
          "integrity": "sha1-MAV0OOrGz3+MR2fzhkjWaX11yQM=",
          "dev": true,
          "requires": {
            "minimist": "0.0.8"
          },
          "dependencies": {
            ...
          }
        },
        ...
      }
    },
    ...
  }
}
{% endhighlight %}

This also makes it less risky to use the `~` notation when specifying
dependencies:

{% highlight json %}
// package.json
{
  ...
  "devDependencies": {
    "jasmine-core": "~2.8",
    "jasmine-reporters": "~2.2",
    ...
  }
}
{% endhighlight %}

as the `package-lock.json` file will contain information about the exact
versions actually installed, as seen above.

Not only does specifying exact versions and using lock files make your builds
more reliable, it also makes it easier to update versions as you can see the
whole diff of changed (nested) versions in the `package-lock.json` file.
Likewise, it also makes your builds more secure as you can pinpoint which
exactly versions you are running on your server(s) in the rare case where an npm
package becomes compromised.

Lock files are not just a JavaScript-specific concept, but can be found in many
other languages, such as Elixir, where dependencies are specified in a `mix.exs`
file:

{% highlight elixir %}
# mix.exs
...
  defp deps do
    [
      {:credo, "~> 1.0.0", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.0.0-rc.4", only: [:dev], runtime: false},
      {:ex_doc, "~> 0.19-rc", only: :dev, runtime: false},
      {:excoveralls, "~> 0.10", only: :test, runtime: false}
    ]
  end
...
{% endhighlight %}

where a dependency can either be specific or bounded, `~>`, and is then resolved
to specific version in the accompanying `mix.lock` lock file:

{% highlight elixir %}
# mix.lock
%{
  "bunt": {
    :hex,
    :bunt,
    "0.2.0",
    "951c6e801e8b1d2cbe58ebbd3e616a869061ddadcc4863d0a2182541acae9a38",
    [:mix],
    []
  },
  "credo": {
    :hex,
    :credo,
    "1.0.0",
    "aaa40fdd0543a0cf8080e8c5949d8c25f0a24e4fc8c1d83d06c388f5e5e0ea42",
    [:mix],
    [
      {:bunt, "~> 0.2.0", [hex: :bunt, repo: "hexpm", optional: false]},
      {:jason, "~> 1.0", [hex: :jason, repo: "hexpm", optional: false]}
    ],
    "hexpm"
  },
  "jason": { ... },
  ...
}
{% endhighlight %}

Finally, some languages take it a step further, like Elm, where the package
file, `elm.json`, requires exact versions of all dependencies:

{% highlight json %}
// elm.json
"dependencies": {
  "direct": {
    "elm/browser": "1.0.1",
    "elm/core": "1.0.2",
    "elm/html": "1.0.0",
    "elm/http": "1.0.0",
    "elm/json": "1.1.2",
    "elm/url": "1.0.0"
  },
  "indirect": {
    "elm/time": "1.0.0",
    "elm/virtual-dom": "1.0.2"
  }
}
{% endhighlight %}

and the package manager enforces [semantic versioning](https://semver.org/) of
packages, such that:

- changing the type signature of an already exposed type or function forces the
  package author to update the major version,
- exposing a new type or function forces the package author to update the minor
  version,
- making changes to types or functions not exposed via the package API forces
  the package author to update the patch version.

As demonstrated in this section we can achieve a higher level of confidence in
our builds by diligently specifying the exact version of all of our package
dependencies, thus ensuring that we will not be caught off guard by breaking
changes in a dependency. In the next section we examine how to make our builds
more reliable by making build and test scripts self-contained.

### 4. Making build scripts self-contained

Having learned how to properly version all of our dependencies, the next step is
to make sure that our test and build scripts are not *"relying on a globally
installed version of a tool"* but on the properly versioned tools that we have
specified, i.e. making sure that everything needed to build the source code and
run the tests on another machine is properly specified.

If we return to our AngularJS example, we originally had the following set of
scripts defined in our `package.json` file:

{% highlight json %}
// package.json
{
  ...
  "scripts": {
    "postinstall": "bower -f install",
    "prestart": "npm install",
    "start": "grunt dev",
    "pretest": "npm install",
    "test": "grunt test"
  }
}
{% endhighlight %}

which exhibit the second cause of dependency related bugs, as we are referring
to the globally installed versions of both `bower` and `grunt` -- and
technically also `npm`, but we address that in the Section
[5](#5-making-compiler-and-runtime-versions-explicit) -- which resulted in tests
failing and the build pipeline breaking.

In order to fix the issue, we do the following:

- Explicitly add `bower` and `grunt` to our list of dependencies in the
  `package.json` file,

{% highlight json %}
// package.json
{
  ...
  "devDependencies": {
    "bower": "1.8.4",
    "grunt": "0.4.5",
    "grunt-cli": "0.1.13",
    ...
  }
}
{% endhighlight %}

- and make our scripts use the local versions installed in the `node_modules`
  folder of the project:

{% highlight json %}
// package.json
{
  ...
  "scripts": {
    "postinstall": "./node_modules/.bin/bower -f install",
    "prestart": "npm install",
    "start": "./node_modules/.bin/grunt dev",
    "pretest": "npm install",
    "test": "./node_modules/.bin/grunt test"
  }
}
{% endhighlight %}

thus ensuring that whenever `npm test` is executed -- be it on our own
development laptop or the company build server -- the same version of `bower`
and `grunt` is used.

While this issue of having to use 3rd party tools for building and testing is
especially prevalent for JavaScript projects, it can also occur for
non-JavaScript projects like Elm, where a project still might rely on tools
installed via `npm`, like `elm-test`, in which case it is also worth considering
to add proper versioning of any tool dependencies and make the test scripts
self-contained, e.g.

{% highlight json %}
// package.json
{
  ...
  "devDependencies": {
    "elm-test": "= 0.19.0-rev3"
  },
  "scripts": {
    "test": "./node_modules/.bin/elm-test"
  }
}
{% endhighlight %}

As demonstrated in this section, we can achieve an even greater level of
confidence in our builds by combining the lesson from the previous section, of
versioning our dependencies, with the practice of locally installing all needed
3rd party tools in our current project folder, thus making our build and test
scripts self-contained. In the next section we take the final step and look at
how to lock down the the compiler and runtime environment to further improve the
reliability and reproducible of our builds.

### 5. Making compiler and runtime versions explicit

The final step on our road towards more reliable and reproducible builds is to
avoid *"relying on a globally installed version of a compiler or runtime
environment"* by making these explicit in each of our projects.

As mentioned in Section
[2](#2-the-problem-of-unreliable-and-irreproducible-builds), one of the problems
we faced in the AngularJS project, was that our build script would all of a
sudden print the error message `function not defined in nodejs version 8.0` and
exit without further explanation. While the error message did indicate that the
error had been introduced by changing the version of the `nodejs` runtime, it
did not indicate which function it was trying to invoke that was now gone.

Fortunately, this issue can also be fixed by introducing proper versioning to
our project. Specifically, we introduced the
[asdf](https://github.com/asdf-vm/asdf) tool, which is a *"CLI tool that can
manage multiple language runtime versions on a per-project basis"* similar to
what `nvm` does for `nodejs`, `gvm` does for `go`, and `rbenv` does for `ruby`.
Thus, using `asdf` we could make sure that all of our different projects across
all different machines, both development and CI, would be using the exact same
versions of compilers and runtime environments when running our build and test
scripts.

Without going into the practical details of how to setup `asdf`, the general
idea of `asdf` is to add a `.tool-versions` file to your project that contains
the version number(s) of the runtime(s) and compiler(s) needed to start the
project. This is then enforced by installing a
[shim](https://en.wikipedia.org/wiki/Shim_(computing)) in the user's favorite
[shell](https://en.wikipedia.org/wiki/Unix_shell) that picks the proper runtime
or compiler based on the content of the `.tool-versions` file, whenever the user
makes a call to such a runtime or compiler. In the specific case of our
AngularJS project, the `.tool-versions` file simply contains the needed `nodejs`
version:

{% highlight bash %}
# .tool-versions
nodejs 4.7.0
{% endhighlight %}

which is then installed onto the user's machine when running `asdf install`
before running `npm install` or similar.

Besides the AngularJS project, we have also used this `.tool-verions` technique
to specify the versions of `erlang` and `elixir` in some of our microservices:

{% highlight json %}
# .tool-versions
erlang 21.0
elixir 1.9.0
{% endhighlight %}

and `nodejs` and `elm` for some of our newer frontends:

{% highlight json %}
# .tool-versions
nodejs 10.13.0
elm 0.19
{% endhighlight %}

as `asdf` supports a simple [plugin system](https://asdf-vm.com/#/plugins-all)
that makes it easy to support new languages and cmd line tools using the
`.tool-versions` file.

In this section, we have shown how to properly version our compiler and runtime
dependencies using a `.tool-versions` file and making these versions enforceable
by using `asdf`. In the next section, we conclude this post.

### 6. Conclusion

In this blog post we presented a set of practices for significantly improving
the reliability and reproducibility of software builds. These practices focused
on:

- making all dependency versions explicit and freezing this versions in a lock
  file,
- including any needed build tools as properly versioned dependencies, and
- making any compiler and runtime needed to build or test a project explicit
  using a `.tool-versions` file and enforceable by `asdf`.

**A final note:** making builds truly reliable is not a trivial task and
therefore the above principles are not an exhaustive list of what can be done to
achieve this goal. Most notably, there is also the large topic of running
scripts and servers in containers such as
[docker](https://en.wikipedia.org/wiki/Docker_(software)), which we have not
covered.

[^1]: The specific wording of the error message escapes me but it was about as
    helpful as the example message above.

[^2]: Note that the time spend doing detective work can dramatically increase if
    more than one of the three types of bugs occur simultaneously.

[^3]: This presumes that your dependencies do not introduce breaking changes in
     their patch versions.
