---
layout: post
title: "Sum types in Kotlin, Elixir, and Elm"
category: functional programming
description: "In this post, we define the concept of sum types with
examples in Elm, Elixir, and Kotlin."
tags: [Elm, Elixir, Kotlin, Types, Sum types, Functional basics,
Functional programming, Programming languages]
---

#### prerequisites: The post [Product types in Elm, Elixir, and Kotlin]({% post_url 2016-11-14-product-types-in-kotlin-elixir-and-elm %})

*“We are our choices.”*<br/>
-- **Jean-Paul Sartre**

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

In our
[post on enum types]({% post_url 2016-10-02-enum-types-in-kotlin-elixir-and-elm %}),
we defined an enum type as a "data type consisting of a set of named
values which we call the *members* of the type", e.g. we defined `shape` as:

{% highlight sml linenos %}
datatype shape
    = Rectangle
    | Circle
    | Triangle
{% endhighlight %}

In the case of a sum type (sometimes called a tagged union), we may look at it
as a generalization of the enum type, where each member of a sum type may
take its own set of arguments. Conversely, we may also look at enum types
as the subset of sum types for which each member is
a [unit type](https://en.wikipedia.org/wiki/Unit_type), i.e. each member's type
constructor takes zero arguments.

In our
[post on product types]({% post_url 2016-11-14-product-types-in-kotlin-elixir-and-elm %})
we implemented three different types of shapes: rectangle, circle, and
triangle. Now, with the above definition of sum types in mind, we want to define
a `shape` type that can be either a `Rectangle`, a `Circle`, or a `Triangle`. In
our ML-like syntax, we could express our `shape` type and its members as:

{% highlight sml linenos %}
datatype shape
    = Rectangle of float * float (* height and width *)
    | Circle of float (* radius *)
    | Triangle of float * float (* base and height *)
{% endhighlight %}

where we declare a `datatype` with the name `shape` and three type constructors,
`Rectangle`, `Circle`, and `Triangle`, where the first type constructor,
`Rectangle`, takes two `float` values, the `height` and `width`, the second type
constructor, `Circle`, takes a single `float` value, the `radius`, and the third
type constructor, `Triangle`, takes two `float` values, the `base` and `height`.
This scenario reminds us of the issue with tuple types we discussed in the
previous post, i.e. it is not clear which of the arguments has which semantic
meaning. Fortunately, we can substitute the `float * float` arguments to the
`Rectangle` type constructor, with the `rectangle` product type we defined in
the previous post:

{% highlight sml linenos %}
datatype rectangle
    = ( height of float * width of float )
{% endhighlight %}

and likewise for the `Circle` type constructor:

{% highlight sml linenos %}
datatype circle
    = ( radius of float )
{% endhighlight %}

and `Triangle` type constructor:

{% highlight sml linenos %}
datatype triangle
    = ( base of float * height of float )
{% endhighlight %}

Combining all this, we get the following definition of the `shape` sum type:

{% highlight sml linenos %}
datatype shape
    = Rectangle of rectangle
    | Circle of circle
    | Triangle of triangle
{% endhighlight %}

where the semantic meaning of the arguments to each of the type constructors is
now more obvious. Note that being able to create these kinds of types that are
compositions of both sum- and product types are what we usually refer to
as [Algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type).

As in the case of enum types, we can pattern match on sum types. This provides
the opportunity for us to merge the three different area functions of the
previous post into one `area` function that takes an instance of the `shape` sum
type as argument, pattern matches on its type constructor and calculates the
area of that type of shape. We express this `area` function in our ML-like
syntax as:

{% highlight sml linenos %}
fun area shape =
    case shape
    of Rectangle rectangle =>
         rectangle.height * rectangle.width
     | Circle circle =>
         3.14 * circle.radius * circle.radius
     | Triangle triangle =>
         0.5 * triangle.base * triangle.height
{% endhighlight %}

As postulated above, we can see that the `area` function pattern matches on the
type constructor of the `shape` argument, i.e. `Rectangle`, `Circle` and
`Triangle`, and in doing so also unwraps the arguments of each type constructor
and binds these to suitable variable names, thereby allowing us to calculate the
area of the shape in the matched clause. As in the previous post, we can also
destructure the arguments and directly access their fields in each of the
clauses:

{% highlight sml linenos %}
fun area shape =
    case shape
    of Rectangle (height, width) =>
         height * width
     | Circle (radius) =>
         3.14 * radius * radius
     | Triangle (base, height) =>
         0.5 * base * height
{% endhighlight %}

thus removing the need to qualify the use of the different field values in the
body expression of each of the clauses.

In the following three sections, we look at how to express the above `shape` sum
type, along with the `area` example function, in each of our three programming
languages.

### 3. Sum types in Kotlin

In this section, we implement the `shape` sum type and `area` function in
Kotlin.

If we look at the definition of the enum type we defined in the previous
post:

{% highlight kotlin linenos %}
enum class Shape {
    Rectangle,
    Circle,
    Triangle;
}
{% endhighlight %}

we might expect that we could simply add the needed set of arguments to each of
the defined members in order to obtain the desired sum type. Unfortunately,
while an `enum class` is actually able to take a set of arguments, these are
declared for the whole class and not for the individual member, which is too
constrained to fit with our definition above of sum types. Luckily, Kotlin has
introduced the concept of
a [sealed class](https://kotlinlang.org/docs/reference/sealed-classes.html),
which allows us to define a *"restricted class hierarchies, when a value can
have one of the types from a limited set, but cannot have any other type"* which
sounds a lot like our definition of a sum type. Thus, in order to define our
custom sum type we declare our new type as `sealed class Shape` followed by a
class declaration for each of the members of the sum type, `Rectangle`,
`Circle`, and `Triangle`, each of which then has to be declared as a subclass of
`Shape`:

{% highlight kotlin linenos %}
sealed class Shape
data class Rectangle(val height: Float,
                     val width: Float) : Shape()
data class Circle(val radius: Float) : Shape()
data class Triangle(val base: Float,
                     val height: Float) : Shape()
{% endhighlight %}

Note that in contrast to our ML-like example, we do not explicitly list each of
the members of our `Shape` sum type when declaring it, but instead do it
implicitly as we define each of the actual member types and declare a member
type to be a subclass of `Shape`.

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

        is Triangle ->
            0.5 * triangle.base * triangle.height
    }
}
{% endhighlight %}

