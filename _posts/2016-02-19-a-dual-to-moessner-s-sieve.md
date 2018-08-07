---
layout: post
title: "A dual to Moessner's sieve"
category: mathematics
description: "In this post, we introduce a dual to Moessner's sieve."
tags: [Haskell, Moessner's sieve]
---

#### prerequisites: The post [An introduction to Moessner's theorem and Moessner's sieve]({% post_url
2016-01-12-an-introduction-to-moessner-s-theorem-and-moessner-s-sieve %})

*“The poet doesn't invent.*<br/>
*He listens.”*<br/>
-- **Jean Cocteau**

### 1. Introduction

The goal of this post is to introduce a dual to Moessner's sieve that simplifies
the initial configuration of Moessner's sieve, by starting from two seed tuples
instead of an initial sequence, and creates a result sequence of Moessner
triangles, each constructed column by column, instead of a result sequence of
successive powers, constructed row by row.

The post is structured as follows. In Section [2](#from-successive-powers-to-triangles),
we motivate the redefinition of Moessner's sieve as a procedure for generating a
sequence of so-called Moessner triangles, instead of a sequence of successive
powers. As a result, we introduce two triangle creation procedures, which
construct individual Moessner triangles either row by row or column by
column. In Section [3](#the-dual-of-moessners-sieve), we first show how our
triangle creation procedures give rise to a new and simpler initial
configuration of Moessner's sieve, which we then use as inspiration for the
final formalization of the dual of Moessner's sieve. The post is concluded in
Section [4](#conclusion).

### 2. From successive powers to triangles

In this section, we first motivate the idea of looking at *Moessner's sieve* as
a procedure for generating a sequence of *Moessner triangles*, as opposed to a
sequence of *successive powers*, and then formalize the core operations of the
sieve that create the individual Moessner triangles.

#### 2.1 Generating a sequence of triangles with Moessner's sieve

In order to motivate the idea of redefining Moessner's sieve as a procedure
for generating a sequence of Moessner triangles, we start by looking at an
example application of Moessner's sieve.

Given an *initial sequence* of $$1$$s, we apply Moessner's sieve of *rank* $$5$$
on it,

$$
\begin{equation}
  \tag{1}\label{eq:dual-moessner-sieve-five}
  \begin{array}{*{16}{r}}
    1 & 1 & 1 & 1 & \textbf{1} & 1 & 1 & 1 & 1 & \textbf{1} & 1 & 1 & 1 & 1 &
    \textbf{1} & \dots \\
    1 & 2 & 3 & \textbf{4} & & 5 & 6 & 7 & \textbf{8} & & 9 & 10 & 11 &
    \textbf{12} & & \dots \\

    1 & 3 & \textbf{6} & & & 11 & 17 & \textbf{24} & & & 33 & 43 & \textbf{54} & & &
    \dots \\

    1 & \textbf{4} & & & & 15 & \textbf{32} & & & & 65 & \textbf{108} & & & &
    \dots \\

    \textbf{1} & & & & & \textbf{16} & & & & & \textbf{81} & & & & & \dots
  \end{array}
\end{equation}
$$

which yields the *result sequence* of successive powers of $$4$$ (the rank
minus one). As seen from this description, we traditionally view Moessner's
sieve as a procedure which takes an initial sequence consisting of an arithmetic
progression, as first shown by Long,[^1] and returns a result sequence of
successive powers, by repeatedly dropping and partially summing the elements of
the initial sequence. Now, instead of focusing solely on the elements of the
result sequence, we want to view Moessner's sieve as generating a sequence of
triangles, each of which we call a Moessner triangle. The Moessner triangles
appear as a result of preserving the alignment of the entries of the
intermediate result sequences in Moessner's sieve, while performing the repeated
dropping of elements, as seen in Figure
\ref{eq:dual-moessner-sieve-five}. Hence, we can pick the first triangle created
in the above example,

$$
\begin{equation}
  \tag{2}\label{eq:moessner-triangle-tuples}
  \begin{array}{*{5}{l}}
    [1  &  1    & 1    & 1    & 1] \\
    [1  &  2    & 3    & 4]   &     \\
    [1  &  3    & 6]   &      &     \\
    [1  &  4]   &      &      &     \\
    [1] &       &      &      &
  \end{array}
\end{equation}
$$

and describe it as a set of *tuples*, marked by $$[ \dots ]$$. We can then
translate the above representation into the following types in Haskell,

{% highlight haskell linenos %}
type Tuple = [Int]
type Triangle = [Tuple]
{% endhighlight %}

which we use for the remainder of this post, when referring to Moessner
triangles in the context of Moessner's sieve. Lastly, we say that a Moessner
triangle's rank is equal to its depth minus one - or one less than the drop
index of Moessner's sieve - and therefore the Moessner triangles in Figure
\ref{eq:dual-moessner-sieve-five} all have rank $$4$$.

Thus, we have now defined what we mean by a Moessner triangle in the context of
Moessner's sieve and defined a notation for the `Triangle` and `Tuple` types. In
the next sections, we define procedures for creating individual tuples and
combining them into triangles.

#### 2.2 Make tuple

Before defining our `makeTuple` procedure, we first return to the triangles in
Figure \ref{eq:dual-moessner-sieve-five} and observe that we can view each of
them as being constructed from two seed tuples: a horizontal seed tuple
corresponding to a slice of the initial sequence, and a vertical seed tuple
corresponding to the dropped elements, marked with boldface, of the previous
triangle. For example, the triangle shown in Figure
\ref{eq:moessner-triangle-tuples} can be seen as the result of adding a
horizontal seed tuple of $$1$$s and a vertical seed tuple of $$0$$s -- since no
elements have been dropped before the creation of the first triangle,

$$
\begin{equation}
  \tag{3}\label{eq:triangle-creation-example}
  \begin{array}{*{11}{c}}
     &       & [1     &       & 1     &       & 1     &       & 1     & & 1] \\
   ⎴ &       & ↓ &       & ↓ &       & ↓ &       & ↓ & &   \\
   0 & → & [1     & → & 2     & → & 3     & → & 4]
   & &   \\
     &       & ↓ &       & ↓ &       & ↓ &       &       & &   \\
   0 & → & [1     & → & 3     & → & 6]     &       &       & &   \\
     &       & ↓ &       & ↓ &       &       &       &       & &   \\
   0 & → & [1     & → & 4]     &       &       &       &       & &   \\
     &       & ↓ &       &       &       &       &       &       & &   \\
   0 & → & [1]     &       &       &       &       &       &       & &   \\
     &       &       &       &       &       &       &       &       & &   \\
   0 &       &       &       &       &       &       &       & & & \\
   ⎵ &       &       &       &       &       &       &       & & &
  \end{array}
\end{equation}
$$

From Figure \ref{eq:triangle-creation-example}, we notice that the rows and
columns of the triangle are created in the exact same fashion -- as the partial
sums of the previous row/column together with an accumulator. Specifically, the
$$r$$th horizontal tuple (row) of the result triangle is created by partially
summing all but the last entry of the $$(r - 1)$$th horizontal tuple, while
using the $$r$$th value of the vertical seed tuple as the accumulator value. For
example, we can obtain the second horizontal tuple, $$[1, 3, 6]$$, of the result
triangle, by partially summing the first horizontal tuple, $$[1, 2, 3, 4]$$,

$$
\begin{equation*}
  \begin{array}{*{9}{c}}
     &       & 1     &       & 2     &       & 3     & & 4 \\
     &       & ↓ &       & ↓ &       & ↓ & &   \\
   0 & → & 1     & → & 3     & → & 6     & &
  \end{array}
\end{equation*}
$$

where we ignore the last element, $$4$$, and use the second entry in the
vertical tuple, $$0$$, as the accumulator for the partial summation. The same
approach can be used for obtaining the $$c$$th vertical tuple (column) by
partially summing the $$(c - 1)$$th vertical tuple. This is also the reason why
we have added an extra $$0$$ in the initial vertical seed tuple - to ensure
symmetry with respect to this procedure. By reducing Moessner's sieve to this
core operation, which works for both rows and columns, we can translate our
description above into the following Haskell function,

{% highlight haskell linenos %}
makeTuple :: Tuple -> Int -> Tuple
makeTuple xs a = case xs of
  [] -> []
  (x:[]) -> []
  (x:xs') -> let a' = x + a
             in a' : (makeTuple xs' a')
{% endhighlight %}

which takes a `Tuple`, `xs`, and a number, `a`, as the accumulator, and returns
a new `Tuple` as described. With this definition, the above example calculation
then becomes,

{% highlight haskell linenos %}
makeTuple [1,2,3,4] 0 == [1,3,6]
{% endhighlight %}

Having defined a procedure for creating tuples, corresponding to individual rows
or columns in a Moessner triangle, we move on to define procedures for creating
a whole triangle as a list of tuples.

#### 2.3 Create triangle

As already mentioned in the previous section, we can construct individual rows
or columns of a Moessner triangle using the same procedure, `makeTuple`, which
means that we can create a triangle by either repeatedly applying `makeTuple`
on the horizontal seed tuple while using the vertical seed tuple as
the list of accumulator values, or vice versa,

$$
\begin{equation}
  \tag{4}\label{eq:moessner-triangle-with-tuples}
  \begin{array}{*{11}{c}}
   ⎴ &   & [1 &   & 1 &   & 1 &   & 1 & & 1] \\
      &  & ↓  &   & ↓ &   & ↓ &   & ↓ & &   \\
   0 & → & 1  & → & 2 & → & 3 & → & 4 & &   \\
     &   & ↓  &   & ↓ &   & ↓ &   &   & &   \\
   0 & → & 1  & → & 3 & → & 6 &   &   & &   \\
     &   & ↓  &   & ↓ &   &   &   &   & &   \\
   0 & → & 1  & → & 4 &   &   &   &   & &   \\
     &   & ↓  &   &   &   &   &   &   & &   \\
   0 & → & 1  &   &   &   &   &   &   & &   \\
     &   &    &   &   &   &   &   &   & &   \\
   0 &   &    &   &   &   &   &   &   & & \\
   ⎵ &  &    &   &   &   &   &   &   & &
  \end{array}
\end{equation}
$$

As a result of this observation, we define two triangle creation procedures that
each take two `Tuples`, `xs` and `ys`, corresponding to the horizontal seed
tuple and vertical seed tuple, respectively, and repeatedly applies `makeTuple`
on these. For the first procedure, `createTriangleHorizontally`, we repeatedly
create a new `Tuple`, based on the elements of `xs`, while using the values of
`ys` as accumulators, and cons the result onto the result `Tuple`. In this way,
`xs` holds the intermediate result of each recursive call, while the head of
`ys` is removed for each recursive call. The algorithm terminates when there is
one element or less left in `ys` and the result of the procedure is a list of
horizontal `Tuples` representing a `Triangle`. Translating the above description
into Haskell, we obtain the following definition,

{% highlight haskell linenos %}
createTriangleHorizontally :: Tuple -> Tuple -> Triangle
createTriangleHorizontally xs ys = case ys of
  [] -> []
  (y:[]) -> []
  (y:ys') -> let xs' = makeTuple xs y
             in xs' : (createTriangleHorizontally xs' ys')
{% endhighlight %}

which creates a Moessner triangle in a row by row fashion. For the second
procedure, `createTriangleVertically`, we simply switch the roles of the `xs`
and `ys` described above, and obtain the dual procedure,

{% highlight haskell linenos %}
createTriangleVertically :: Tuple -> Tuple -> Triangle
createTriangleVertically xs ys = case xs of
  [] -> []
  (x:[]) -> []
  (x:xs') -> let ys' = makeTuple ys x
             in ys' : (createTriangleVertically xs' ys')
{% endhighlight %}

creating the same `Triangle` represented as a list of vertical `Tuples`. The
duality of `createTriangleHorizontally` and `createTriangleVertically` is now
evident as the definitions of the two procedures are completely identical except
that the `xs` and `ys` have switched roles.

To illustrate this, if we give the seed tuples in Figure
\ref{eq:moessner-triangle-with-tuples} as arguments to our two new definitions, we
obtain the following calculations,

{% highlight haskell linenos %}
createTriangleHorizontally [1,1,1,1,1] [0,0,0,0,0] == [
  [1,2,3,4],
  [1,3,6],
  [1,4],
  [1]
]
{% endhighlight %}

and

{% highlight haskell linenos %}
createTriangleVertically [1,1,1,1,1] [0,0,0,0,0] == [
  [1,1,1,1],
  [2,3,4],
  [3,6],
  [4]
]
{% endhighlight %}

where the results correspond to enumerating the entries of the result Moessner
triangle in Figure \ref{eq:moessner-triangle-with-tuples} either row by row or
column by column, respectively.

Thus, we have now defined the inner workings of the *dual of Moessner's sieve*,
specifically the procedures `makeTuple` and `createTriangleVertically` which
works column by column, when creating a Moessner triangle, while the traditional
version of Moessner's sieve works row by row when creating a sequence of
successive powers. Our next step is now to formalize the dual of Moessner's
sieve using the dual triangle creation procedure, `createTriangleVertically`.

### 3 The dual of Moessner's sieve

In this section, we formalize the dual of Moessner's sieve as a procedure for
creating a sequence of Moessner triangles, using `createTriangleVertically`,
which starts from a minimal initial configuration. Hence, we first make the case
for simplifying the initial configuration of Moessner's sieve and then define
the procedures which combined yields the dual of Moessner's sieve.

#### 3.1 Simplifying the initial configuration

Before proceeding to state the final dual of Moessner's sieve, we first
investigate whether our new approach affords a simpler initial configuration of
Moessner's sieve. Hence, we again turn our attention to the Moessner triangle in
Figure \ref{eq:moessner-triangle-with-tuples}, and notice that the seed tuple
containing $$1$$s, is only a part of the input and not a part of the output,
which we ideally would like in order to properly mimic the traditional version
of Moessner's sieve. Fortunately, as we demonstrated in the previous post, we
can obtain the sequence of $$1$$s by partially summing a $$1$$ followed by
$$0$$s, and apply this generalization to the case of the procedure
`createTriangleHorizontally`,

$$
\begin{equation*}
  \begin{array}{*{13}{c}}
     &   &  1 &   & 0 &   & 0 &   & 0 &  & 0 &  & 0 \\
     &   &  ↓ &   & ↓ &   & ↓ &   & ↓ &  & ↓ &  & \\
   0 & → & [1 & → & 1 & → & 1 & → & 1 & →& 1]&  & \\
     &   &  ↓ &   & ↓ &   & ↓ &   & ↓ &  &   &  & \\
   0 & → & [1 & → & 2 & → & 3 & → & 4]&  &   &  & \\
     &   &  ↓ &   & ↓ &   & ↓ &   &   &  &   &  & \\
   0 & → & [1 & → & 3 & → & 6]&   &   &  &   &  & \\
     &   &  ↓ &   & ↓ &   &   &   &   &  &   &  & \\
   0 & → & [1 & → & 4]&   &   &   &   &  &   &  & \\
     &   &  ↓ &   &   &   &   &   &   &  &   &  & \\
   0 & → & [1]&   &   &   &   &   &   &  &   &  & \\
     &   &    &   &   &   &   &   &   &  &   &  & \\
   0 &   &    &   &   &   &   &   &   &  &   &
  \end{array}
\end{equation*}
$$

where we divide the sequence of a $$1$$ followed by $$0$$s into equally sized
horizontal seed tuples, one for each triangle, and add an extra $$0$$ to the
vertical seed tuples.

If we use this simplified configuration for the two initial Moessner triangles
of Figure \ref{eq:dual-moessner-sieve-five},

$$
\begin{equation}
  \tag{5}\label{eq:dual-moessner-sieve-simple}
  \begin{array}{*{8}{r}}
     & & 1 & 0 & 0 & 0 & 0 & 0 \\\\
   0 & & 1 & 1 & 1 & 1 & 1 &   \\
   0 & & 1 & 2 & 3 & 4 &   &   \\
   0 & & 1 & 3 & 6 &   &   &   \\
   0 & & 1 & 4 &   &   &   &   \\
   0 & & 1 &   &   &   &   &   \\
   0 & &   &   &   &   &   &
  \end{array}
  \begin{array}{*{8}{r}}
      & &  0 &  0 &  0 & 0 & 0 & 0 \\\\
    1 & &  1 &  1 &  1 & 1 & 1 &   \\
    4 & &  5 &  6 &  7 & 8 &   &   \\
    6 & & 11 & 17 & 24 &   &   &   \\
    4 & & 15 & 32 &    &   &   &   \\
    1 & & 16 &    &    &   &   &   \\
    0 & &    &    &    &   &   &
  \end{array}
\end{equation}
$$

we discover a consistent property where the seed tuples are always located
outside of the result triangles, while the result triangles contain exactly the
values we want to capture with the sieve. As such, we define the rank of a seed
tuple to be equal to its length minus two - or the rank of the generated
Moessner triangle - meaning that the seed tuples in Figure
\ref{eq:dual-moessner-sieve-simple} all have rank $$4$$.

However, we do notice a small inconsistency in the two triangles in Figure
\ref{eq:dual-moessner-sieve-simple}, since the initial horizontal seed tuple
consists of a $$1$$ followed by $$0$$s while all subsequent horizontal seed
tuples consist of plain $$0$$s. Fortunately, we know from Long
and Hinze[^2] that the first triangle created by Moessner's sieve
is always Pascal's triangle, which allows us to swap the two seed tuples for the
initial triangle, as Pascal's triangle is symmetric:

$$
\begin{equation}
  \tag{6}\label{eq:dual-moessner-sieve-final}
  \begin{array}{*{8}{r}}
     & & 0 & 0 & 0 & 0 & 0 & 0 \\\\
   1 & & 1 & 1 & 1 & 1 & 1 &   \\
   0 & & 1 & 2 & 3 & 4 &   &   \\
   0 & & 1 & 3 & 6 &   &   &   \\
   0 & & 1 & 4 &   &   &   &   \\
   0 & & 1 &   &   &   &   &   \\
   0 & &   &   &   &   &   &
  \end{array}
  \begin{array}{*{8}{r}}
      & &  0 &  0 &  0 & 0 & 0 & 0 \\\\
    1 & &  1 &  1 &  1 & 1 & 1 &   \\
    4 & &  5 &  6 &  7 & 8 &   &   \\
    6 & & 11 & 17 & 24 &   &   &   \\
    4 & & 15 & 32 &    &   &   &   \\
    1 & & 16 &    &    &   &   &   \\
    0 & &    &    &    &   &   &
  \end{array}
\end{equation}
$$

Thus, we obtain an initial configuration where the horizontal seed tuples are
always $$0$$s, for all created Moessner triangles, and the whole sieve is
bootstrapped from a single seed value, $$1$$, located at the top of the first
vertical seed tuple.

Having reduced the initial configuration of Moessner's sieve to this extremely
simple set of seed tuples, we are ready to define the last procedures needed to
formalize our dual of Moessner's sieve.

#### 3.2 Hypotenuse of triangles

As seen in Figure \ref{eq:dual-moessner-sieve-final}, the values of the
hypotenuse of the first Moessner triangle, $$[1, 4, 6, 4, 1]$$, are used as the
vertical seed tuple for the next Moessner triangle. Thus, we need a procedure
which takes a `Triangle` and returns its hypotenuse as a `Tuple`. This is
implemented in a straightforward fashion by going through each `Tuple`, `t`, of
a `Triangle`, `ts`, and aggregating the last values of each `Tuple` into a new
`Tuple`, which is then returned,

{% highlight haskell linenos %}
hypotenuse :: Triangle -> Tuple
hypotenuse ts = case ts of
  [] -> []
  (t:ts') -> (last t) : (hypotenuse ts')
{% endhighlight %}

For example, if we feed the triangle,

$$
\begin{equation*}
  \begin{array}{*{6}{c}}
    1 &  1 &  1 & 1 & 1 & \\
    5 &  6 &  7 & 8 &   & \\
   11 & 17 & 24 &   &   & \\
   15 & 32 &    &   &   & \\
   16 &    &    &   &   &
  \end{array}
\end{equation*}
$$

to `hypotenuse`, we get the tuple, $$[16, 32, 24, 8, 1]$$, when reading it
column by column, which we can also express with the following piece of Haskell
code,

{% highlight haskell linenos %}
hypotenuse $
  createTriangleVertically [0,0,0,0,0,0] [1,4,6,4,1,0] ==
  [16,32,24,8,1]
{% endhighlight %}

All we have left to do now is to compose `createTriangleVertically` and
`hypotenuse` into a procedure which creates a list of `Triangles`, which is the
dual of Moessner's sieve.

#### 3.3 Create triangles

By combining `createTriangleVertically` and `hypotenuse` we can define a final
procedure, `createTrianglesVertically`, which given two seed tuples, `xs` and
`ys`, and a length argument, `n`, returns a list of `n` Moessner triangles. The
procedure works by applying `createTriangleVertically` on the two input tuples,
`xs` and `ys`, which creates the initial Moessner triangle whose hypotenuse is
then used as the `ys` seed tuple of the next triangle, while the `xs` remain
unchanged, as these are always $$0$$s. For each triangle created, we decrement
the value of `n` and terminate the procedure when `n == 0`. This description
brings us to the following definition,

{% highlight haskell linenos %}
createTrianglesVertically :: Int -> Tuple -> Tuple -> [Triangle]
createTrianglesVertically n xs ys
  | n == 0 = []
  | n  > 0 = let ts  = createTriangleVertically xs ys
                 ys' = reverse $ 0 : hypotenuse ts
             in ts : createTrianglesVertically (n - 1) xs ys'
{% endhighlight %}

which is exactly the dual of Moessner's sieve that we wanted, since it creates a
sequence of Moessner triangles by constructing one triangle at a time -- in a
column by column fashion.

Visualizing the sieve of Figure \ref{eq:dual-moessner-sieve-five}, using our new
dual sieve, yields the following three Moessner triangles,

$$
\begin{equation*}
  \begin{array}{*{8}{r}}
     & & 0 & 0 & 0 & 0 & 0 & 0 \\\\
   1 & & 1 & 1 & 1 & 1 & 1 &   \\
   0 & & 1 & 2 & 3 & 4 &   &   \\
   0 & & 1 & 3 & 6 &   &   &   \\
   0 & & 1 & 4 &   &   &   &   \\
   0 & & 1 &   &   &   &   &   \\
   0 & &   &   &   &   &   &
  \end{array}
  \begin{array}{*{8}{r}}
      & &  0 &  0 &  0 & 0 & 0 & 0 \\\\
    1 & &  1 &  1 &  1 & 1 & 1 &   \\
    4 & &  5 &  6 &  7 & 8 &   &   \\
    6 & & 11 & 17 & 24 &   &   &   \\
    4 & & 15 & 32 &    &   &   &   \\
    1 & & 16 &    &    &   &   &   \\
    0 & &    &    &    &   &   &
  \end{array}
  \begin{array}{*{8}{r}}
      & &  0 &   0 &  0 &  0 & 0 & 0 \\\\
    1 & &  1 &   1 &  1 &  1 & 1 &   \\
    8 & &  9 &  10 & 11 & 12 &   &   \\
   24 & & 33 &  43 & 54 &    &   &   \\
   32 & & 65 & 108 &    &    &   &   \\
   16 & & 81 &     &    &    &   &   \\
    0 & &    &     &    &    &   &
  \end{array}
\end{equation*}
$$

where we have explicitly added the seed tuples of each triangle. Finally, we can
now emulate this dual sieve by passing the same arguments to
`createTrianglesVertically` and obtain,

{% highlight haskell linenos %}
createTrianglesVertically 3 [0,0,0,0,0,0] [1,0,0,0,0,0] == [
  [
    [1,1,1,1,1],
    [1,2,3,4],
    [1,3,6],
    [1,4],
    [1]
  ],
  [
    [1,5,11,15,16],
    [1,6,17,32],
    [1,7,24],
    [1,8],
    [1]
  ],
  [
    [1,9,33,65,81],
    [1,10,43,108],
    [1,11,54],
    [1,12],
    [1]
  ]
]
{% endhighlight %}

which lists the entries of the three Moessner triangles in the sieve above, each
of which is enumerated column by column.

Thus, we have now defined a dual to Moessner's sieve that creates a sequence of
Moessner triangles, instead of a sequence of successive powers, where each
triangle is created column by column, instead of row by row, and which has an
initial configuration consisting of two seed tuples having just one non-zero
value, $$1$$, located at the top of the vertical seed tuple, from which the
whole sieve is subsequently constructed.

### 4 Conclusion

In this post, we have introduced a dual to Moessner's sieve, which simplifies
the initial configuration of Moessner's sieve, by starting from two seed tuples,
and creates a sequence of Moessner triangles, each constructed column by column,
instead of a sequence of successive powers, constructed row by row.

The dual of Moessner's sieve was obtained by first observing that the
traditional Moessner's sieve implicitly constructs triangles, called Moessner
triangles, when we preserve the alignment of the elements of the intermediate
result sequences while repeatedly dropping elements in the sequence. Combining
this observation with the fact that each row and column in a Moessner triangle
can be created using the same procedure, `makeTuple`, led to the definition of
two symmetric triangle creation procedures, `createTriangleHorizontally` and
`createTriangleVertically`, each taking two tuples, one corresponding to a slice
of an initial sequence and one corresponding to the hypotenuse of the previous
triangle, if any. By further combining the tuple-based approach with the
observation that Moessner's sieve can be initialized from a sequence of a $$1$$
followed by $$0$$s, and the observation that the first triangle created by
Moessner's sieve is always Pascal's triangle, resulted in a minimal initial
configuration of Moessner's sieve starting from a single seed value, $$1$$,
while all other values of the respective seed tuples are $$0$$. Lastly, by using
the new initial configuration together with the procedure
`createTriangleVertically` paved the way for defining the dual procedure of
Moessner's sieve, `createTrianglesVertically`, which creates a sequence of
Moessner triangles instead of a sequence of successive powers.

This post - and [the previous]({% post_url
2016-01-12-an-introduction-to-moessner-s-theorem-and-moessner-s-sieve %}) - was
a small excerpt from my
[Master's thesis](https://github.com/dragonwasrobot/formal-moessner), in which I
also prove the equivalence relation of the two triangle creation procedures.

[^1]: See "On the Moessner Theorem on Integral Powers" (1966) by Calvin T. Long.

[^2]: See "Concrete Stream Calculus: An extended study" (2010) by Ralf Hinze.
