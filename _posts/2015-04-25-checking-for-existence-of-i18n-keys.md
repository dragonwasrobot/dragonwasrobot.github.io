---
layout: post
title: "Checking for existence of i18n keys"
category: programming
description: "In this post, we show how to test in Grails that all i18n keys exist for all languages."
tags: [Groovy, Grails, Spock, i18n]
---

{% include JB/setup %}

#### prerequisites: basic Groovy and Grails knowledge.

*“Those who know nothing of foreign languages*<br/>
*know nothing of their own.”*<br/>
-- Johann Wolfgang von Goethe

In this post, I demonstrate how you can set up an integration test in
[Grails](https://grails.org/) to check that all i18n keys exist for all
languages.

Let us say that we have the following nested `i18n` folder in our grails project:

{% highlight python %}
i18n/
  |-- default/
        |-- default_da.properties
        |-- default.properties
  |-- messages/
        |-- messages_da.properties
        |-- message.properties
  |-- roles/
        |-- roles_da.properties
        |-- roles.properties
{% endhighlight %}

where we have divided our keys in to three categories: `default`, `messages`, and
`roles`. For each of these categories we include an English version and a Danish
version, where the Danish version has `_da` appended to the name. In the case of
the `default` category, the two files could look like so:

{% highlight java linenos %}
// default.properties
default.button.create.label=Create
default.button.edit.label=Edit
default.button.delete.label=Delete
default.button.delete.confirm.message=Are you sure?
{% endhighlight %}

and

{% highlight java linenos %}
// default_da.properties
default.button.create.label=Opret
default.button.edit.label=Rediger
default.button.delete.label=Slet
default.button.delete.confirm.message=Er du sikker?
{% endhighlight %}

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

{% highlight groovy linenos %}
import grails.test.spock.IntegrationSpec

class I18NIntegrationSpec extends IntegrationSpec {

  def messageSource

  def "Test that all keys exist for all languages"() {
    given:
    messageSource.metaClass.getAllMessageKeys = {Locale locale ->
      Set applicationKeys = delegate
                                .getMergedProperties(locale)
                                .getProperties()
                                .keySet()
      Set pluginsKeys = delegate
                            .getMergedPluginProperties(locale)
                            .getProperties()
                            .keySet()
      def unionOfKeys = applicationKeys + pluginsKeys
      unionOfKeys
    }

    when:
    Set danishKeys = messageSource
                         .getAllMessageKeys(new Locale('da'))
    Set englishKeys = messageSource
                         .getAllMessageKeys(new Locale('en'))
    def symmetricDifferenceSet = (englishKeys - danishKeys)
                               + (danishKeys - englishKeys)

    then:
    assert symmetricDifferenceSet.size() == 0
  }
}
{% endhighlight %}

The test uses metaprogramming to add a new method to `messageSource` that
retrieves all i18n keys of the application for a given locale. With this new
method I could then extract all keys for the `da` and `en` locales, compute
their [symmetric difference](http://en.wikipedia.org/wiki/Symmetric_difference),
and check that the symmetric difference set is empty. In case the set is not
empty, which it was not in my case, Spock will print the content of the set in
the error message, thus presenting you with the exact keys that need to be
translated.
