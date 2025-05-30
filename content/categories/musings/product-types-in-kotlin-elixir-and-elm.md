+++
title = "Product types in Kotlin, Elixir, and Elm"
author = ["Peter Urbak"]
date = 2016-11-14T00:00:00Z
tags = ["Elm", "Elixir", "Kotlin", "Product types", "Functional Programming"]
categories = ["Musings"]
draft = false
+++

<div class="blockquote">

_“All for one and one for all,_<br />
_united we stand divided we fall.”_<br />
-- **Alexandre Dumas**, The Three Musketeers

</div>


## 1. Introduction {#1-dot-introduction}

This is a follow-up post to [Enum types in Kotlin, Elixir, and Elm](/categories/musings/enum-types-in-kotlin-elixir-and-elm). The goal of
this blog post is to define the concept of product types and compare the
implementation of product types in three different functional programming
languages: [Kotlin](https://kotlinlang.org/), [Elixir](https://elixir-lang.org/), and [Elm](http://elm-lang.org/).

The post is structured as follows. In Section [2](#2-dot-product-types), we define the concept of
product types. Then, in Sections [3](#3-dot-product-types-in-kotlin), [4](#4-dot-product-types-in-elixir), and [5](#5-dot-product-types-in-elm) we look at concrete implementations
of product types in Kotlin, Elixir, and Elm, respectively. The post is concluded
in Section [6](#6-dot-conclusion).


## 2. Product types {#2-dot-product-types}

In this section, we define the concept of product types.

A product type is a composite data type that compounds two or more types in a
fixed order; we call these compounded types the _fields_ of the product type. A
common example of a product type is the _point_ type, which compounds two float
types, corresponding to an _x-_ and a _y-coordinate_, into a new type. We can
express this point type in our ML-like syntax as:

```sml
datatype point
    = float * float (* x and y *)
```

where we declare `point` as a `datatype` consisting of two float values, the x-
and y-coordinate, separated by a `*` (not be confused with the multiplication
operator). Any instance of the `point` type is then a [tuple](https://en.wikipedia.org/wiki/Tuple) of two floats, e.g.
`(3, 2)`. We can access the fields of such a tuple using pattern matching -
sometimes also called destructuring:

```sml
val p = (3, 2)
val (x, y) = p
x + y
(* ==> 5 *)
```

Here, we construct a `point` named `p` as the tuple `(3, 2)`, then assign its
fields to `x` and `y`, by pattern matching on the structure of the tuple, and
finally add them together. Product types defined in terms of tuples may also be
called _tuple types_.

Unfortunately, defining products as tuples has the downside that it is not clear
from the actual definition of a type what is the semantic meaning behind each of
its fields, e.g. without the comment in the definition of the `point` type
above, it is not clear which `float` corresponds to `x` and which one
corresponds to `y`. However, we can improve the situation by requiring that each
field of a product type has to be assigned a name, which gives us the following
new definition of the `point` type:

```sml
datatype point
    = x of float * y of float
```

Any instance of the `point` type is now a tuple with named fields, e.g. `(x = 3,
y = 2)`. Product types defined in terms of named fields are also called _record
types_ or _structs_.

Accessing the named fields of a product type, without having to pattern match on
its whole structure, is straightforward, as seen in the following example, where
we compute the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) between two points, `p` and `q`:

```sml
fun euclidean_distance p q =
    sqrt (pow (q.x - p.x) 2 + pow (q.y - p.y) 2)
```

Here, we access an individual field using the common `<var>.<field>` expression.

In each of the following sections, we return to the `shape` example from our
[previous post](/categories/musings/enum-types-in-kotlin-elixir-and-elm), and implement product type versions of each of the different
shapes: `rectangle`, `circle`, and `triangle`. Specifically, we define each of
the shapes in terms of their corresponding mathematical definition, i.e. a
rectangle has a _height_ and _width_, a circle has a _radius_, and a triangle
has a _base_ and a _height_. In our ML-like syntax, we express this as follows:

```sml
datatype rectangle
    = height of float * width of float

datatype circle
    = radius of float

datatype triangle
    = base of float * height of float
```

For our example function, we want to compute the area of each of these three
different shapes, so we have to implement corresponding area functions:

```sml
fun rectangle_area (height, width) =
    height * width

fun circle_area (radius) =
    pi * radius * radius

fun triangle_area (base, height) =
    0.5 * base * height
```

Note that in our reference implementation above, we use destructuring on each of
the different types directly in the header of their corresponding area function,
in order to make the definitions more concise. Alternatively, we could have
chosen to access the fields of the product types without destructuring, e.g.

```sml
fun rectangle_area rectangle =
    rectangle.height * rectangle.width
```

In the next section, we implement the `rectangle`, `circle`, and `triangle`
product types along with their corresponding area example functions in Kotlin.


## 3. Product types in Kotlin {#3-dot-product-types-in-kotlin}

In this section, we implement the `rectangle`, `circle`, and `triangle` product
types along with their area functions in Kotlin.

As discussed in the [previous post](/categories/musings/enum-types-in-kotlin-elixir-and-elm), Kotlin is heavily influenced by Java which
means that all non-primitive data types are defined in terms of classes, and
product types are no exception. Likewise, we also discussed that we prefer to
separate data and logic, and thus would like to avoid defining our product types
as plain old classes, e.g.

```kotlin
class Rectangle(val height: Float, val width: Float)
```

Instead, we would like to signal to the Kotlin compiler - and other developers -
that we are defining product types, which should not do much beyond store some
data. Fortunately, Kotlin introduces the concept of [data class](https://kotlinlang.org/docs/data-classes.html), which does
exactly this while also automatically deriving reasonable implementations of
`equals`, `toString`, and `copy`. Defining our product types, `Rectangle`,
`Circle`, and `Triangle`, as data classes is now straightforward, as we just
need to add the `data` keyword before the `class` keyword:

```kotlin
data class Rectangle(val height: Float, val width: Float)
data class Circle(val radius: Float)
data class Triangle(val base: Float, val height: Float)
```

Note also the conciseness Kotlin brings when specifying a class, `Rectangle`,
and its fields, `height` and `width`, compared to a traditional Java class.

Implementing our three area functions is also rather straightforward, as each
function takes an argument of their expected shape type and returns the
calculated area of that type:

```kotlin
fun rectangle_area(rectangle: Rectangle): Float {
    return rectangle.height * rectangle.width
}

fun circle_area(circle: Circle): Float {
    return Math.PI * circle.radius * circle.radius
}

fun triangle_area(triangle: Triangle): Float {
    return 0.5 * triangle.base * triangle.height
}
```

If we wanted to pattern match on the fields of each of the types, as
demonstrated in the previous section, we could instead use Kotlin's
[destructuring declarations](https://kotlinlang.org/docs/reference/multi-declarations.html#destructuring-declarations) to do just that:

```kotlin
fun rectangle_area(rectangle: Rectangle): Float {
    val (height, width) = rectangle
    return height * width
}
```

However, in the case of our area functions, it would not do much in terms of
making the code more elegant.

Finally, in order to test our code, we implement the `main` function which
instantiates a variable of type `Rectangle` and prints the result of calling
`rectangle_area` on it:

```kotlin
fun main(args: Array<String>) {
    val rectangle = Rectangle(4.4, 5.8)
    println("Rectangle area: ${rectangle_area(rectangle)}!")
    // ==> "Rectangle area: 25.52!"
}
```

Having implemented our product types, `rectangle`, `circle`, and `triangle`,
along with their area functions in Kotlin, we move on to repeat the exercise in
Elixir.


## 4. Product types in Elixir {#4-dot-product-types-in-elixir}

In this section, we implement the `rectangle`, `circle`, and `triangle` product
types along with their area functions in Elixir.

In order to define our different shape types in Elixir, we take a slightly
different approach than in the case of the enum type, by encapsulating each of
our types in a module named after the corresponding type:

```elixir
defmodule Rectangle do
  @type t :: %__MODULE__{height: float, width: float}
  defstruct [height: 0.0, width: 0.0]
end
```

Breaking down the above definition, we first look at the `@type` declaration of
`t`, where `__MODULE__` refers to the name of the enclosing module, `Rectangle`,
and the `%<name>{<property_name>: <property_type>, ...}` construct declares a
`struct` type called `<name>` and with a set of `<property_name>:
<property_type>` pairs. While the `@type` directive declares the `Rectangle.t`
type, the `defstruct` keyword defines the actual data structure of a
`Rectangle`, by taking a list of `[<property_name>: <default_value>]` as its
arguments, corresponding to the properties declared in our type declaration. In
this case, we define the type `Rectangle` to have two properties, `height` and
`width`, both of type `float` and both with default value `0.0`.

We define `Circle` and `Triangle` in a similar manner:

```elixir
defmodule Circle do
  @type t :: %__MODULE__{radius: float}
  defstruct [radius: 0.0]
end

defmodule Triangle do
  @type t :: %__MODULE__{base: float, height: float}
  defstruct [base: 0.0, height: 0.0]
end
```

We can now refer to the three product types as `Rectangle.t`, `Circle.t`, and
`Triangle.t` respectively, allowing us to define our three area functions, which
given an argument of the corresponding shape type, returns the computed area of
that shape:

```elixir
@spec rectangle_area(Rectangle.t()) :: float()
def rectangle_area(%Rectangle{height: h, width: w}) do
  h * w
end

@spec circle_area(Circle.t()) :: float()
def circle_area(%Circle{radius: r}) do
  :math.pi * r * r
end

@spec triangle_area(Triangle.t()) :: float()
def triangle_area(%Triangle{base: b, height: h}) do
  0.5 * b * h
end
```

Note, that Elixir allows us to pattern match not just on the type but also
directly on its fields at the same time, making them readily available in the
body of the function declaration.

We test the code by instantiating a value of type `Rectangle.t` and pass it to
its area function:

```elixir
rectangle = %Rectangle{height: 4.4, width: 5.8}
IO.puts("Rectangle area: #{rectangle_area(rectangle)}!")
# ==> "Rectangle area: 25.52!"
```

While the Kotlin and Elixir implementations are quite similar in many ways, it
is noteworthy that the concept of pattern matching on the structure of types is
a more natural feature of the Elixir language compared to Kotlin.

Having implemented our `rectangle`, `circle`, and `triangle` product types in
Kotlin, we move on to our final language example, Elm.


## 5. Product types in Elm {#5-dot-product-types-in-elm}

In this section, we implement the `rectangle`, `circle`, and `triangle` product
types along with their area functions in Elm.

In order to implement our product types, `rectangle`, `circle`, and `triangle`,
in Elm, we can use a syntax similar to what we saw in Section 2. We specify a
product type using the `type alias` keywords followed by listing each of the
fields of the type, e.g. `height` and `width`, separated by `,` and encapsulated
by `{...}`:

```elm
type alias Rectangle =
    { height : Float, width : Float }

type alias Circle =
    { radius : Float }

type alias Triangle =
    { base : Float, height : Float }
```

As in the Elixir case, we can pattern match (or destructure) our product type
arguments directly in the header of our function declarations:

```elm
rectangleArea : Rectangle -> Float
rectangleArea { height, width } =
    height * width

circleArea : Circle -> Float
circleArea { radius } =
    pi * radius * radius

triangleArea : Triangle -> Float
triangleArea { base, height } =
    0.5 * base * height
```

thus making our code more concise. Besides a few syntactic differences, there is
not much difference between the ML-like reference example and our actual Elm
implementation.

Once again, we implement the `main` function, in which we instantiate a value of
type `Rectangle`, pass it to the `rectangleArea` function, and print it as a
text DOM element:

```elm
main =
  let
    rectangle = { height = 4.4, width = 5.8 }
  in
  text <|
      "Rectangle area: " ++
      (String.fromFloat <| rectangleArea <| rectangle) ++
      "!"
-- ==> "Rectangle area: 25.52!"
```

Having implemented our `rectangle`, `circle`, and `triangle` product types in
Elm, we are ready to conclude this post in the next section.


## 6. Conclusion {#6-dot-conclusion}

In this blog post, we have defined the concept of product types, and compared
the implementation of product types in the three different programming
languages: Kotlin, Elixir, and Elm.

While all three languages support product types on a language level, we note
that pattern matching on the structure of types in general is a fundamental part
of programming in Elixir, and thus it shines a bit brighter here than the other
languages.
