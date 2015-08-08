---
layout: post
title: "Checking for existence of i18n keys"
category: programming
description: "In this post, I demonstrate how you can set up an integration test
in Grails to check that all i18n keys exist for all languages."
tags: [Groovy, Grails, Spock, i18n]
---

{% include JB/setup %}

#### prerequisites: basic Groovy and Grails knowledge.

*"Those who know nothing of foreign languages know nothing of their own."*<br/>
-‒ Johann Wolfgang von Goethe

In this post, I demonstrate how you can set up an integration test in
[Grails](https://grails.org/) to check that all i18n keys exist for all
languages.

Let us say that we have the following nested `i18n` folder in our grails project:

{% gist dragonwasrobot/7b914c06a674e399de8a project.txt %}

where we have divided our keys in to three categories: `default`, `messages`, and
`roles`. For each of these categories we include an English version and a Danish
version, where the Danish version has `_da` appended to the name. In the case of
the `default` category, the two files could look like so:

{% gist dragonwasrobot/7b914c06a674e399de8a default.properties %}

and

{% gist dragonwasrobot/7b914c06a674e399de8a default_da.properties %}

While the example above is manageable, when it comes to making sure that all i18n
keys have translations for both Danish and English, the situation quickly
becomes a lot less manageable when there are dozens of categories and each
category has dozens of keys. This was recently the case for me at work, where I
had to ensure that all ~5k i18n keys in a large Grails project existed in both
Danish and English.

Rather than try to do this manually, I came up with the following
[Spock](https://grails.org/plugin/spock) integration test inspired by the
following
[blog post](https://sergiosmind.wordpress.com/2013/07/25/getting-all-i18n-messages-in-javascript/):

{% gist dragonwasrobot/7b914c06a674e399de8a I18NIntegrationTest.groovy %}

The test uses metaprogramming to add a new method to `messageSource` that
retrieves all i18n keys of the application for a given locale. With this new
method I could then extract all keys for the `da` and `en` locales, compute
their [symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference),
and check that the symmetric difference set is empty. In case the set is not
empty, which is was not in my case, Spock will print the content of the set in
the error message, thus presenting you with the exact keys that need to be
translated.
