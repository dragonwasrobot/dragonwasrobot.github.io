---
layout: post
title: "Enumerated types<br/> in Kotlin, Elixir, and Elm"
category: programming
description: "In this post, we define the concept of enumerated types with
examples in Kotlin, Elixir, and Elm."
tags: [Elm, Elixir, Kotlin, Types, Enumerated types,
Functional programming, Programming languages]
---

*“‘Begin at the beginning’, the King said, very gravely,*<br/>
*‘and go on till you come to the end: then stop.’”*<br/>
-- **Lewis Carroll, Alice in Wonderland**

### 1. Introduction

The goal of this blog post is to define the concept of enumerated types and
compare the implementation of enumerated types in three different functional
programming languages:
[Kotlin](https://kotlinlang.org/), [Elixir](https://elixir-lang.org/),
and [Elm](http://elm-lang.org/).

The post is structured as follows. In Section [2](#2-enumerated-types), we
define the concept of enumerated types. Then, in
Sections [3](#3-enumerated-types-in-kotlin), [4](#4-enumerated-types-in-elixir),
and [5](#5-enumerated-types-in-elm) we look at concrete implementations of
enumerated types in Kotlin, Elixir, and Elm, respectively. The post is concluded
in Section [6](#6-conclusion).

### 2. Enumerated types

In this section, we define the concept of enumerated types.

An enumerated type - or just *enum* - is
a [data type](https://en.wikipedia.org/wiki/Data_type) consisting of a set of
named values which we call the *members* of the type. One of the most common
enumerated types in modern programming languages is the boolean type, which has
exactly two members: **true** and **false**. We can express this boolean type in
an [ML](https://en.wikipedia.org/wiki/ML_(programming_language))-like syntax
as:

{% highlight sml linenos %}
datatype boolean
    = True
    | False
{% endhighlight %}

where we declare a `datatype` with the name `boolean` that has
two [type constructors](https://en.wikipedia.org/wiki/Type_constructor), `True`
and `False` (separated by a `|`), corresponding to the two members of the
enumerated type. Consequently, any instance of the type `boolean` can only have
the value of either `True` or `False`, which allows us to do
exhaustive [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching)
like so:

{% highlight sml linenos %}
fun foo bool =
    case bool
    of True => (* do this if bool == True *)
     | False => (* do this if bool == False *)
{% endhighlight %}

where we define a function, `foo`, that takes an argument, `bool`, of type `boolean`
and cases on its members/type constructors, `True` and `False`.

For practical reasons, a boolean type is usually included by default in most
modern programming languages, so in the following three sections we instead look
at how to express another enumerated type, `color`, with members `Red`, `Green`,
and `Blue`:

{% highlight sml linenos %}
datatype color
    = Red
    | Green
    | Blue
{% endhighlight %}

in each of our three programming languages of choice. Furthermore, in order to
see how each language handles pattern matching, we also implement an example
function, `toHex`, which takes an argument of type `color` and returns the
the [hex color code](https://en.wikipedia.org/wiki/Web_colors) of the matched
color member:

{% highlight sml linenos %}
fun toHex color =
    case color
    of Red => "FF0000"
     | Green => "00FF00"
     | Blue => "0000FF"
{% endhighlight %}

In the next section, we implement `color` and `toHex` in Kotlin.

### 3. Enumerated types in Kotlin

In this section, we implement the enumerated type `color` in Kotlin.

Given [Java](https://en.wikipedia.org/wiki/Java_(programming_language))'s strong
influence on Kotlin, it is no surprise that Kotlin has inherited
Java's
[class-oriented paradigm](https://en.wikipedia.org/wiki/Class-based_programming),
where custom data types are defined in terms of classes. Likewise, it has also
inherited the `enum` keyword from Java, which - as the name suggests - is used
for defining enumerated types (or classes). Thus, in order to define our custom
enum type we declare our new type as `enum class Color` followed by listing each
of the members of the enum type, `Red`, `Green`, and `Blue`:

{% highlight kotlin linenos %}
enum class Color {
    Red,
    Green,
    Blue;
}
{% endhighlight %}

each separated by a `,` and terminated with a `;`.

Kotlin also allows us to do pattern matching on enums, as demonstrated below
where we define the example function, `toHex`, which takes an argument of type
`Color` and returns the hex color code of the matched color:

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
{% endhighlight %}

Instead of a `case <var> of ...` expression, Kotlin uses a `when (var) {...}`
expression for pattern matching and as in our reference example in the previous
section, the body of the expression includes a clause for each of the members of
the enum type (class).

Before we move on, there are a few things worth noting about the above code
snippets:

- Despite Kotlin's Java heritage, it allows us to separate data, `Color`, and
  logic, `toHex`, such that we do not have to introduce the concept of
  converting to hex color codes into our enum class as a method, but instead we
  can define a separate function, `toHex`, somewhere else in the source code,
  resulting in lower
  [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)),
- we do not need to include an `else` clause in the body of the `when`
  expression, as the pattern matching of `color` in `when` is exhaustive, and
  lastly,
-  since `toHex` takes an argument of type `Color` rather than `Color?`, the
   type system enforces the constraint that `toHex` cannot be called with a
   `null` reference, which helps make Kotlin code easier to reason about
   than traditional Java code.

Finally, in order to test the above code, we write a `main` function which
instantiates a variable of type `Color` and prints the result of calling `toHex`
on it:

{% highlight kotlin linenos %}
fun main(args: Array<String>) {
    val blue = Color.Blue
    println("Blue is '${toHex(blue)}' in hex!")
    // ==> "Blue is '0000FF' in hex!"
}
{% endhighlight %}

Having implemented our enumerated type, `color`, in Kotlin, and demonstrated how
to pattern matched on its members, we move on to repeat the exercise in Elixir.

### 4. Enumerated types in Elixir

In this section, we implement the enumerated type `color` in Elixir.

Unlike Kotlin, Elixir does not have a dedicated keyword or construct for
declaring enum types as part of the language, so instead we have to use the
`@type` directive to define our own enum types. The `@type` directive allows us
to combine existing types, and instances of types, into new custom types. These
custom types can then be enforced by a static analysis tool
like [dialyxir](https://github.com/jeremyjh/dialyxir), which is used for type
checking Elixir source code.

In order to define our `color` enum in Elixir, we create a module named `Color`
and declare a custom `@type` named `t` inside of it, where the members of `t`
are the [atoms](https://en.wikipedia.org/wiki/Symbol_(programming)) `:red`,
`:green`, and `:blue`:

{% highlight elixir linenos %}
defmodule Color do
  @type t :: :red | :green | :blue
end
{% endhighlight %}

Here, `::` separates the name of the type, on the left, from its definition, on
the right, while `|` separates each of the members of the type, and finally `:`
is used for constructing each of the atoms.

Having defined the above module, we can then refer to the `color` enum type as
`Color.t`, in the same way as we would refer to the `String.t` type. As in the
Kotlin case, we define a function, `to_hex`, which given an argument of type
`Color.t`, returns the hex color code of the matched `Color.t` member, via
pattern matching:

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
{% endhighlight %}

Here, the case expression used in Elixir, `case <var> do ...`, is very
similar to the case expression used in Section [2](#2-enumerated-types), `case
<var> of ...`, and likewise for the actual clauses for each of the members.

Once again, we notice a few things about the code snippets above:

- While Kotlin allowed us to separate the logic for converting to hex from the
  definition of the `Color` enum type, this is always the case in Elixir, as it
  does not include constructs for combining data and logic as classes, and
- just as we used the `@type` directive to define our custom type, we use the
  `@spec` directive to state that the `to_hex` function takes as input a value
  of type `Color.t` and returns a value of type `String.t`.

Again, we can test the above code by instantiating a value of type `Color.t` and
pass it to `to_hex`:

{% highlight elixir linenos %}
blue = :blue
IO.puts("Blue is '#{Example.to_hex(blue)}' in hex!")
# ==> "Blue is '0000FF' in hex!"
{% endhighlight %}

While the function call and definition above looks very similar to the Kotlin
version, there is one distinctive difference: because of Elixir's dynamic type
checking, we cannot fully guarantee that `to_hex` is never given an argument
that is not of type `Color` on runtime, which may result in a runtime error if
we don't include an *else*-clause in the `case` expression. However, by
specifying proper type signatures of our functions combined with Elixir's
excellent type inference engine and tools like dialyxir, all of which we have
discussed above, we can do much to reduce this risk without scattering
*else*-clauses in our code.

Finally, we note that we could also have written `to_hex` in a slightly more
idiomatic way:

{% highlight elixir %}
  def to_hex(:red), do: "FF0000"
  def to_hex(:green), do: "00FF00"
  def to_hex(:blue), do: "0000FF"
{% endhighlight %}

where we inline the pattern matching in the function declaration. In this
particular case, we chose the former style with the `case` expression as it
closer resembled the other example snippets.[^1]

Having implemented our enumerated type, `color`, in both Kotlin and Elixir, we
move on to our final language example, Elm.

### 5. Enumerated types in Elm

In this section, we implement the enumerated type `color` in Elm.

In the case of Elm, we return to an ML-like syntax similar to what we saw at the
beginning of this post, where we define our type, `Color`, using the `type`
keyword followed by listing each of the members of the type, `Red`, `Green`, and
`Blue`, separated by `|`:

{% highlight haskell linenos %}
type Color
    = Red
    | Green
    | Blue
{% endhighlight %}

As in the Kotlin case, we can do exhaustive pattern matching without any
*else*-clause in our `case` expression, as the `Color` type can only be
constructed using the three listed clauses:

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
{% endhighlight %}

While the above snippets are very similar to the original examples in
Section [2](#2-enumerated-types), there is the added function declaration,
`toHex : Color -> String`, which states that `toHex` takes a value of type
`Color` and returns a value of type `String`.

Note also, that unlike Kotlin and Elixir, we do not even have to think about the
possibility of passing a `null` or `nil` reference to `toHex`, as these concepts
are not even part of the Elm language.

Finally, in order to run the above code, we implement the `main` function, where
we instantiate a value of type `Color`, pass it to the `toHex` function and
print it as a text DOM element:

{% highlight haskell linenos %}
main =
  let
    blue = Blue
  in
    text <| "Blue is '" ++ (toHex blue) ++ "' in hex!"
-- ==> "Blue is '0000FF' in hex!"
{% endhighlight %}

Having implemented our enumerated type, `color`, in our third and final language,
Elm, we conclude this post in the next section.

### 6. Conclusion

In this blog post, we have defined the concept of enumerated types, and
compared the implementation of enumerated types in the three different
programming languages: Kotlin, Elixir, and Elm.

Across the three implementations, we notice that Elixir is the only language
which does not have a dedicated keyword or construct for defining enumerated
types while Elm has the highest level of type safety by default, as it does not
include the concept of a null reference.

[^1]: Given that Elixir allows us to
    write [macros](https://en.wikipedia.org/wiki/Macro_(computer_science)) - and
    thereby extend the language - we could take a third approach to enums:
    define our own keyword, `defenum`, for defining enums, which could then be
    used for hiding the actual implementation details of a given enum type.
