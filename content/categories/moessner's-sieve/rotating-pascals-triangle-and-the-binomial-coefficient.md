+++
title = "Rotating Pascal's triangle&#x000a;and the binomial coefficient"
author = ["Peter Urbak"]
date = 2015-12-20T00:00:00Z
tags = ["Haskell", "Pascal's triangle", "Binomial coefficient", "Mathematics"]
categories = ["Moessner's Sieve"]
draft = false
+++

## 1. Introduction {#1-dot-introduction}

This is a follow-up post to [An introduction to Pascal's triangle](/categories/moessners-sieve/an-introduction-to-pascals-triangle), which we will
build on top off by introducing and formalizing the rotated versions of [Pascal's
triangle](https://en.wikipedia.org/wiki/Pascal%27s_triangle) and the [binomial coefficient](https://en.wikipedia.org/wiki/Binomial_coefficient).

The blog post has the following structure. In Section [2](#2-dot-rotating-pascal-s-triangle) we rotate Pascal's
triangle and formalize its rotated counterpart. Afterwards, we introduce the
rotated binomial coefficient in Section [3](#3-dot-the-rotated-binomial-coefficient), where we show how to obtain it in two
different ways. The blog is concluded in Section [4](#4-dot-conclusion).


## 2. Rotating Pascal's triangle {#2-dot-rotating-pascal-s-triangle}

Rather than motivate the introduction of the rotated version of Pascal's
triangle, we dive right in and perform the rotation and subsequently examine the
properties of the new triangle. So, given the traditional version of Pascal's
triangle,

\begin{equation}
  \tag{1}\label{fig:pascal-s-triangle}
  \begin{array}{\*{9}{c}}
    & & & & 1 & & & & \\\\
    & & & 1 & & 1 & & & \\\\
    & & 1 & & 2 & & 1 & & \\\\
    & 1 & & 3 & & 3 & & 1 & \\\\
    1 & & 4 & & 6 & & 4 & & 1
  \end{array}
\end{equation}

we rotate it counterclockwise in such a way that we can address its entries
using rows and columns,

\begin{equation}
  \tag{2}\label{fig:rotated-pascal-s-triangle}
  \begin{array}{\*{5}{r}}
    1 & 1 & 1 & 1 & 1 \\\\
    1 & 2 & 3 & 4 &   \\\\
    1 & 3 & 6 &   &   \\\\
    1 & 4 &   &   &   \\\\
    1 &   &   &   &
  \end{array}
\end{equation}

similar to how we address the entries of a [matrix](https://en.wikipedia.org/wiki/Matrix_(mathematics)).

First, we notice that the base case of Pascal's triangle, where \\(\binom{n}{0} =
1\\), now corresponds to the first column of the rotated Pascal's triangle,

\begin{equation\*}
  \begin{array}{\*{5}{r}}
    1 & \class{faint}{1} & \class{faint}{1} &
    \class{faint}{1} & \class{faint}{1} \\\\
    1 & \class{faint}{2} & \class{faint}{3} & \class{faint}{4} & \\\\
    1 & \class{faint}{3} & \class{faint}{6} &   & \\\\
    1 & \class{faint}{4} &   &   &   \\\\
    1 &   &   &   &
  \end{array}
\end{equation\*}

Furthermore, the case where \\(\binom{n}{k} = 0\\), when \\(n < k\\), has now
disappeared due to the rotation making us unable to index outside of the
triangle, and the case \\(\binom{n}{n} = 1\\) now corresponds to the first row of
the rotated Pascal's triangle,

\begin{equation\*}
  \begin{array}{\*{5}{r}}
      1 & 1 & 1 & 1 & 1 \\\\
    \class{faint}{1} & \class{faint}{2} &
    \class{faint}{3} & \class{faint}{4} &   \\\\
    \class{faint}{1} & \class{faint}{3} &
    \class{faint}{6} &   &   \\\\
    \class{faint}{1} & \class{faint}{4} &   &   &   \\\\
    \class{faint}{1} &   &   &   &
  \end{array}
\end{equation\*}

Lastly, in the inductive case, \\(\binom{n}{k} = \binom{n-1}{k} +
\binom{n-1}{k-1}\\), where we added the two entries just above the entry we wanted
to calculate, we now add its immediate western and northern neighbors,

\begin{equation\*}
  \begin{array}{\*{5}{r}}
      &       &       &       &     1 \\\\
      &       &       &       & \downarrow \\\\
      &       &     2 & \rightarrow &     3 \\\\
      &       & \downarrow &       & \downarrow \\\\
    1 & \rightarrow &     3 & \rightarrow &     6
  \end{array}
\end{equation\*}

giving us three nice and simple cases. Thus, by combining the observations
above, we can formalize the rotated version of Pascal's triangle with the two
base cases,

\begin{equation}
    \binom{0}{c}\_r = 1,
\end{equation}

and

\begin{equation}
    \binom{r}{0}\_r = 1,
\end{equation}

along with the inductive case,

\begin{equation}
  \binom{r+1}{c+1}\_r = \binom{r+1}{c}\_r + \binom{r}{c+1}\_r,
\end{equation}

where \\(r\\) refers to the row index, \\(c\\) refers to the column index and the
[subscripted](https://en.wikipedia.org/wiki/Subscript_and_superscript) \\(r\\) indicates that these rules refer to the rotated version of
Pascal's triangle.

Not only is the formalization of the rotated Pascal's triangle more elegant than
its counterpart, even some of its properties also benefit from this
transformation. In particular, the symmetry property of the traditional version
of Pascal's triangle,

\begin{equation}
  \binom{n}{k} = \binom{n}{n - k}
\end{equation}

now becomes,

\begin{equation}
  \binom{r}{c}\_r = \binom{c}{r}\_r,
\end{equation}

which is void of any subtraction operations in its indices. Instead, we simply
swap the value of the row and column indices, respectively, and still obtain the
same result.

Having formalized the rotated Pascal's triangle and discussed some of its
properties, our next goal is to define a rotated binomial coefficient function
as a dual to the rotated Pascal's triangle.


## 3. The rotated binomial coefficient {#3-dot-the-rotated-binomial-coefficient}

When defining the rotated binomial coefficient, we have the choice between two
approaches:

-   Lift the function definition from the formalization of the rotated Pascal's
    triangle, or
-   capture the rotation transformation as a function and apply it to the binomial
    coefficient.

For the sake of completeness, we introduce both function definitions in the
following sections.


### 3.1 Lifting the rotated binomial coefficient from the rotated Pascal's triangle {#3-dot-1-lifting-the-rotated-binomial-coefficient-from-the-rotated-pascal-s-triangle}

Just as in the previous post, we can reduce the formalization of the rotated
Pascal's triangle into a computable function, `rotatedBinomialCoefficient`, by
mapping the base cases and the inductive case of our formalization to the base
cases and inductive cases of our function, i.e. the row and column indices, `r`
and `c`. Thus, if we take a look at the two base cases, \\(\binom{0}{c}\_r = 1\\) and
\\(\binom{r}{0}\_r = 1\\), we note that these naturally map to the two base cases for
our function, `(r = 0, c > 0)` and `(r > 0, c = 0)`. Likewise, there exists a
natural mapping from the inductive case of our formalization, \\(\binom{r + 1}{c +
1}\_r = \binom{r + 1}{c}\_r + \binom{r}{c + 1}\_r\\), to the inductive case of our
function, `(r > 0, c > 0)`, which - when combined - gives us the following
Haskell definition,

```haskell
rotatedBinomialCoefficient :: Int -> Int -> Int
rotatedBinomialCoefficient r c
  | r == 0 = 1
  | c == 0 = 1
  | r > 0 && c > 0 = rotatedBinomialCoefficient (r - 1) c +
                     rotatedBinomialCoefficient r (c - 1)
```

Again, we use guards to express the base cases and the inductive case in a
straight forward manner that nicely captures the original formalization.

Having shown that we can derive the rotated binomial coefficient function from
the rotated Pascal's triangle, in exactly the same way as we derived the
binomial coefficient function from Pascal's triangle, we move on to show how we
can obtain it the rotated binomial coefficient function by viewing it as a
transformation.


### 3.2 Capturing the rotated binomial coefficient as a rotation transformation {#3-dot-2-capturing-the-rotated-binomial-coefficient-as-a-rotation-transformation}

In order to define the rotated binomial coefficient function as a transformation
of the traditional binomial coefficient function, we have to the capture
counterclockwise rotation happening in-between Figures
\ref{fig:pascal-s-triangle} and \ref{fig:rotated-pascal-s-triangle}.

So, as we have already noted, the row index `r` maps directly to the row index
`n`, since we have the following relation of the base cases \\(\binom{r}{0}\_r =
\binom{r}{0} = 1\\). Furthermore, if we let `r = 0`, we notice that the column
index `c` maps to both `n` and `k`, specifically the case where \\(n = k\\), giving
us the relation \\(\binom{0}{c}\_r = \binom{c}{c}\\) as observed in the previous
section. Putting these relations together yields the following definition of the
rotated binomial coefficient function, as a transformation applied to the
binomial coefficient function,

```haskell
rotatedBinomialCoefficient :: Int -> Int -> Int
rotatedBinomialCoefficient r c = binomialCoefficient (r + c) c
```

Lastly, we note that we did not have to take the inductive case into account as
the definition only required us to capture how the rotation affected the two
indices - which was easiest to see in the base cases.

Now that we have introduced both the rotated Pascal's triangle and the rotated
binomial coefficient function, we can conclude this blog post.


## 4. Conclusion {#4-dot-conclusion}

In this blog post, we have introduced and formalized the rotated Pascal's
triangle and defined the rotated binomial coefficient function.

We obtained the above results by first applying the rotation transformation on
the traditional version of Pascal's triangle and subsequently formalizing the
result. Having formalized the rotated Pascal's triangle, we then lifted the
definition of the rotated binomial coefficient function from the formalization.
Furthermore, we also defined the rotated binomial coefficient function as the
rotation transformation applied to the binomial coefficient function.
