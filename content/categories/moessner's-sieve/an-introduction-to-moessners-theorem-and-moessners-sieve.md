+++
title = "An introduction to Moessner's theorem&#x000a;and Moessner's sieve"
author = ["Peter Urbak"]
date = 2016-01-12T00:00:00Z
tags = ["Haskell", "Mathematics"]
categories = ["Moessner's Sieve"]
draft = false
+++

## 1. Introduction {#1-dot-introduction}

This is a follow-up post to [Rotating Pascal's triangle and the binomial
coefficient](/categories/moessners-sieve/rotating-pascals-triangle-and-the-binomial-coefficient). The goal of this post is to introduce and formalize Moessner's
theorem and Moessner's sieve.

The post is structured as follows. In Section [2](#2-dot-moessner-s-theorem-and-moessner-s-sieve), we introduce the basics of
Moessner's theorem and Moessner's sieve. Afterwards, we discuss some of the
generalizations of Moessner's theorem in Section [3](#3-dot-generalizations-of-moessner-s-theorem), and finally implement
Moessner's sieve in Section [4](#4-dot-implementing-moessner-s-sieve) The post is concluded in Section [5](#5-dot-conclusion).


## 2. Moessner's theorem and Moessner's sieve {#2-dot-moessner-s-theorem-and-moessner-s-sieve}

_Moessner's theorem_ was originally conjectured by Alfred Moessner in 1951[^fn:1]
and subsequently proved by Oskar Perron[^fn:2] -- less than a year after its initial
publication. Moessner's theorem states that given an _initial sequence_ of
positive natural numbers,

\begin{equation\*}
  1, 2, 3, \dots,
\end{equation\*}

and a natural number \\(k \ge 2\\) we obtain the _result sequence of successive
powers_,

\begin{equation}
\tag{1}\label{intro-sequence-of-successive-powers}
  1^k, 2^k, 3^k, \dots,
\end{equation}

when performing the following procedure:

1.  Drop every \\(k\\)th element of the inital sequence,
2.  partially sum the remaining elements into a new sequence, and
3.  decrease \\(k\\) by \\(1\\).

The above procedure is repeated if \\(k > 1\\) and stops if \\(k = 1\\). We name the
procedure _Moessner's sieve_[^fn:3] and call \\(k\\) the _rank_ of the sieve.

In order to illustrate Moessner's theorem we go through its most basic example,
where we apply Moessner's sieve of rank \\(k = 2\\) on the initial sequence of
positive natural numbers,

\begin{equation\*}
  \begin{array}{\*{7}{r}}
    1 & 2 & 3 & 4 & 5 & 6 & \dots \\\\
    1 &   & 3 &   & 5 &   & \dots \\\\
    1 &   & 4 &   & 9 &   & \dots
  \end{array}
\end{equation\*}

Here, we start by dropping every 2nd element of the initial sequence, \\((2, 4, 6,
\dots)\\), then partially sum the remaining values, \\((1, 3, 5, \dots)\\), and obtain a new
sequence, \\((1, 4, 9, \dots)\\). Finally, \\(k\\) is decreased from 2 to 1 and the
procedure stops. As stated by the theorem, the resulting sequence now
corresponds to the sequence of squares,

\begin{equation\*}
  1^2, 2^2, 3^2, \dots.
\end{equation\*}

For the remainder of this post, we contract the dropping and partial summing of
Moessner's sieve into a single step and mark the dropped elements by making them
boldface. Using this notation, the above example becomes,

\begin{equation\*}
  \begin{array}{\*{13}{r}}
    1 & \textbf{2} & 3 & \textbf{4} & 5 & \textbf{6} & 7 & \textbf{8} &
    9 & \textbf{10} & 11 & \textbf{12} & \dots \\\\
    1 & & 4 & & 9 & & 16 & & 25 & & 36 & & \dots
  \end{array}
\end{equation\*}

where the condition still holds that \\(k = 2\\) and the result sequence is the
sequence of squares. Before we proceed with some of the generalizations of
Moessner's theorem, let us go through one more example:

If we let the rank be \\(k = 3\\) and let the initial sequence be the positive
natural numbers, we obtain the result,

\begin{equation\*}
  \begin{array}{\*{13}{r}}
    1 & 2 & \textbf{3} & 4 & 5 & \textbf{6} & 7 & 8 & \textbf{9}
      & 10 & 11 & \textbf{12} & \dots \\\\
    1 & \textbf{3} & & 7 & \textbf{12} & & 19 & \textbf{27} &
      & 37 & \textbf{48} & & \dots \\\\
    1 & & & 8 & & & 27 & &
      & 64 & & & \dots
  \end{array}
\end{equation\*}

by performing the following steps of Moessner's sieve:

-   Drop every 3rd element of the initial sequence, then
-   partially sum the remaining elements into a new sequence, and
-   decrease \\(k\\) by \\(1\\). Repeat the procedure, by
-   dropping every 2nd element of the intermediate sequence,
-   partially sum the remaining elements into a new sequence, and
-   decrease \\(k\\) by \\(1\\). Finally,
-   the procedure stops as \\(k = 1\\) and the result sequence is \\((1, 8, 27, 64, \dots)\\).

As stated by Moessner's theorem, the result sequence now corresponds to the
sequence of cubes,

\begin{equation\*}
1^3, 2^3, 3^3, 4^3, \dots.
\end{equation\*}

Next, we look at some of the generalizations of Moessner's theorem.


## 3. Generalizations of Moessner's theorem {#3-dot-generalizations-of-moessner-s-theorem}

In this section, we discuss a few of the ways in which to generalize Moessner's
theorem, specifically:

-   How to generalize the initial sequence of positive natural numbers, and
-   how to generalize the statement of Moessner's theorem using Pascal's triangle.

We go through each of the generalizations in turn.


### 3.1 Generalizing the initial sequence of Moessner's theorem {#3-dot-1-generalizing-the-initial-sequence-of-moessner-s-theorem}

If we examine the mechanics of Moessner's sieve, we notice that the initial
sequence of positive natural numbers can be viewed as the result of another
partial summation, i.e., we can obtain the sequence of positive natural numbers
by partially summing the sequence of \\(1\\)s. Thus, instead of starting from the
initial sequence of the positive natural numbers, we can start from the initial
sequence of \\(1\\)s by first dropping every \\((k + 1)\\)th element, while still
obtaining the result sequence in Formula
\ref{intro-sequence-of-successive-powers}. So, if we let the rank \\(k = 3 + 1\\)
and use the initial sequence of \\(1\\)s, we obtain the following result,

\begin{equation\*}
  \begin{array}{\*{13}{r}}
    1 & 1 & 1 & \textbf{1} & 1 & 1 & 1 & \textbf{1} &
    1 & 1 & 1 & \textbf{1} & \dots \\\\
    1 & 2 & \textbf{3} & & 4 & 5 & \textbf{6} & &
    7 & 8 & \textbf{9} & & \dots \\\\
    1 & \textbf{3} & & & 7 & \textbf{12} & & &
    19 & \textbf{27} & & &  \dots \\\\
    1 & & & & 8 & & & &
    27 & & & & \dots
  \end{array}
\end{equation\*}

where the result sequence is still the sequence of cubes, \\((1^3, 2^3, 3^3, \dots)\\),
as in the previous example, even though we have simplified the initial sequence.
Once again, we notice that the new initial sequence of \\(1\\)s is actually also
the result of a partial summation. Specifically, we can obtain the sequence of
\\(1\\)s by partially summing the sequence of a \\(1\\) followed by \\(0\\)s. This
suggests that if we use the sequence of a \\(1\\) followed by \\(0\\)s as the initial
sequence, and start by dropping every \\((k + 2)\\)th element of the initial
sequence, we still obtain the intended result sequence,

\begin{equation\*}
  \begin{array}{\*{16}{r}}
  1 & 0 & 0 & 0 & \textbf{0} &
  0 & 0 & 0 & 0 & \textbf{0} &
  0 & 0 & 0 & 0 & \textbf{0} & \dots \\\\
  %
  1 & 1 & 1 & \textbf{1} & &
  1 & 1 & 1 & \textbf{1} & &
  1 & 1 & 1 & \textbf{1} & & \dots \\\\
  %
  1 & 2 & \textbf{3} & & &
  4 & 5 & \textbf{6} & & &
  7 & 8 & \textbf{9} & & & \dots \\\\
  %
  1 & \textbf{3} & & & &
  7 & \textbf{12} & & & &
  19 & \textbf{27} & & & & \dots \\\\
  %
  1 & & & & &
  8 & & & & &
  27 & & & & & \dots
  \end{array}
\end{equation\*}

Finally, we notice that the initial sequence of a \\(1\\) followed by \\(0\\)s is not
the result of a partial summation, and we have therefore reached the end of our
generalization of the initial sequence.[^fn:4]


### 3.2 Generalizing Moessner's theorem using Pascal's triangle {#3-dot-2-generalizing-moessner-s-theorem-using-pascal-s-triangle}

In 1966, Calvin T. Long picked up Moessner's theorem and observed that the
implicit triangles - which we call _Moessner triangles_ - that appear when
laying out Moessner's sieve as shown below,

\begin{equation}
  \tag{2}\label{eq:mossiv-ones-rank-4}
  \begin{array}{\*{16}{r}}
    1 & 1 & 1 & 1 & \textbf{1} & 1 & 1 & 1 & 1 & \textbf{1} & 1 & 1 & 1 & 1 &
    \textbf{1} & \dots \\\\
    1 & 2 & 3 & \textbf{4} & & 5 & 6 & 7 & \textbf{8} & & 9 & 10 & 11 &
    \textbf{12} & & \dots \\\\
    %
    1 & 3 & \textbf{6} & & & 11 & 17 & \textbf{24} & & & 33 & 43 & \textbf{54} & & &
    \dots \\\\
    %
    1 & \textbf{4} & & & & 15 & \textbf{32} & & & & 65 & \textbf{108} & & & &
    \dots \\\\
    %
    1 & & & & & 16 & & & & & 81 & & & & & \dots
  \end{array}
\end{equation}

are constructed in a similar way to [Pascal's triangle](https://en.wikipedia.org/wiki/Pascal%27s_triangle),

\begin{equation} % Pascal's triangle
  \tag{3}\label{eq:pascal-triangle-rank-4}
  \begin{array}{\*{9}{c}}
    & & & & 1 & & & & \\\\
    & & & 1 & & 1 & & & \\\\
    & & 1 & & 2 & & 1 & & \\\\
    & 1 & & 3 & & 3 & & 1 & \\\\
    1 & & 4 & & 6 & & 4 & & 1 \\\\
  \end{array}
\end{equation}

The similarity lies in the observation that each entry in Pascal's triangle is
the sum of the two values immediately above it,[^fn:5]

\begin{equation\*}
  \begin{array}{\*{5}{c}}
    1 &            &   &            & 2 \\\\
      &   \searrow &   &   \swarrow &   \\\\
      &            & 3 &            &
  \end{array}
\end{equation\*}

while each entry in a Moessner triangle is the sum of the value immediately
above it (northern neighbor) and left of it (western neighbor),

\begin{equation\*}
  \begin{array}{ccc}
        &     &          2 \\\\
        &     & \downarrow \\\\
      1 & \to &          3
    \end{array}
\end{equation\*}

suggesting an equivalence relation between the two functions generating the
triangles. This connection is also emphasized by the first Moessner triangle in
Figure \ref{eq:mossiv-ones-rank-4}, as it has the same entries as Pascal's
triangle in Figure \ref{eq:pascal-triangle-rank-4}.[^fn:6]

Long used this observation about the similar constructions to prove a new
generalization of Moessner's theorem, which involved the introduction of a
generalized version of Pascal's triangle,

\begin{equation} % Generalization of Pascal's triangle
    \begin{array}{\*{9}{c}}
      & & & & d\_0 & & & & \\\\
      & & & a\_1 & & d\_1 & & & \\\\
      & & a\_2 & & a\_1 + d\_1 & & d\_2 & & \\\\
      & a\_3 & & a\_2 + a\_1 + d\_1 & & a\_1 + d\_1 + d\_2 & & d\_3 &
    \end{array}
\end{equation}

starting from two arbitrary sequences, \\((a\_1, a\_2, \dots)\\) and \\((d\_0, d\_1, \dots)\\),
instead of two sequences of \\(1\\)s. Long then showed how using an arithmetic
progression as the initial sequence,

\begin{equation}
  \tag{4}\label{eq:related-work-long-initial-sequence}
  a, a + d, a + 2d, a + 3d, \dots,
\end{equation}

yields the following result sequence,

\begin{equation}
  \tag{5}\label{eq:related-work-long-partial-sums-sequence}
  a \cdot 1^{k - 1}, (a + d) \cdot 2^{k - 1}, (a + 2d) \cdot 3^{k - 1}, \dots,
\end{equation}

where \\(k - 1\\) corresponds to the number of iterations in Moessner's sieve. When
letting \\(a = 1\\) and \\(d = 1\\), the initial sequence in Formula
\ref{eq:related-work-long-initial-sequence} corresponds to the positive natural
numbers,

\begin{equation\*}
  \begin{array}{\*{5}{r}}
    1, & 1 + 1, & 1 + 2 \cdot 1, & 1 + 3 \cdot 1, & \dots \\\\
    1, &     2, &         3, &         4, & \dots
    \end{array}
\end{equation\*}

and the result sequence in Formula
\ref{eq:related-work-long-partial-sums-sequence} becomes the sequence of
successive powers,

\begin{equation\*}
  \begin{array}{\*{7}{r}}
    1 \cdot 1^{k-1}, & (1 + 1) + 2^{k-1}, &
    (1 + 2 \cdot 1) \cdot 3^{k-1} , &
    (1 + 3 \cdot 1) \cdot 4^{k-1} , & \dots \\\\
    %
    1 \cdot 1^{k-1}, & 2 + 2^{k-1}, &
    3 \cdot 3^{k-1} , & 4 \cdot 4^{k-1} , & \dots \\\\
    %
    1^{k}, & 2^{k}, & 3^{k} , & 4^{k} , & \dots \\\\
  \end{array}
\end{equation\*}

yielding Moessner's theorem.[^fn:7]

Having covered the basics of Moessner's theorem and some of its generalizations,
we now take a closer look at Moessner's sieve and formalize it in [Haskell](https://en.wikipedia.org/wiki/Haskell_(programming_language)).


## 4. Implementing Moessner's sieve {#4-dot-implementing-moessner-s-sieve}

In order to formalize and implement Moessner's sieve, we start by restating the
description of Moessner's sieve, as described in Section [2](#2-dot-moessner-s-theorem-and-moessner-s-sieve).

Given an initial sequence and a natural number \\(k\\), repeat the procedure:

1.  Drop every \\(k\\)th element of the initial sequence,
2.  partially sum the remaining elements into a new sequence, and
3.  decrease \\(k\\) by \\(1\\).

Repeat the above procedure with the new sequence as the initial sequence if \\(k >
1\\) and stop if \\(k = 1\\).

The first step, in the process of translating the above description into
Haskell, is to define the types we are going to use. Thus, we represent a
sequence of values as a `Stream` type, corresponding to a list of `Int`,

```haskell
type Stream = [Int]
```

and we represent a rank as a `Rank` type, corresponding to an `Int`,

```haskell
type Rank = Int
```

Then, we translate Step 1. of the Moessner's sieve procedure to the stream
operator `dropEvery`,

```haskell
dropEvery :: Int -> Stream -> Stream
dropEvery n σ = (take n σ) ++ (dropEvery n $ drop (n + 1) σ)
```

which works by taking the `n` first elements of a `Stream`, `σ`, and then
recursively calling itself with `σ` where the \\(n + 1\\) first elements have been
dropped, thereby removing the \\((n + 1)\\)th element of the resulting `Stream`.

In order to translate Step 2. we first define a `partiallySum` stream operator,

```haskell
partiallySum :: Int -> Stream -> Stream
partiallySum a σ =
  let a' = a + (head σ)
  in a' : (partiallySum a' $ tail σ)
```

which, given an accumulator, `a`, partially sums the elements of a `Stream`,
`σ`, by adding the head of the `Stream` to the accumulator and recursively
calling itself with the tail of `σ`. Then, we define the stream operator
`sieveStep`,

```haskell
sieveStep :: Rank -> Stream -> Stream
sieveStep n σ = (partiallySum 0) . (dropEvery n) $ σ
```

as the function composition of `dropEvery` and `partiallySum`, which reflects
the logic of Step 1. and 2. of Moessner's sieve, by dropping every \\(n\\)th
element of a `Stream`, `σ`, and then partially summing the remaining elements.
Finally, we capture Step 3. of Moessner' sieve, and the conditional check of the
rank, as the stream operator `moessnersSieve`,

```haskell
moessnersSieve :: Rank -> Stream -> Stream
moessnersSieve 0 σ = σ
moessnersSieve n σ = moessnersSieve (n - 1) (sieveStep n σ)
```

which returns its `Stream` argument, `σ`, when `n = 0`, and otherwise
recursively calls itself with `n - 1` and one iteration of the `sieveStep`
operator applied to `σ`. To demonstrate that our formalization is in alignment
with Moessner's theorem, we define the `Stream` of natural numbers, `nats`, and
check that the first five values of the result `Stream`, obtained when applying
`moessnersSieve` with rank `1..3` on `nats`, yields the expected results,

```haskell
nats :: Stream
nats = [1..]

(take 5 $ moessnersSieve 1 nats) == [1,4,9,16,25]
(take 5 $ moessnersSieve 2 nats) == [1,8,27,64,125]
(take 5 $ moessnersSieve 3 nats) == [1,16,81,256,625]
```

This completes our implementation of Moessner's sieve and we are now ready to
conclude this post.


## 5. Conclusion {#5-dot-conclusion}

In this post, we have introduced Moessner's theorem and Moessner's sieve, along
with some of the generalizations of Moessner's theorem. Furthermore, we have
formalized and implemented Moessner's sieve in Haskell.

In our [next post](/categories/moessners-sieve/a-dual-to-moessners-sieve), we introduce the dual to Moessner's sieve, which generates
Moessner triangles in a column-by-column fashion.

[^fn:1]: See "Eine Bemerkung über die Potenzen der natürlichen Zahlen" (1951) by
    Alfred Moessner.
[^fn:2]: See "Beweis des Moessnerschen Satzes" (1951) by Oskar Perron.
[^fn:3]: The name **Moessner's sieve** was first coined by Olivier Danvy in the paper
    "A Characterization of Moessner's sieve" (2014).
[^fn:4]: See "A Characterization of Moessner's sieve" (2014) by Danvy et al.
[^fn:5]: See the post [An introduction to Pascal's triangle and the binomial
    coefficient](/categories/moessners-sieve/an-introduction-to-pascals-triangle-and-the-binomial-coefficient) for more about the intuition behind Pascal's triangle.
[^fn:6]: See the post [Rotating Pascal's triangle and the binomial coefficient](/categories/moessners-sieve/rotating-pascals-triangle-and-the-binomial-coefficient) on how
    to rotate Pascal's triangle to resemble the first Moessner triangle.
[^fn:7]: See "On the Moessner Theorem on Integral Powers" (1966) by Calvin T. Long.
