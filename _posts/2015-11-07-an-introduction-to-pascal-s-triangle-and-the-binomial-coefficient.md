---
layout: post
title: "An introduction to Pascal's triangle<br/> and the binomial coefficient"
category: mathematics
description: "In this post, we introduce Pascal's triangle and the binomial
coefficient."
tags: [Haskell, Pascal's triangle, Binomial coefficient]
---

#### prerequisites: A basic knowledge of Haskell or similar.

### 1. Introduction

The goal of this blog post is to introduce
[Pascal's triangle](https://en.wikipedia.org/wiki/Pascal%27s_triangle) and the
[binomial coefficient](https://en.wikipedia.org/wiki/Binomial_coefficient).

The blog post is structured in the following way. In Section
[2](#pascal-s-triangle), we introduce Pascal's triangle and formalize its
construction. Before we define the binomial coefficient in Section
[4](#the-binomial-coefficient), we first motivate its introduction by stating
the [Binomial Theorem](https://en.wikipedia.org/wiki/Binomial_theorem) in
Section [3](#the-binomial-theorem). The blog is concluded in Section
[5](#conclusion).

### 2. Pascal's triangle

Pascal's triangle is a triangular array named after the French mathematician
Blaise Pascal, despite the fact that mathematicians in India, Greece, and China
had studied the triangle several centuries prior to Pascal[^1].

Traditionally, Pascal's triangle is indexed over its rows and their individual
entries. The row index is denoted $$n$$ and indexed from $$0$$, referring to the
top most row, while the entry index is denoted $$k$$ and also indexed from
$$0$$, referring to the leftmost entry of a given row. We define
$$\binom{n}{k}$$ to be the $$k$$th entry of the $$n$$th row of Pascal's
triangle. Using a simple inductive approach we can construct Pascal's triangle
as follows:

- Let row $$0$$ have a single entry, $$\binom{0}{0}$$, with the value $$1$$.
- For each entry $$k$$ in the row $$n$$, $$\binom{n}{k}$$, calculate the value
  of the entry by adding the two entries just above it, i.e., the entries to its
  immediate left and right, $$\binom{n-1}{k-1} + \binom{n-1}{k}$$, and if one of
  the two entries does not exist, then replace its value with $$0$$.

In order to strengthen our intuition, the figure below shows the first five
rows of Pascal's triangle,

$$
\begin{equation*}
    \begin{array}{*{9}{c}}
    & & & & 1 & & & & \\
    & & & 1 & & 1 & & & \\
    & & 1 & & 2 & & 1 & & \\
    & 1 & & 3 & & 3 & & 1 & \\
    1 & & 4 & & 6 & & 4 & & 1
    \end{array}
\end{equation*}
$$

Here, we see that the entry $$\binom{4}{2}$$, whose value is $$6$$, is
calculated by adding the entries $$\binom{3}{1}$$ and $$\binom{3}{2}$$, both
having the value $$3$$, which again have been calculated by adding the values
just above them, like so,

$$
\begin{equation*}
  \begin{array}{*{9}{c}}
    1 &    &   &    & 2 &    &   &    & 1\\
    & \searrow &   & \swarrow &   & \searrow &   & \swarrow &\\
    &    & 3 &    &   &    & 3 &    &\\
    &    &   & \searrow &   & \swarrow &   &    &\\
    &    &   &    & 6 &    &   &    &
  \end{array}
\end{equation*}
$$

Now, in order to finish our formalization of Pascal's triangle, we have to tweak
the above inductive description a bit by making a few extra observations of the
edge cases of Pascal's triangle. As such, we notice that the two outer legs only
consists of 1s,

$$
\begin{equation*}
  \begin{array}{*{9}{c}}
    & & & & 1 & & & & \\
    & & & 1 & & 1 & & & \\
    & & 1 & & \color{gray}{2} & & 1 & & \\
    & 1 & & \color{gray}{3} & & \color{gray}{3} & & 1 & \\
    1 & & \color{gray}{4} & & \color{gray}{6} & &
    \color{gray}{4} & & 1 \\
  \end{array}
\end{equation*}
$$

which gives us two alternative base cases,

$$
\begin{equation}
  \tag{1}\label{eq:binomcoeff-base-case-1}
  \binom{n}{0} = 1,
\end{equation}
$$

and,

$$
\begin{equation}
  \tag{2}\label{eq:binomcoeff-base-case-2}
  \binom{n}{n} = 1.
\end{equation}
$$

However, these do not capture the entries for which $$n < k$$, i.e., all
values to the right of Pascal's triangle,

$$
\begin{equation*}
  \begin{array}{*{13}{c}}
      & & & & 1 & & \color{gray}{0} & & \color{gray}{0} & & \color{gray}{0} & \dots \\
      & & & 1 & & 1 &   & \color{gray}{0} & & \color{gray}{0} & & \dots \\
      & & 1 & & 2 & & 1 &   & \color{gray}{0} & & \color{gray}{0} & \dots \\
      & 1 & & 3 & & 3 & & 1 &   & \color{gray}{0} & & \dots \\
    1 & & 4 & & 6 & & 4 &   & 1 & & \color{gray}{0} & \dots
  \end{array}
\end{equation*}
$$

but, as seen in the above figure, we can simply state that,

$$
\begin{equation}
  \tag{3}\label{eq:binomcoeff-base-case-3}
  \binom{n}{k} = 0, \text{when $n < k$}.
\end{equation}
$$

If we combine the three base cases listed above with the following adjusted
version of the inductive case described at the beginning of this section,

$$
\begin{equation}
  \tag{4}\label{eq:binomcoeff-inductive-case}
  \binom{n+1}{k+1} = \binom{n}{k+1} + \binom{n}{k},
\end{equation}
$$

which incidentally is called
[Pascal's rule](https://en.wikipedia.org/wiki/pascal%27s_rule), we have
obtained an elegant formalization of Pascal's triangle capturing its main
features.

Having defined Pascal's triangle, we now take a small detour in order to state
the Binomial Theorem, which we use to motivate the introduction of the binomial
coefficient.

### 3. The Binomial Theorem

Given a [binomial](https://en.wikipedia.org/wiki/Binomial_(polynomial)) $$(x +
y)^n$$, where $$x$$ and $$y$$ are variables, and $$n$$ is a natural number, we
want to describe the expansion of $$(x + y)^n$$ as a sum of its terms, each of
which is called a [monomial](https://en.wikipedia.org/wiki/Monomial).

If we examine the first four expansions of $$(x + y)^n$$, where $$n =
\{0,1,2,3\}$$, we get the following equations,

$$
\begin{align*}
  (x + y)^0 &= 1\\
  (x + y)^1 &= x + y\\
  (x + y)^2 &= x^2 + xy + y^2\\
  (x + y)^3 &= x^3 + 3x^2y + 3xy^2 + y^3,
\end{align*}
$$

from which we notice a pattern that can be made more distinct by explicitly
writing every coefficient and exponent of every monomial in the
expansions,

$$
\begin{align}
  \begin{split}
    (x + y)^0 &= 1 x^0 y^0\\
    (x + y)^1 &= 1 x^1 y^0 + 1 x^0 y^1\\
    (x + y)^2 &= 1 x^2 y^0 + 2 x^1 y^1 + 1 x^0 y^2\\
    (x + y)^3 &= 1 x^3 y^0 + 3 x^2 y^1 + 3 x^1 y^2 + 1 x^0 y^3.
  \end{split}
  \tag{5}\label{eq:binomial-expansions-example}
\end{align}
$$

Now it is clear that for a given
[binomial expansion](https://en.wikipedia.org/wiki/binomial_expansion) the
exponent of $$x$$ is decremented for each monomial of the expansion,
starting at $$n$$, as we traverse them from left to right. Conversely, the
exponent of $$y$$, starting at $$0$$, is incremented for each monomial of
the expansion. If we let $$k$$ denote the $$k$$th monomial of an
expansion, we can generalize the observation just made to the sum,

$$
\begin{equation}
  \tag{6}\label{eq:binomial-theorem-exponents}
  \sum_{k=0}^n x^{n-k} y^k,
\end{equation}
$$

which generates the correct exponentiation of the monomials in the
expansion. For example, if we let $$n = 3$$, we get,

$$
\begin{equation*}
  \sum_{k=0}^3 x^{3-k} y^k = x^3 y^0 + x^2 y^1 + x^1 y^2 + x^0 y^3,
\end{equation*}
$$

which enumerates the monomials of the binomial expansion of $$(x + y)^3$$, in
Formula \ref{eq:binomial-expansions-example}, except for the coefficients of the
monomials, which we still have to account for. Now, if we rearrange the
monomials of Formula \ref{eq:binomial-expansions-example}, such that they are
vertically aligned around the same center,

$$
\begin{equation*}
  \begin{array}{*{7}{c}}
    & & & 1x^0y^0 & & & \\
    & & 1x^1y^0 & & 1x^0y^1 & & \\
    & 1x^2y^0 & & 2x^1y^1 & & 1x^0y^2 & \\
    1x^3y^0 & & 3x^2y^1 & & 3x^1y^2 & & 1x^0y^3
  \end{array}
\end{equation*}
$$

and remove everything but the coefficients,

$$
\begin{equation}
  \tag{7}\label{eq:binomial-theorem-pascal-depth-4}
  \begin{array}{*{7}{c}}
    & & & 1 & & & \\
    & & 1 & & 1 & & \\
    & 1 & & 2 & & 1 & \\
    1 & & 3 & & 3 & & 1
  \end{array}
\end{equation}
$$

we obtain the first four rows of Pascal's triangle. Thus, the entries of
Pascal's triangle enumerate the coefficients of the monomials in the binomial
expansion of $$(x + y)^n$$. As such, we also refer to $$\binom{n}{k}$$ as a
[binomial coefficient](https://en.wikipedia.org/wiki/Binomial_coefficient), a
concept we discuss further in the next section, since it gives us a way to
calculate the coefficient of the $$k$$th monomial in the binomial expansion of
$$(x + y)^n$$.

Returning to Formula \ref{eq:binomial-theorem-exponents}, we can now combine it
with the binomial coefficient $$\binom{n}{k}$$ and obtain the sum,

$$
\begin{equation}
  \tag{8}\label{eq:binomial-theorem-obtained}
  \sum_{k=0}^n \binom{n}{k} x^{n-k} y^k,
\end{equation}
$$

which calculates the binomial expansion of the expression $$(x + y)^n$$,
yielding the following theorem.

**Theorem 1** (Binomial Theorem). *Given two natural numbers* $$x$$ *and* $$y$$,
*and an exponent* $$n$$*, the expression* $$(x +   y)^n$$ *can be expanded into
the sum,*

$$
\begin{equation*}
  (x + y)^n = \binom{n}{0}x^ny^0 + \binom{n}{1}x^{n-1}y^1 + \cdots +
  \binom{n}{n-1}x^1y^{n-1} + \binom{n}{n}x^0y^n,
\end{equation*}
$$

*where* $$\binom{n}{k}$$ *is the binomial coefficient. This expansion can also be
written in summation notation as,*

$$
\begin{align}
  \tag{9}\label{eq:binomial-theorem-statement}
  \begin{split}
  (x + y)^n
  &= \sum_{k=0}^n \binom{n}{k} x^{n-k} y^k\\
  &= \sum_{k=0}^n \binom{n}{k} x^k y^{n-k},
  \end{split}
\end{align}
$$

*where the last equivalence follows from the symmetry of the sequence of
binomial coefficients and of* $$x$$ *and* $$y$$.

Having stated the binomial theorem, we return to the binomial coefficient and
show how to properly calculate and formalize it.

### 4. The binomial coefficient

As mentioned in the previous section, the binomial coefficient $$\binom{n}{k}$$
is equal to the coefficient of the $$k$$th monomial in the binomial expansion of
$$(x + y)^n$$ and can be read from Pascal's triangle, as the $$k$$th entry of
the $$n$$th row. This suggests that we can obtain a binomial coefficient
function if we can reduce the formalization we came up with in Section
[2](#pascal-s-triangle) into something computable.

In order to come up with such a binomial coefficient function, we need to cover
the base cases and the inductive cases for the row and column indices, `n` and
`k`. Hence, we first observe that the base case $$\binom{n}{0} = 1$$, covers the
two cases where `(n = 0, k = 0)` and `(n > 0, k = 0)`, which leaves the cases
`(n = 0, k > 0)` and `(n > 0, k > 0)`. For the case `(n = 0, k > 0)`, we know
from the definition of Pascal's triangle that for all values $$n < k$$ the
result is $$0$$, and similarly we know that the case `(n > 0, k > 0)` is the sum
of the two entries just above it `(n-1, k)` and `(n-1, k-1)`. Combining these
observations we get the following
[Haskell](https://en.wikipedia.org/wiki/Haskell_(programming_language))
definition[^2],

{% gist dragonwasrobot/6601b204351b289da1fd binomial_coefficient.hs %}

where we express the rules above in terms of
[guards](https://en.wikipedia.org/wiki/Guard_(computer_science)).

Having formalized the binomial coefficient and defined a function computing it
binomial coefficient, `binomial_coefficient`, we are ready to conclude this blog
post.

### 5. Conclusion

In this blog post, we have introduced and formalized Pascal's triangle and the
binomial coefficient function.

We obtained the above results by first describing the construction of Pascal's
triangle in an inductive fashion, followed by formalizing Pascal's
triangle. Afterwards, we introduced the binomial coefficient function, as a
result of describing the binomial theorem, and formalized it as the function,
`binomial_coefficient`, in Haskell.

In a coming follow-up post, we look at what happens when we rotate Pascal's
triangle and the binomial coefficient, and their properties.

[^1]: See "Cambridge University Library: The great collection" (1998) by Peter
    Fox.

[^2]: We quietly ignore the cases where `n` and `k` are negative, and instead
    treat them as natural numbers.
