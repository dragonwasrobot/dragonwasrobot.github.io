+++
title = "Enum types in Kotlin, Elixir, and Elm"
author = ["Peter Urbak"]
date = 2016-10-02T00:00:00Z
tags = ["Elm", "Elixir", "Kotlin", "Enum types", "Functional Programming"]
categories = ["Musings"]
draft = false
+++

<div class="blockquote">

_“‘Begin at the beginning’, the King said, very gravely,_<br />
_‘and go on till you come to the end: then stop.’”_<br />
-- **Lewis Carroll**, Alice in Wonderland

</div>


## 1. Introduction {#1-dot-introduction}

The goal of this blog post is to define the concept of enum types and compare
the implementation of enum types in three different functional programming
languages: [Kotlin](https://kotlinlang.org/), [Elixir](https://elixir-lang.org/), and [Elm](http://elm-lang.org/).

The post is structured as follows. In Section [2](#2-dot-enum-types), we define the concept of enum
types. Then, in Sections [3](#3-dot-enum-types-in-kotlin), [4](#4-dot-enum-types-in-elixir), and [5](#5-dot-enum-types-in-elm) we look at concrete implementations of enum
types in Kotlin, Elixir, and Elm, respectively. The post is concluded in Section
[6](#6-dot-conclusion).


## 2. Enum types {#2-dot-enum-types}

In this section, we define the concept of enum types.

An enum - short for _enumerated_ - type is a [data type](https://en.wikipedia.org/wiki/Data_type) consisting of a set of
named values which we call the _members_ of the type. One of the most common
enum types in modern programming languages is the _boolean_ type, which has
exactly two members: **true** and **false**. We can express this boolean type in
an [ML](https://en.wikipedia.org/wiki/ML_(programming_language))-like syntax as:

```sml
datatype boolean
    = True
    | False
```

where we declare a `datatype` with the name `boolean` that has two [type
constructors](https://en.wikipedia.org/wiki/Type_constructor), `True` and `False` (separated by a `|`), corresponding to the two
members of the enum type. Consequently, any instance of the type `boolean` can
only have the value of either `True` or `False`, which allows us to do
exhaustive [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching) like so:

```sml
fun foo bool =
    case bool
    of True => (* do this if bool == True *)
     | False => (* do this if bool == False *)
```

where we define a function, `foo`, that takes an argument, `bool`, of type
`boolean` and _cases_ on its members/type constructors, `True` and `False`,
using a `case <var> of ...` expression.

For practical reasons, a boolean type is usually included by default in most
modern programming languages, so in the following three sections we instead look
at how to express a `shape` enum type, with members `Rectangle`, `Circle`, and
`Triangle`:

```sml
datatype shape
    = Rectangle
    | Circle
    | Triangle
```

in each of our three programming languages of choice. Furthermore, in order to
see how each language handles pattern matching, we also implement an example
function, `edges`, which takes an argument of type `shape` and returns the
number of edges of the given shape:

```sml
fun edges shape =
    case shape
    of Rectangle => 4
     | Circle => 0
     | Triangle => 3
```

In the next section, we implement `shape` and `edges` in Kotlin.


## 3. Enum types in Kotlin {#3-dot-enum-types-in-kotlin}

In this section, we implement the `shape` enum type and `edges` example function
in Kotlin.

Given [Java](https://en.wikipedia.org/wiki/Java_(programming_language))'s strong influence on Kotlin, it is no surprise that Kotlin has
inherited Java's [class-oriented paradigm](https://en.wikipedia.org/wiki/Class-based_programming), where all non-primitive data types are
defined in terms of classes. Furthermore, Kotlin has also inherited the `enum`
keyword from Java, which - as the name suggests - is used for defining enum
types (or classes). Thus, in order to define our custom enum type we declare our
new type as `enum class Shape` followed by listing each of the members of the
enum type, `Rectangle`, `Circle`, and `Triangle`:

```kotlin
enum class Shape {
    Rectangle,
    Circle,
    Triangle;
}
```

each separated by a `,` and terminated with a `;`.

Kotlin also allows us to do pattern matching on enums, as demonstrated below
where we define the `edges` function, which takes an argument of type `Shape`
and returns its number of edges:

```kotlin
fun edges(shape : Shape): Int {
    return when (shape) {
        Shape.Rectangle -> 4
        Shape.Circle -> 0
        Shape.Triangle -> 3
    }
}
```

Instead of a `case <var> of ...` expression, Kotlin uses a `when (var) {...}`
expression for pattern matching and as in our reference example in the previous
section, the body of the expression includes a clause for each of the members of
the enum type (class).

Before we move on, there are a few things worth noting about the above code
snippets:

-   Despite Kotlin's Java heritage, it allows us easily to separate data, `Shape`,
    and logic, `edges`, such that we do not have to introduce the concept of edges
    into our enum class definition as a method, but instead we can define a
    separate function, `edges`, somewhere else in the source code, resulting in
    lower [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)),
-   we do not need to include an `else` clause in the body of the `when`
    expression, as the pattern matching of `shape` in the `when` expression is
    exhaustive, and lastly,
-   since `edges` takes an argument of type `Shape` rather than `Shape?`, the
    type system enforces the constraint that `edges` cannot be called with a
    `null` reference, which helps make Kotlin code easier to reason about than
    traditional Java code, as it reduces the number of needed null checks.

Finally, in order to test the above code, we write a `main` function which
instantiates a variable of type `Shape` and prints the result of calling `edges`
on it:

```kotlin
fun main(args: Array<String>) {
    val rectangle = Shape.Rectangle
    println("A rectangle has ${edges(rectangle)} edges!")
    // ==> "A rectangle has 4 edges!"
}
```

Having implemented our `shape` enum type and `edges` example function in Kotlin,
while demonstrating how to pattern match on its members, we move on to repeat
the exercise in Elixir.


## 4. Enum types in Elixir {#4-dot-enum-types-in-elixir}

In this section, we implement the `shape` enum type and `edges` example function
in Elixir.

Unlike Kotlin, Elixir does not have a dedicated keyword or construct for
defining an enum type as part of the language, so instead we have to use the
`@type` directive to declare our own enum types. The `@type` directive allows us
to combine existing types, and instances of types, into new custom types. These
custom types can then be enforced by a static analysis tool like [dialyxir](https://github.com/jeremyjh/dialyxir), which
is used for type checking Elixir source code.

In order to define our `shape` enum in Elixir, we create a module named `Shape`
and declare a custom `@type` named `t` inside of it, where the members of `t`
are the [atoms](https://en.wikipedia.org/wiki/Symbol_(programming)) `:rectangle`, `:circle`, and `:triangle`:

```elixir
defmodule Shape do
  @type t :: :rectangle | :circle | :triangle
end
```

Here, `::` separates the name of the type, on the left, from its definition, on
the right, while `|` separates each of the members of the type, and finally `:`
is used for constructing each of the atoms.

Having defined the above module, we can then refer to the `shape` enum type as
`Shape.t`, in the same way as we would refer to the `String.t` type.

Similar to the Kotlin case, we define an example function, `edges`, which given
an argument of type `Shape.t`, returns the numbers of edges of the matched
`Shape.t` member, via pattern matching:

```elixir
@spec edges(Shape.t()) :: integer()
def edges(shape) do
  case shape do
    :rectangle -> 4
    :circle -> 0
    :triangle -> 3
  end
end
```

Here, the case expression used in Elixir, `case <var> do ...`, is very similar
to the case expression used in Section [2](#2-dot-enum-types), `case <var> of ...`, and likewise for
the actual clauses for each of the members.

Once again, we notice a few things about the code snippets above:

-   While Kotlin allowed us to separate the logic for calculating the number of
    edges from the actual definition of the `Shape` enum type, this is always the
    case in Elixir, as it does not include constructs for combining data and logic
    as classes, and
-   just as we used the `@type` directive to define our custom type, we use the
    `@spec` directive to state that the `edges` function takes as input a value of
    type `Shape.t` and returns a value of type `integer`.

Again, we can test the above code by instantiating a value of type `Shape.t` and
pass it to `edges`:

```elixir
rectangle = :rectangle
IO.puts("A rectangle has #{edges(rectangles)} edges!")
# ==> "A rectangle has 4 edges!"
```

While the function call and definition above looks very similar to the Kotlin
version, there is one distinctive difference: because of Elixir's dynamic type
checking, we cannot fully guarantee that `edges` is never given an argument that
is not of type `Shape` on runtime, which may result in a runtime error if we
don't include an `else`-clause in the `case` expression. However, by specifying
proper type signatures of our functions combined with Elixir's excellent type
inference engine and tools like dialyxir, all of which we have discussed above,
we can do much to reduce this risk without scattering `else`-clauses in our
code.

Finally, we note that we could also have written `edges` in a slightly more
Elixir idiomatic way:

```elixir
def edges(:rectangle), do: 4
def edges(:circle), do: 0
def edges(:triangle), do: 3
```

where we inline the pattern matching in the function declaration. In this
particular case, we chose the former style with the `case` expression as it
closer resembles the other example snippets.[^fn:1]

Having implemented our `shape` enum type and `edges` example function in both
Kotlin and Elixir, we move on to our final language example, Elm.


## 5. Enum types in Elm {#5-dot-enum-types-in-elm}

In this section, we implement the `shape` enum type and `edges` example function
in Elm.

In the case of Elm, we return to an ML-like syntax similar to what we saw at the
beginning of this post, where we define our type, `Shape`, using the `type`
keyword followed by listing each of the members of the type, `Rectangle`,
`Circle`, and `Triangle`, separated by `|`:

```elm
type Shape
    = Rectangle
    | Circle
    | Triangle
```

As in the Kotlin case, we can do exhaustive pattern matching without any
`else`-clause in our `case` expression, as the `Shape` type can only be
constructed using the three listed members:

```elm
edges : Shape -> Int
edges shape =
    case shape of
        Rectangle -> 4
        Circle -> 0
        Triangle -> 3
```

While the above snippets are very similar to the original examples in Section [2](#2-dot-enum-types),
there is the added function declaration, `edges : Shape -> Int`, which states
that `edges` takes a value of type `Shape` and returns a value of type `Int`.

Note also, that unlike Kotlin and Elixir, we do not even have to think about the
possibility of passing a `null` or `nil` reference to `edges`, as these concepts
are not even part of the Elm language.

Finally, in order to run the above code, we implement the `main` function, where
we instantiate a value of type `Shape`, pass it to the `edges` function, and
print it as a text DOM element:

```elm
main =
  let
    rectangle = Rectangle
  in
    text <| "A rectangle has " ++ (edges rectangle) ++ " edges!"
-- ==> "A rectangle has 4 edges!"
```

Having implemented our `shape` enum type and `edges` example function in our
third and final language, Elm, we conclude this post in the next section.


## 6. Conclusion {#6-dot-conclusion}

In this blog post, we have defined the concept of enum types, and compared the
implementation of enum types in the three different programming languages:
Kotlin, Elixir, and Elm.

Across the three implementations, we notice that Elixir is the only language
which does not have a dedicated keyword or construct for defining enum types
while Elm has the highest level of type safety by default, as it does not
include the concept of a null reference.

[^fn:1]: Given that Elixir allows us to write
    [macros](https://en.wikipedia.org/wiki/Macro_(computer_science)) - and thereby extend the language - we could take a third approach to
    enums: define our own keyword, `defenum`, for defining enums, which could then
    be used for hiding the actual implementation details of a given enum type.