A few details worth noting:

- We use the `is` keyword in each of the matching clauses as we are matching on
  a subclass type and not a specific value, and
- Kotlin *smart casts* the `shape` variable into its correct member type,
  e.g. we do not have to cast `shape` as a `Rectangle` in order to access
  `shape.height` once we are inside the body expression of the `is Rectangle`
  clause.

Finally, we can run the above code by implementing the `main` function,
instanting a variable of type `Shape` and passing it to the `area` function:

{% highlight kotlin linenos %}
fun main(args: Array<String>) {
    val circle = Circle(4.2F)
    println("The circle has an area of ${area(circle)}!")
    /* ==> The circle has an area of 55.4176893759496! */
}
{% endhighlight %}

Having implemented our `shape` sum type and `area` function in Kotlin, we move
on to repeat the exercise in Elixir.

### 4. Sum types in Elixir

In this section, we implement the `shape` sum type and `area` function in
Elixir.

As in the case of the `shape` enum type, we create a module named `Shape` and
use the `@type` directive to define a type named `t`, which is either a
`Rectangle.t`, `Circle.t` or `Triangle.t` type:

{% highlight elixir linenos %}
defmodule Shape do
  alias Rectangle
  alias Circle
  alias Triangle

  @type t :: Rectangle.t | Circle.t | Triangle.t
end
{% endhighlight %}

where `Rectangle.t`, `Circle.t` and `Triangle.t` correspond to the product types
we defined in our previoust post:

