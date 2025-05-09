+++
title = "Programming in Style:&#x000a;From Pattern Matching to Point Free"
author = ["Peter Urbak"]
summary = "In this post, we present several techniques for making Elm code declarative and precise."
date = 2023-04-27T00:00:00Z
tags = ["Elm", "Pattern matching", "Point-free Style", "Functional Programming"]
categories = ["Musings"]
draft = false
+++

> _“If you detect a needlessly complex style when you read,_<br />
> _look for characters and actions so that you can unravel for yourself_<br />
> _the complexity the writer needlessly inflicted on you.”_<br />
> -- **Joseph M. Williams**, [Style: Toward Clarity and Grace](https://app.thestorygraph.com/books/d4766a94-07d4-47c5-9f5c-a6492603b336)

The goal of this post is to show in [Elm](http://elm-lang.org/) how to go from
a case of having nested pattern matching and refining it into a point free
style using the idioms of the language and common libraries.


## A Prime Example {#a-prime-example}

In order to illustrate the unnecessary complexity that can happen when dealing
with nested pattern matching, let us pretend we are presented the following --
slightly contrived -- problem:

Given a string input \\(s\\) corresponding to an integer \\(n\\), determine whether
the integer \\(n\\) and \\(42\\) are [coprime](https://en.wikipedia.org/wiki/Coprime_integers).

One way to determine whether two integers are coprime is to check whether their
[greatest common divisor (GCD)](https://en.wikipedia.org/wiki/Greatest_common_divisor) is \\(1\\). In order to implement this as a function in
Elm we would have to cobble together the following functions:

```elm
String.toInt : String -> Maybe Int
gcd : Int -> Int -> Maybe Int
(==) : Int -> Int -> Bool
```

Such that we first parse the string into an integer, then compute its GCD[^fn:1]
with 42, and finally check whether the result is equal to 1.


## Pattern Matching {#pattern-matching}

Implementing our `isCoprimeWithFortyTwo` function in a straight-forward manner where
we call each function in sequence and pattern match on its result, gives us the
following definition:

```elm
isCoprimeWithFortyTwo : String -> Bool
isCoprimeWithFortyTwo s =
  case String.toInt s of
    Nothing ->
      False

    Just n ->
      case gcd 42 n of
        Nothing ->
          False

        Just m ->
          m == 1
```

Aside from taking up several lines of code, the above implementation also
includes some redundancies in the form of the two `Nothing -> False` cases, and
we are forced to come up with new variable names, `n` and `m`, for each time we
case on a `Maybe`.


## Pipes, Partial Application and the Standard Library {#pipes-partial-application-and-the-standard-library}

To simplify our function above, we introduce the following set of helpers from
the standard library:

```elm
(|>) : a -> (a -> b) -> b
Maybe.andThen : (a -> Maybe b) -> Maybe a -> Maybe b
Maybe.map : (a -> b) -> Maybe a -> Maybe b
Maybe.withDefault : a -> Maybe a -> a
```

Now, we want to use the pipe operator `|>` to elegantly tie everything together
by transforming the function into a linear sequence of function calls, where the
output of each function is piped into the next function as input:

```elm
s
|> functionOne
|> functionTwo
```

Looking at `String.toInt`, which takes a `String` and produces `Maybe Int`, and
how we may combine it with `gcd`, which takes an `Int` and also produces a
`Maybe Int`, we turn to `Maybe.andThen`. With this function, we can connect the
two by wrapping the call to `gcd` in a [lambda expression](https://en.wikipedia.org/wiki/Anonymous_function) and [partially applying](https://en.wikipedia.org/wiki/Partial_application)
it to `Maybe.andThen`. This produces a new function that takes a `Maybe Int`,
which it gets from `String.toInt`, and produces a `Maybe Int`:

```elm
s
|> String.toInt
|> Maybe.andThen (\n -> gcd 42 n)
```

With the `Maybe Int` that we got from the snippet above, we can now use
`Maybe.map` to perform the final computation on our number `Maybe.map (\n -> 1
== n)` determining if the number is indeed coprime with \\(42\\) giving us a
`Maybe Bool`. Unfortunately, our original problem didn't say anything about
returning a `Maybe` so we have to use the `Maybe.withDefault` function to return
a default value, `False`, for the cases where `s` could not be parsed into an
`Int` or the `gcd` function could not produce a result:

```elm
|> Maybe.andThen (\n -> gcd 42 n)
|> Maybe.map (\n -> 1 == n)
|> Maybe.withDefault False
```

Piecing all of the above together, we get our new definition:

```elm
isCoprimeWithFortyTwo : String -> Bool
isCoprimeWithFortyTwo s =
  s
  |> String.toInt
  |> Maybe.andThen (\i -> gcd 42 i)
  |> Maybe.map (\n -> 1 == n)
  |> Maybe.withDefault False
```

While this implementation is perfectly fine and much more declaratively written
compared to our original definition, we will use the final section of this post
to illustrate how this can be made even more precise by slightly shifting our
way of thinking about functions.


## Function Composition, Point Free Style and Community Libraries {#function-composition-point-free-style-and-community-libraries}

An alternative to using the pipe operator `|>`, where we take our argument `s`
and first pass it to `String.toInt` and then pass the result to `Maybe.andThen`,
is to use the [function composition](https://en.wikipedia.org/wiki/Function_composition) operator `>>` which has the type:

```elm
(>>) : (a -> b) -> (b -> c) -> (a -> c)
```

This works similar to the function composition we know from math, where \\(h = g \circ
f\\) defines a new function \\(h\\) that is equivalent to \\(h(x) = g(f(x))\\). In Elm,
this means that the function:

```elm
h x = x |> f |> g
```

is equivalent to

```elm
h = f >> g
```

Notice how the function argument `x` is absent in the second definition, this is
because the argument and return types of the composition operator `>>` are all
functions, meaning we are operating on the functions themselves rather than the
arguments of the functions, in contrast to the return type of the pipe operator
`|>` which is a plain value:

```elm
(|>) : a -> (a -> b) -> b
(>>) : (a -> b) -> (b -> c) -> (a -> c)
```

This style of programming where the argument names are kept implicit is called
[point-free style](https://en.wikipedia.org/wiki/Tacit_programming) and comes with a slightly different perspective where focus is
on function composition in contrast to function application. Since these are all
equivalent, we could even have defined `h` in a third way as:

```elm
h x = (f >> g) x
```

Where we explicitly name the argument to be given to our newly composed function
and apply it.

With this idea of function composition in mind, looking at our code it would be
tempting to define a function that composes `Maybe.map` and `Maybe.withDefault`
such that we get a new function that applies a function `f` if the given `Maybe`
is a `Just` and if it is `None` returns a default value. Fortunately, we do not
need to reinvent the functional wheel as the `elm-community` package
`maybe-extra` has implemented this and similar helper functions:

```elm
Maybe.Extra.unwrap : b -> (a -> b) -> Maybe a -> b
```

Thus, we can transform the following lines from our previous definition:

```elm
|> Maybe.map (\n -> 1 == n)
|> Maybe.withDefault False
```

into

```elm
Maybe.Extra.unwrap False (\n -> 1 == n)
```

and taking some inspiration from our previous observations on partial
application and point-free style programming, we can even rewrite our lambda
expression `(\n -> 1 == n)` as `((==) 1)` by partially applying `1` to the
equality function `(==)` function like so:

```elm
Maybe.unwrap False ((==) 1)
```

Combining the lessons above we get the following implementation:

```elm
import Maybe
import Maybe.Extra as Maybe

isCoprimeWithFortyTwo : String -> Bool
isCoprimeWithFortyTwo =
  String.toInt
  >> Maybe.andThen (gcd 42)
  >> Maybe.unwrap False ((==) 1)
```

which is semantically equivalent to the `isCoprimeWithFortyTwo` function from the
previous section that used pipes and named arguments.

Finally, we can do some parameterization of our function and generalize the
\\(42\\) to any integer \\(n\\) and create our `isCoprimeWithFortyTwo` by partially
applying `42` to `isCoprimeWith`:

```elm
import Maybe
import Maybe.Extra as Maybe

isCoprimeWith : Int -> String -> Bool
isCoprimeWith n =
  String.toInt
  >> Maybe.andThen (gcd n)
  >> Maybe.unwrap False ((==) 1)

isCoprimeWithFortyTwo : String -> Bool
isCoprimeWithFortyTwo =
  isCoprimeWith 42
```

As seen from the final definition, the ideas introduced in this post can be used
interchangeably when implementing any kind of function in Elm and so the most
important quality to enforce with these different techniques should be
readability rather than brevity.


## Conclusion {#conclusion}

In this blog post, we have shown how to transform a function that uses nested
pattern matching and gradually refine the function to become increasingly
declarative in its definition while explaining the underlying principles,
resulting in a function utilizing a point-free style where appropriate along
with existing functions from the standard and community libraries.

[^fn:1]: For illustrative purposes we have defined the GCD function such that it
    returns a `Maybe Int` to account for the case `gcd(0, 0)` whose value **some**
    might consider to be undefined.
