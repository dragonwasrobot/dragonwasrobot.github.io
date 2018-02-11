---
layout: post
title: "Enumerated types<br/> in Kotlin, Elixir, and Elm"
category: programming
description: "In this blog post, we discuss enumerated types in the context
of Kotlin, Elixir, and Elm."
tags: [Elm, Elixir, Kotlin, Types, enumerated types, tagged union types,
Functional programming, Programming languages]
---

*“‘Begin at the beginning’, the King said, very gravely,*<br/>
*‘and go on till you come to the end: then stop.’”*<br/>
-- **Lewis Carroll, Alice in Wonderland**

### 1. Introduction

In this blog post, and the next, we discuss enumerated types and tagged unions
in the context
of [Kotlin](https://kotlinlang.org/), [Elixir](https://elixir-lang.org/),
and [Elm](http://elm-lang.org/). Specifically, we first introduce the concept
of [enumerated types](https://en.wikipedia.org/wiki/Enumerated_type)
and [tagged unions](https://en.wikipedia.org/wiki/Tagged_union) and then look at
and discuss their implementations in each of the three programming languages.

This first post only focuses on enumerated types and is structured as
follows. In Section [2](#2-enumerated-types), we start by defining enumerated
types. Then, in
Sections [3](#3-enumerated-types-in-kotlin), [4](#4-enumerated-types-in-elixir),
and [5](#5-enumerated-types-in-elm) we look at enums in Kotlin, Elixir, and Elm,
respectively. The post is concluded in Section [6](#6-conclusion).

### 2. Enumerated types

An enumerated type - or just *enum* - is a data type consisting of a set of
named values which we call the *members* of the type. One of the most common
enumerated types in programming languages is the boolean type, which has two
members, **true** and **false**. We can express our boolean type in a
pseudo [ML](https://en.wikipedia.org/wiki/ML_(programming_language))-like
language as:

{% highlight haskell %}
type Boolean = True
             | False
{% endhighlight %}

where we declare `Boolean` to be a `type` that has
two [type constructors](https://en.wikipedia.org/wiki/Type_constructor), `True`
and `False`. Consequently, any instance of the type `Boolean` can only have the
value of either `True` or `False`, separated by a vertical bar (`|`), which
allows us to do
exhaustive [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching)
like so:

{% highlight haskell %}
case bool of
    True ->
        -- do something

    False ->
        -- do something else
{% endhighlight %}

For pragmatic reasons a boolean type is usually included by default in most
programming languages, so in the following subsections we look at how to express
an enumerated type `Color` with members `Red`, `Green`, and `Blue` in our three
languages of choice.

### 3. Enumerated types in Kotlin

Given [Java](https://en.wikipedia.org/wiki/Java_(programming_language))'s strong
influence on Kotlin, it is no surprise that Kotlin has inherited the `enum`
keyword from Java, and that it is used in much the same way as in Java. Thus, in
order to define our enum type (or class) we simply write `enum class Color`
followed by listing the members `Red`, `Green`, and `Blue`:

{% highlight kotlin linenos %}
enum class Color {
    Red, Green, Blue;
}
{% endhighlight %}

Kotlin also allows us to do pattern matching on enums, as
demonstrated below where we define a function that converts a value of type
`Color` into the string representing of
the [hex color code](https://en.wikipedia.org/wiki/Web_colors) of the matched
color:

{% highlight kotlin linenos %}
fun toHex(color: Color): String {
    return when (color) {
        Color.Red ->
            "FF0000"

        Color.Green ->
            "00FF00"

        Color.Blue ->
            "0000FF"
    }
}

fun main(args: Array<String>) {
    val blue = Color.Blue
    println("Blue is '${toHex(blue)}' in hex!")
    // ==> "Blue is '0000FF' in hex!"
}
{% endhighlight %}

There are a few things worth noting about the above code snippets before we
continue:

- Kotlin allows us to separate data and logic, `Color` and `toHex`, such that we
  do not have to bundle the concept of hex color codes with our enum class as a
  method, but can instead define a separate function, `toHex`, somewhere else in
  the code, resulting in
  lower
  [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) of
  the code,
- we do not need to include an `else` clause in the `when` expression, as the
  pattern matching in `when` is exhaustive, and lastly,
-  since `toHex` takes an argument of type `Color` rather than `Color?`, the
   type system ensures us that `toHex` cannot be called with a `null` reference.

Having seen how we define an pattern match on an enum type in Kotlin, we move
on to look at enums in Elixir.

### 4. Enumerated types in Elixir

Unlike Kotlin, Elixir does not have an explicit enum type as part of the
language, so instead we have to use the `@type` directive to define one
ourselves, by combining existing types into our custom enum type, and
subsequently use [dialyxir](https://github.com/jeremyjh/dialyxir) to type check
our code.

In order to define our `Color` enum in Elixir, we create a module named `Color`
and declare the type `t` inside of it, where the members of `t` are
the [atoms](https://en.wikipedia.org/wiki/Symbol_(programming)) `:red`,
`:green`, and `:blue`:

{% highlight elixir linenos %}
defmodule Color do
  @type t :: :red | :green | :blue
end
{% endhighlight %}

Then, we can refer to the `Color` type as `Color.t`, in the same way as we
would refer to the `String.t` type. As before, we define a function `to_hex`
which returns the string representation of the hex color code of a value of type
`Color` via pattern matching:

{% highlight elixir linenos %}
defmodule Example do
  alias Color

  @spec to_hex(Color.t) :: String.t
  def to_hex(color) do
    case color do
      :red ->
        "FF0000"

      :green ->
        "00FF00"

      :blue ->
        "0000FF"
    end
  end
end

blue = :blue
IO.puts("Blue is '#{Example.to_hex(blue)}' in hex!")
# ==> "Blue is '0000FF' in hex!"
{% endhighlight %}

While this function looks very similar to the Kotlin version, we cannot 100%
guarantee on runtime that `to_hex` is never given an argument that is not
of type `Color`, in which case, if we don't include and `else` clause in the
`case` expression, Elixir will throw an error. However, by specifying proper
type signatures of our functions combined with Elixir's excellent type inference
engine and tools like dialyxir, we can do much to reduce this risk.

Do note that we could also have written `to_hex` in a slightly more idiomatic
way:

{% highlight elixir %}
  def to_hex(:red), do: "FF0000"
  def to_hex(:green), do: "00FF00"
  def to_hex(:blue), do: "0000FF"
{% endhighlight %}

but chose the former as it closer resembles the Kotlin code.

Finally, know that the above example is not the only way we could try to emulate
enums in Elixir. Given that Elixir allows us to
write [macros](https://en.wikipedia.org/wiki/Macro_(computer_science)) - and
thus extend the language - we could actually define our own keyword, `defenum`,
for defining enums. Not only would this have the added benefit of hiding the
implementation details of a given enum type, it would also allow us to use enums
when pattern matching in guard- and case expressions, i.e. `when color ==
Color.red` hides the actual value used to represent `red` while `when color ==
:red` shows that it is indeed an atom.

Next, we take a look at enum types in Elm.

### 5. Enumerated types in Elm

In the case of Elm, we return to the ML-like syntax we saw at the beginning of
this blog post, where we define our type, `Color`, using the `type` keyword
followed by listing each of the members of the type, `Red`, `Green`, and `Blue`:

{% highlight haskell linenos %}
type Color
    = Red
    | Green
    | Blue
{% endhighlight %}

As in the Kotlin case, we can do exhaustive pattern matching without any `else`
clause in our `case`, as the `Color` type can only be constructed using the
three listed clauses:

{% highlight haskell linenos %}
toHex : Color -> String
toHex color =
    case color of
        Red ->
            "FF0000"

        Green ->
            "00FF00"

        Blue ->
            "0000FF"

main =
  text <| "Blue is '" ++ (toHex Blue) ++ "' in hex!"
-- ==> "Blue is '0000FF' in hex!"
{% endhighlight %}

Unlike Kotlin and Elixir, we do not even have to think about the possibility of
a value being `null` or `nil` as these are not even part of the Elm language.

### 6. Conclusion

This finishes the first part of our two-part series on enumerated types and
tagged unions in Kotlin, Elixir and Elm. In the second part, we go through
each of the three languages again and examine the jump from enumerated types to
tagged unions and how these are related.