{% highlight elixir linenos %}
defmodule Rectangle do
  @type t :: %__MODULE__{height: float, width: float}
  defstruct [height: 0.0, width: 0.0]
end

defmodule Circle do
  @type t :: %__MODULE__{radius: float}
  defstruct [radius: 0.0]
end

defmodule Triangle do
  @type t :: %__MODULE__{base: float, height: float}
  defstruct [base: 0.0, height: 0.0]
end
{% endhighlight %}

Having defined our `Shape.t` type and its members, `Rectangle.t`, `Circle.t` and
`Triangle.t`, we can now define our `area` function which takes an argument of
type `Shape.t` and calculates the area of the shape by pattern matching on the
concrete member of the `shape` sum type:

{% highlight elixir linenos %}
defmodule Example do
  alias Rectangle
  alias Circle
  alias Triangle
  alias Shape

  @spec area(Shape.t) :: float
  def area(shape) do
    case shape do
      %Rectangle{height: height, width: width} ->
        height * width

      %Circle{radius: radius} ->
        :math.pi * radius * radius

      %Triangle{base: base, height: height} ->
        0.5 * base * height
    end
  end
end
{% endhighlight %}

While the `case <var> do ...` expression is similar to the one we used for
enum types, we do note that - as in the Kotlin case - we automatically
unwrap the arguments of the matching member/type constructor and bind these to
suitable variable names.

Finally, we can test the above code by instantiating a value of type `Shape.t`
and pass it to the `area` function:

{% highlight elixir linenos %}
circle = %Circle{radius: 4.2}
IO.puts "The circle has an area of #{area(circle)}!"
# ==> The circle has an area of 55.41769440932395!
{% endhighlight %}

Having implemented our `shape` sum type and `area` function in both Kotlin and
Elixir, we move on to our final language example, Elm.

### 5. Sum types in Elm

In this section, we implement the `shape` sum type and `area` function in Elm.

In the case of Elm, we once again return to the ML-like syntax we saw at the
beginning of this post, where we define our sum type, `Shape`, using the `type`
keyword followed by listing each of the members of the type, `Rectangle`,
`Circle`, and `Triangle`:

{% highlight haskell linenos %}
type Shape
    = Rectangle { height: Float, width: Float }
    | Circle { radius: Float }
    | Triangle { base : Float, height: Float }
{% endhighlight %}

Here, we simply inline the definition of `Rectangle`, `Circle`, `Triangle` from
our previous post into their corresponding clauses in the `Shape` sum
type. Alternatively, we would have to change the names of the clauses or
argument types in order to avoid names clashing, e.g.

{% highlight haskell linenos %}
type Shape
    = RectangleShape Rectangle
    | CircleShape Circle
    | TriangleShape Triangle
{% endhighlight %}

which in this case is less aesthetic than the former definition.

It is worth appreciating that in order to go from an enum type to a sum type in
Elm, all we had to do was add arguments to the members / type constructors of
the type. Unsurprisingly, Elm does not make an actual distinction between enum
and sum types, but sees the former as a subset of the later, as we also
discussed in Section [2](#2-sum-types).

The similarity to our ML-like syntax also holds in the case of pattern matching
in the `area` function:

{% highlight haskell linenos %}
area : Shape -> Float
area shape =
    case shape of
        Rectangle { height, width } ->
            height * width

        Circle { radius } ->
            pi * radius * radius

        Triangle { base, height } ->
            0.5 * base * height

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
            "The circle has an area of " ++
                (toString <| area <| circle) ++
                "!"
-- ==> "The circle has an area of 55.41769440932395!"
{% endhighlight %}

### 6. Conclusion

In this blog post, we have defined the concept of sum types, and compared the
implementation of sum types in the three different programming languages:
Kotlin, Elixir, and Elm.

While all three languages supported the concept of sum types, it is noticeable
that Elm required the least introduction of new syntax, as it does not really
make a distinction between enum types and sum types, as the former can
be expressed in terms of the latter.
