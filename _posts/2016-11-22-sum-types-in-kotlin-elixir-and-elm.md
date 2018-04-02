---
layout: post
title: "Sum types in Kotlin, Elixir, and Elm"
category: programming
description: "In this post, we define the concept of sum types with
examples in Elm, Elixir, and Kotlin."
tags: [Elm, Elixir, Kotlin, Types, sum types,
Functional programming, Programming languages]
---

#### prerequisites: The post [Enumerated types in Elm, Elixir, and Kotlin]({% post_url 2016-10-02-enumerated-types-in-kotlin-elixir-and-elm %})

*“All for one and one for all, united we stand divided we fall.”*<br/>
-- **Alexandre Dumas, The Three Musketeers**

### 1. Introduction

The goal of this blog post is to define the concept of sum types and
compare the implementation of sum types in three different functional
programming
languages:
[Kotlin](https://kotlinlang.org/), [Elixir](https://elixir-lang.org/),
and [Elm](http://elm-lang.org/).

The post is structured as follows. In Section [2](#2-sum-types), we define the
concept of sum types. Then, in
Sections [3](#3-sum-types-in-kotlin), [4](#4-sum-types-in-elixir),
and [5](#5-sum-types-in-elm) we look at concrete implementations of sum types in
Kotlin, Elixir, and Elm, respectively. The post is concluded in
Section [6](#6-conclusion).

### 2. Sum types

In this section, we define the concept of sum types.

In our previous post, we defined an enumerated type as a "data type consisting
of a set of named values which we call the *members* of the type", e.g. we
defined `color` as:

{% highlight sml linenos %}
datatype color
    = Red
    | Green
    | Blue
{% endhighlight %}

In the case of a sum type (sometimes called a tagged union), we may look at it
as a generalization of the enumerated type, where each member of a sum type may
take its own set of arguments. Conversely, we may also look at enumerated types
as the subset of sum types for which each member is
a [unit type](https://en.wikipedia.org/wiki/Unit_type), i.e. each member's type
constructor takes zero arguments. For example, if we wanted to define a `shape`
type that can be either a `Rectangle` or a `Circle`, it would make sense to
define each of these members in terms of their mathematical definition, i.e. a
rectangle has a *height* and *width* while a circle has a *radius*. In our
ML-like syntax, we could express our `shape` type and its members as:

{% highlight sml linenos %}
datatype shape
    = Rectangle of float * float (* height and width *)
    | Circle of float (* radius *)
{% endhighlight %}

where we declare a `datatype` with the name `shape` and two type constructors,
`Rectangle` and `Circle`, where the first type constructor, `Rectangle`, takes
two `float` values, the `height` and `width` (separated by a `*`, not be
confused with the multiplication operator), while the second type constructor,
`Circle`, takes a single `float` value, the `radius`.

As in the case of enumerated types, we can pattern match on sum types. As an
example, let us write a function that given an instance of the `shape` sum type
returns the calculated area of that shape, which we can express in our ML-like
syntax as:

{% highlight sml linenos %}
fun area shape =
    case shape
    of Rectangle (height, width) => height * width
     | Circle (radius) => 3.14 * radius * radius
{% endhighlight %}

The `area` function pattern matches on the type constructor of the `shape`
argument, i.e. `Rectangle` and `Circle`, and in doing so also unwraps the
arguments of each type constructor as binds these to suitable variable names,
thereby allowing us to calculate the area of the shape in the matched clause.

In the following three sections, we look at how to express the above `shape` sum
type, along with the `area` example function, in order to get an understanding
of how each of our three programming languages implement sum types and handle
pattern matching on sum types.

### 3. Sum types in Kotlin

In this section, we implement the sum type `shape` in Kotlin.

If we look at the definition of the enumerated type we defined in the previous
post:

{% highlight kotlin linenos %}
enum class Color {
    Red,
    Green,
    Blue;
}
{% endhighlight %}

we might expect that we could simply add the needed set of arguments to each of
the defined members in order to obtain the desired sum type. Unfortunately,
while an `enum class` is actually able to take a set of arguments, these are
declared for the whole class and not for the individual member, which in the
`shape` case means we cannot declare type constructors for `Rectangle` and
`Circle` with different sets of arguments. Luckily, Kotlin has introduced the
concept of
a [sealed class](https://kotlinlang.org/docs/reference/sealed-classes.html),
which allows us to define a *"restricted class hierarchies, when a value can
have one of the types from a limited set, but cannot have any other type"* which
sounds a lot like our definition of a sum type. Thus, in order to define our
custom sum type we declare our new type as `sealed class Shape` followed by a
class declaration for each of the members of the sum type, `Rectangle` and
`Circle`, each of which then has to be declared as a subclass of `Shape`:

{% highlight kotlin linenos %}
sealed class Shape
data class Rectangle(val height: Float,
                     val width: Float) : Shape()
data class Circle(val radius: Float) : Shape()
{% endhighlight %}

Note that Kotlin allows us to assign names to the parameters of each member
class, which was not the case in our ML-like reference example.

As previously discussed, we like to separate data and logic, and therefore we
also declare the two member classes, `Rectangle` and `Circle`,
as [data class](https://kotlinlang.org/docs/reference/data-classes.html), as we
just want them to store data and not have any logic beyond the standard utility
methods like `equals`, `toString`, etc.

Just as we could pattern match on instances of an `enum class` using a `when
(<var>) {...}` expression, so is it the case for instances of a `sealed
class`. Thus, we define our `area` function in Kotlin as:

{% highlight kotlin linenos %}
fun area(shape: Shape) : Number {
    return when (shape) {
        is Rectangle ->
            shape.height * shape.width

        is Circle ->
            Math.PI * shape.radius * shape.radius
    }
}
{% endhighlight %}

A few details worth noting:

- We use the `is` keyword in each of the matching clauses as we are matching on
  a subclass and not a specific value, and
- Kotlin *smart casts* the `shape` variable into its correct member type,
  e.g. we do not have to cast `shape` as a `Rectangle` in order to access
  `shape.height` once we are inside the body of the `is Rectangle` clause.

Finally, we can run the above code by implementing the `main` function,
instanting a variable of type `Shape` and passing it to the `area` function:

{% highlight kotlin linenos %}
fun main(args: Array<String>) {
    val circle = Circle(4.2F)
    println("The circle has an area of '${area(circle)}'!")
    /* ==> The circle has an area of '55.4176893759496'! */
}
{% endhighlight %}

Having implemented our sum type, `shape`, in Kotlin, and demonstrated how to
pattern match on its members, we move on to repeat the exercise in Elixir.

### 4. Sum types in Elixir

In this section, we implement the sum type `shape` in Elixir.

As in the case of the enumerated type, `color`, we create a module named `Shape`
and use the `@type` directive to define a type named `t`, which is either a
`Rectangle.t` or `Circle.t` type:

{% highlight elixir linenos %}
defmodule Shape do
  alias Rectangle
  alias Circle

  @type t :: Rectangle.t | Circle.t
end
{% endhighlight %}

we repeat the exercise for `Rectangle.t` and `Circle.t`, but this time we also
have to define the actual data structures - using `defstruct` - which will holdi
the data of the types, i.e. `height` and `width`, and `radius`, respectively:

{% highlight elixir linenos %}
defmodule Rectangle do
  @type t :: %__MODULE__{height: float, width: float}
  defstruct [height: 0.0, width: 0.0]
end

defmodule Circle do
  @type t :: %__MODULE__{radius: float}
  defstruct [radius: 0.0]
end
{% endhighlight %}

In the `@type` declaration, `__MODULE__` refers to the name of the enclosing
module and `%<name>{<property_name>: <property_type>}` construct declares a
`struct` type called `<name>` and with a set of
`<property_name>: <property_type>` pairs. The actual data structure is defined
by the `defstruct` keyword which takes a list of properties
`[<property_name>: <default_value>]` as its arguments.

Having defined our `Shape.t` type and its members, `Rectangle.t` and `Circle.t`,
we can now define our `area` function which takes an argument of type `Shape.t`
and calculates the area of the shape by pattern matching on the concrete member
of the `shape` sum type:

{% highlight elixir linenos %}
defmodule Example do
  alias Rectangle
  alias Circle
  alias Shape

  @spec area(Shape.t) :: float
  def area(shape) do
    case shape do
      %Rectangle{height: h, width: w} ->
        h * w

      %Circle{radius: r} ->
        :math.pi * r * r
    end
  end
end
{% endhighlight %}

While the `case <var> do ...` expression is similar to the one we used for
enumerated types, we do note that - as in the Kotlin case - we automatically
unwrap the arguments of the matching member/type constructor and bind these to
suitable variable names.

As in the enumerated type case, we could also have inlined the pattern matching
in the function header of `area` like so:

{% highlight elixir linenos %}
  def area(%Rectangle{height: h, width: w}), do: h * w
  def area(%Circle{radius: r}), do: :math.pi * r * r
{% endhighlight %}

Finally, we can test the above code by instantiating a value of type `Shape.t`
and pass it to the `area` function:

{% highlight elixir linenos %}
circle = %Circle{radius: 4.2}
IO.puts "The circle has an area of '#{Example.area(circle)}'!"
# ==> 55.41769440932395
{% endhighlight %}

Having implemented our sum type, `shape`, in both Kotlin and Elixir, we move on
to our final language example, Elm.

### 5. Sum types in Elm

In this section, we implement the sum type `shape` in Elm.

In the case of Elm, we once again return to the ML-like syntax we saw at the
beginning of this post, where we define our sum type, `Shape`, using the `type`
keyword followed by listing each of the members of the type, `Rectangle` and
`Circle`:

{% highlight haskell linenos %}
type Shape
    = Rectangle Float Float -- height and width
    | Circle Float -- radius
{% endhighlight %}

Here, we simply separate the arguments of each type constructor by a space
instead of a `*`. It is worth appreciating that in order to go from an enum type
to a sum type in Elm, all we had to do was add arguments to the type
constructors of the members of the type. Unsurprisingly, Elm does not make an
actual distinction between enum and sum types, but sees the former as a subset
of the later, as we also discussed in Section [2](#2-sum-types).

The similarity to our ML-like syntax also holds in the case of pattern matching
in the `area` function:

{% highlight haskell linenos %}
area : Shape -> Float
area shape =
    case shape of
        Rectangle height width ->
            height * width

        Circle radius ->
            pi * radius ^ 2
{% endhighlight %}

where the difference are minor. Finally, we can run the above code snippets by
implementing the `main` function, where we instantiate a value of type `Circle`,
pass it to the `area` function and print it as a `text` DOM element:

{% highlight haskell linenos %}
main =
    let
        circle =
            Circle 4.2
    in
        text <|
            "The circle has an area of '"
                ++ (toString <| area <| circle)
                ++ "'!"
-- ==> "The circle has an area of '55.41769440932395'!"
{% endhighlight %}

### 6. Conclusion

In this blog post, we have defined the concept of sum types, and compared the
implementation of sum types in the three different programming languages:
Kotlin, Elixir, and Elm.

While all three languages supported the concept of sum types, it is noticeable
that Elm required the least introduction of new syntax, as it does not really
make a distinction between enumerated types and sum types, as the former can
be expressed in terms of the latter.
