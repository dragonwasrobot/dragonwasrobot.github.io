+++
title = "Idealized versions of Moessner's theorem&#x000a;and Long's theorem"
author = ["Peter Urbak"]
summary = "In this post, we present idealized versions of Moessner's theorem and Long's theorem."
date = 2016-07-10T00:00:00Z
tags = ["Haskell", "Mathematics", "Moessner's Process", "Moessner's Theorem", "Long's Theorem"]
categories = ["Moessner's Theorem"]
draft = false
+++

<div class="blockquote">

_"One chord is fine._<br />
_Two chords are pushing it._<br />
_Three chords and you're into jazz."_<br />
-- **Lou Reed**

</div>


## 1. Introduction {#1-dot-introduction}

This is a follow-up post to [A grid of Moessner triangles](/posts/a-grid-of-moessner-triangles). The goal of this blog
post is to state Moessner's idealized theorem, Long's idealized theorem, and
conjecture a further generalization.

The chapter is structured as follows. In Section [2](#2-dot-moessner-s-idealized-theorem) we start by adapting
Moessner's theorem to the dual sieve in order to obtain Moessner's idealized
theorem. Then, in Section [3](#3-dot-long-s-idealized-theorem), we repeat the process for Long's theorem, which
motivates the statement of Long's idealized theorem along with Long's weak
theorem. Finally, we conjecture a further generalization of Long's idealized
theorem in Section [4](#4-dot-beyond-long-s-idealized-theorem). The post is concluded in Section [5](#5-dot-conclusion).


## 2. Moessner's idealized theorem {#2-dot-moessner-s-idealized-theorem}

In order to obtain Moessner's idealized theorem, we start from Moessner's
original theorem, generalize it and adapt it to the dual sieve.

**Theorem 1** (Moessner's theorem). _Given an initial sequence of positive natural
numbers,_

\begin{equation\*}
  1, 2, 3, \dots,
\end{equation\*}

_and a natural number \\(k \ge 2\\), we obtain the result sequence of successive
powers,_

\begin{equation\*}
  1^k, 2^k, 3^k, \dots,
\end{equation\*}

_when performing the following procedure:_

1.  _Drop every \\(k\\)th element of the inital sequence,_
2.  _partially sum the remaining elements into a new sequence, and_
3.  _decrease \\(k\\) by \\(1\\)._

_The above procedure is repeated if \\(k>1\\) and stops if \\(k=1\\). We call the
procedure above Moessner’s sieve and call \\(k\\) the rank of the sieve._

As we saw in [the first post on Moessner's theorem](/posts/an-introduction-to-moessner-s-theorem-and-moessners-sieve) we can generalize the initial
sequence and still obtain the same result sequence,

**Theorem 2** (Moessner's generalized theorem). _Given the initial sequence of \\(1\\)
followed by \\(0\\)s,_

\begin{equation\*}
    1, 0, 0, \dots,
\end{equation\*}

_and a natural number \\(k + 2\\), we obtain the result sequence of successive
powers,_

\begin{equation\*}
  1^k, 2^k, 3^k, \dots,
\end{equation\*}

_when applying Moessner's sieve on the initial sequence._

So, if we let the rank \\(k = 4\\), an example application of Theorem 2 becomes,

\begin{equation\*}
  \begin{array}{\*{19}{r}}
    1 & 0 & 0 & 0 & 0 & \textbf{0} & 0 & 0 & 0 & 0 & 0 & \textbf{0} & 0 & 0 & 0
    & 0 & 0 & \textbf{0} & \dots \\\\
    1 & 1 & 1 & 1 & \textbf{1} & & 1 & 1 & 1 & 1 & \textbf{1} & & 1 & 1 & 1 & 1
    & \textbf{1} & & \dots \\\\
    1 & 2 & 3 & \textbf{4} & & & 5 & 6 & 7 & \textbf{8} & & & 9 & 10 & 11 &
    \textbf{12} & & & \dots \\\\
    %
    1 & 3 & \textbf{6} & & & & 11 & 17 & \textbf{24} & & & & 33 & 43 &
    \textbf{54} & & & & \dots \\\\
    %
    1 & \textbf{4} & & & & & 15 & \textbf{32} & & & & & 65 & \textbf{108} & & &
    & & \dots \\\\
    %
    1 & & & & & & 16 & & & & & & 81 & & & & & & \dots
  \end{array}
\end{equation\*}

where we still obtain a result sequence of values to the fourth power. If we
compare the above example to where we left off in the [post on the dual of
Moessner's sieve](/posts/a-dual-to-moessners-sieve),

\begin{equation\*}
  \begin{array}{\*{8}{r}}
     & & 0 & 0 & 0 & 0 & 0 & 0 \\\\\\\
   1 & & 1 & 1 & 1 & 1 & 1 &   \\\\
   0 & & 1 & 2 & 3 & 4 &   &   \\\\
   0 & & 1 & 3 & 6 &   &   &   \\\\
   0 & & 1 & 4 &   &   &   &   \\\\
   0 & & 1 &   &   &   &   &   \\\\
   0 & &   &   &   &   &   &
  \end{array}
  \begin{array}{\*{8}{r}}
      & &  0 &  0 &  0 & 0 & 0 & 0 \\\\\\\
    1 & &  1 &  1 &  1 & 1 & 1 &   \\\\
    4 & &  5 &  6 &  7 & 8 &   &   \\\\
    6 & & 11 & 17 & 24 &   &   &   \\\\
    4 & & 15 & 32 &    &   &   &   \\\\
    1 & & 16 &    &    &   &   &   \\\\
    0 & &    &    &    &   &   &
  \end{array}
  \begin{array}{\*{8}{r}}
      & &  0 &   0 &  0 &  0 & 0 & 0 \\\\\\\
    1 & &  1 &   1 &  1 &  1 & 1 &   \\\\
    8 & &  9 &  10 & 11 & 12 &   &   \\\\
   24 & & 33 &  43 & 54 &    &   &   \\\\
   32 & & 65 & 108 &    &    &   &   \\\\
   16 & & 81 &     &    &    &   &   \\\\
    0 & &    &     &    &    &   &
  \end{array}
\end{equation\*}

where we introduced the concept of an initial configuration of a sieve along
with the concept of seed tuples, we notice that instead of an initial sequence
of \\(1\\) followed by \\(0\\)s, we have an initial configuration of two seed tuples,
where the horizontal seed tuple is filled with \\(0\\)s and the vertical seed
tuple is filled with a \\(1\\) followed by \\(0\\)s. Likewise, instead of a result
sequence of values to the forth power, we obtain a sequence of Moessner
triangles, whose bottom-most elements enumerate the same result sequence of
values to the forth power. If we apply these differences to the statement of
Theorem 2, we obtain Moessner's idealized theorem,

**Theorem 3** (Moessner's idealized theorem). _Given an initial configuration of
two seed tuples with length \\(k + 2\\),_

\begin{equation\*}
  (0,0,0,\dots,0) \textit{ and } (1,0,0,\dots,0),
\end{equation\*}

_we obtain the sequence of Moessner triangles of rank \\(k\\), where the bottom-most
elements enumerate the sequence,_

\begin{equation\*}
  1^k, 2^k, 3^k, \dots.
\end{equation\*}

Having gone from Moessner's original theorem to Moessner's idealized theorem,
which reflects the structure of the dual sieve, we proceed to apply similar
transformations to Long's theorem.


## 3. Long's idealized theorem {#3-dot-long-s-idealized-theorem}

In order to state Long's idealized theorem, we follow the same process as
established in the previous section, and repeat the traditional definition of
Long's theorem and afterwards adapt it to the dual sieve.

**Theorem 4** (Long's theorem). _Given an initial sequence, which can be
described as an arithmetic progression,_

\begin{equation\*}
  c, c + d, c + 2d, c + 3d, \dots,
\end{equation\*}

_we obtain the result sequence,_

\begin{equation\*}
  c \cdot 1^{k - 1}, (c + d) \cdot 2^{k - 1}, (c + 2d) \cdot 3^{k - 1}, \dots,
\end{equation\*}

_when applying Moessner's sieve of rank \\(k\\) on the initial sequence._

We can visualize Long's theorem as the sieve,

\begin{equation\*}
  \begin{array}{\*{11}{r}}
  c &  c+d &  c+2d & c+3d & &  c+4d &    c+5d &   c+6d & c+7d & & \dots \\\\
  c & 2c+d & 3c+3d &      & & 4c+7d &  5c+12d & 6c+18d &      & & \dots \\\\
  c & 3c+d &       &      & & 7c+8d & 12c+20d &        &      & & \dots \\\\
  c &      &       &      & & 8c+8d &         &        &      & & \dots
  \end{array}
\end{equation\*}

for which Long[^fn:1] also noted that we can generalize the sieve by adding a row of
$d$s,

\begin{equation\*}
  \begin{array}{\*{11}{r}}
    d &    d &     d &    d & d &     d &       d &      d &    d & d & \\\\
    c &  c+d &  c+2d & c+3d &   &  c+4d &    c+5d &   c+6d & c+7d &   & \\\\
    c & 2c+d & 3c+3d &      &   & 4c+7d &  5c+12d & 6c+18d &      &   & \\\\
    c & 3c+d &       &      &   & 7c+8d & 12c+20d &        &      &   & \\\\
    c &      &       &      &   & 8c+8d &         &        &      &   &
  \end{array}
\end{equation\*}

However, this unfortunately gives us an inconsistent initial column, since it
contains a \\(d\\) at the top but \\(c\\)s in the remaining entries. So, we take the
liberty of adjusting the initial configuration of the sieve to better suit our
dual sieve, by ridding ourselves of the above inconsistency. Thus, we move the
\\(c\\)s of the initial column into the vertical seed tuple, and at the same time
generalize to a single seed value \\(c\\), while putting the \\(d\\)s into the
horizontal seed tuples, yielding the following sieve,[^fn:2]

\begin{equation\*}
  \begin{array}{r r : \*{5}{r:} r \*{4}{r:} r}
      & &      d &       d &      d &    d & d &
        &      d &       d &      d &    d & d \\\\
    %
      & &        &         &        &      &   &
        &        &         &        &      &   \\\\
    %
    c & &    c+d &    c+2d &   c+3d & c+4d &   &
        &   c+5d &    c+6d &   c+7d & c+8d &   \\\\
    %
    0 & &    c+d &   2c+3d &  3c+6d &      &   &
        & 4c+11d &  5c+17d & 6c+24d &      &   \\\\
    %
    0 & &    c+d &   3c+4d &        &      &   &
        & 7c+15d & 12c+32d &        &      &   \\\\
    %
    0 & &    c+d &         &        &      &   &
        & 8c+16d &         &        &      &   \\\\
    %
    0 & &        &         &        &      &   &
        &        &         &        &      &
  \end{array}
\end{equation\*}

While moving the \\(c\\)s has changed the coefficients of the \\(d\\)s in the sieve,
we now have a more consistent initial configuration, which we believe to be in
the spirit of Long's original theorem, with one constant, \\(c\\), in the vertical
seed tuple and the horizontal seed tuples filled with the constant \\(d\\). As it
turns out, we can perform a further generalization of the initial configuration
by replacing the sequence of \\(d\\)s with a \\(d\\) followed by \\(0\\)s, while putting
it in the vertical seed tuple, as we did with the sequence of \\(1\\)s when we
defined the dual of Moessner's sieve,

\begin{equation\*}
  \begin{array}{r r : \*{6}{r:} r \*{5}{r:} r}
      & &      0 &       0 &      0 &    0 & 0 &
    0 & &      0 &       0 &      0 &    0 & 0 & 0 \\\\
    %
      & &        &         &        &      &   &
      & &        &         &        &      &   &   \\\\
    %
    d & &      d &       d &      d &    d & d &
      & &      d &       d &      d &    d & d &   \\\\
    %
    c & &    c+d &    c+2d &   c+3d & c+4d &   &
      & &   c+5d &    c+6d &   c+7d & c+8d &   &   \\\\
    %
    0 & &    c+d &   2c+3d &  3c+6d &      &   &
      & & 4c+11d &  5c+17d & 6c+24d &      &   &   \\\\
    %
    0 & &    c+d &   3c+4d &        &      &   &
      & & 7c+15d & 12c+32d &        &      &   &   \\\\
    %
    0 & &    c+d &         &        &      &   &
      & & 8c+16d &         &        &      &   &   \\\\
    %
    0 & &        &         &        &      &   &
      & &        &         &        &      &   &
  \end{array}
\end{equation\*}

This results in a minimal initial configuration consisting of a vertical seed
tuple containing a constant \\(d\\) and a constant \\(c\\) followed by \\(0\\)s. We can
now state Long's idealized theorem as follows,

**Theorem 5** (Long's idealized theorem). _Given an initial configuration of two
seed tuples of length \\(k + 2\\),_

\begin{equation\*}
  (0,0,0,\dots,0) \textit{ and } (d,c,0,\dots,0),
\end{equation\*}

_we obtain the sequence of Moessner triangles of rank \\(k\\), where the bottom-most
elements enumerate the sequence,_

\begin{equation}\label{eq:long-result-stream}
  d \cdot {(1 + t)}^{k} + c \cdot {(1 + t)}^{k-1},
\end{equation}

_for values of \\(t \ge 0\\), when applying the dual of Moessner's sieve on the
initial configuration._

As a result of the transformations made above, we now notice that the
coefficients of the \\(c\\)s correspond to the values of Moessner triangles at
rank \\(k\\) while the coefficients of the \\(d\\)s now correspond to the values of
Moessner triangles at rank \\(k - 1\\). This observation suggests that we can view
the above sieve as the composition of two sieves, one creating Moessner
triangles of rank \\(3\\) filled with \\(c\\)s,

\begin{equation\*}
  \begin{array}{\*{14}{r}}
     && 0 &  0 &  0 & 0 & 0 &    &&  0 &   0 &  0 & 0 & 0 \\\\\\\
   c && c &  c &  c & c &   &  c &&  c &   c &  c & c & \\\\
   0 && c & 2c & 3c &   &   & 3c && 4c &  5c & 6c &   & \\\\
   0 && c & 3c &    &   &   & 3c && 7c & 12c &    &   & \\\\
   0 && c &    &    &   &   &  c && 8c &     &    &   & \\\\
   0 &&   &    &    &   &   &  0 &&    &     &    &   &
  \end{array}
\end{equation\*}

and one creating Moessner triangles of rank \\(4\\) filled with \\(d\\)s,

\begin{equation\*}
  \begin{array}{\*{16}{r}}
     & & 0 &  0 &  0 &  0 & 0 & 0 &    &&   0 &   0 &   0 &  0 & 0 & 0 \\\\\\\
   d & & d &  d &  d &  d & d &   &  d &&   d &   d &   d &  d & d & \\\\
   0 & & d & 2d & 1d & 4d &   &   & 4d &&  5d &  6d &  7d & 8d &   & \\\\
   0 & & d & 3d & 6d &    &   &   & 6d && 11d & 17d & 24d &    &   & \\\\
   0 & & d & 4d &    &    &   &   & 4d && 15d & 32d &     &    &   & \\\\
   0 & & d &    &    &    &   &   &  d && 16d &     &     &    &   & \\\\
   0 & &   &    &    &    &   &   &  0 &&     &     &     &    &   &
  \end{array}
\end{equation\*}

This suggests that there is an additional step between Moessner's idealized
theorem and Long's idealized theorem, where we generalize the seed value of \\(1\\)
in Moessner's idealized theorem to a constant, \\(c\\), and obtain Long's weak
theorem,

**Theorem 6** (Long's weak theorem). _Given an initial configuration of two seed
tuples of length \\(k + 2\\),_

\begin{equation\*}
  (0,0,0,\dots,0) \textit{ and } (c,0,0,\dots,0),
\end{equation\*}

_we obtain the sequence of Moessner triangles of rank \\(k\\), where the bottom-most
elements enumerate the sequence,_

\begin{equation\*}
  c \cdot {(1 + t)}^{k},
\end{equation\*}

_for values of \\(t \ge 0\\), when applying the dual of Moessner's sieve on the
initial configuration._

Having defined Long's idealized theorem and Long's weak theorem, we try to look
beyond Long's theorem in the next section.


## 4. Beyond Long's idealized theorem {#4-dot-beyond-long-s-idealized-theorem}

Since Long's idealized theorem describes the result sequence generated by
Moessner's sieve, when starting from a seed tuple of two constants, \\(c\\) and \\(d\\),

\begin{equation\*}
  \begin{array}{r r : \*{6}{r:} r \*{5}{r:} r }
      & &      0 &       0 &      0 &    0 & 0 &
    0 & &      0 &       0 &      0 &    0 & 0 & 0 \\\\
    %
      & &        &         &        &      &   &
      & &        &         &        &      &   &   \\\\
    %
    d & &      d &       d &      d &    d & d &
      & &      d &       d &      d &    d & d &   \\\\
    %
    c & &    c+d &    c+2d &   c+3d & c+4d &   &
      & &   c+5d &    c+6d &   c+7d & c+8d &   &   \\\\
    %
    0 & &    c+d &   2c+3d &  3c+6d &      &   &
      & & 4c+11d &  5c+17d & 6c+24d &      &   &   \\\\
    %
    0 & &    c+d &   3c+4d &        &      &   &
      & & 7c+15d & 12c+32d &        &      &   &   \\\\
    %
    0 & &    c+d &         &        &      &   &
      & & 8c+16d &         &        &      &   &   \\\\
    %
    0 & &        &         &        &      &   &
      & &        &         &        &      &   &
  \end{array}
\end{equation\*}

we now ask the obvious question of what happens if we start from a seed tuple of
\\(3\\) or even \\(n\\) values? Looking at the result sequence of the above sieve, we
know that it enumerates the values of the binomial, \\(c \cdot {(1+t)}^3 + d \cdot
{(1+t)}^4\\), which gives us the idea to label \\(c = a\_3\\) and \\(d = a\_4\\), and fill
the rest of the seed tuple with \\(a\_i\\),

\begin{equation\*}
  \begin{array}{r : r \*{5}{r:} r}
        & &                   0 &                  0 &             0 &
                              0 &                  0 &             0 \\\\\\\
    %
    a\_4 & &                 a\_4 &                a\_4 &           a\_4 &
                            a\_4 &                a\_4 &              \\\\
    %
    a\_3 & &             a\_3+a\_4 &           a\_3+2a\_4 &      a\_3+3a\_4 &
                       a\_3+4a\_4 &                    &               \\\\
    %
    a\_2 & &         a\_2+a\_3+a\_4 &      a\_2+2a\_3+3a\_4 & a\_2+3a\_3+6a\_4 &
                                &                    &              \\\\
    %
    a\_1 & &     a\_1+a\_2+a\_3+a\_4 & a\_1+2a\_2+3a\_3+4a\_4 &               &
                                &                    &              \\\\
    %
    a\_0 & & a\_0+a\_1+a\_2+a\_3+a\_4 &                    &               &
                                &                    &               \\\\
    %
      0 & &                     &                    &               &
                                &                    &
  \end{array}
\end{equation\*}

yielding the above Moessner triangle. Now, if we examine the entries of the
hypotenuse in this triangle,

\begin{equation\*}
  \begin{array}{\*{9}{r}}
        &   &     &   &      &   &      &   &  a\_4\\\\
        &   &     &   &      &   &  a\_3 & + & 4a\_4\\\\
        &   &     &   &  a\_2 & + & 3a\_3 & + & 6a\_4\\\\
        &   & a\_1 & + & 2a\_2 & + & 3a\_3 & + & 4a\_4\\\\
    a\_0 & + & a\_1 & + &  a\_2 & + &  a\_3 & + &  a\_4
  \end{array}
\end{equation\*}

we notice that we can rearrange them into the following Pascal-like triangle,

\begin{equation\*}
  \begin{array}{\*{9}{c}}
        &     &      &      &  a\_0 &      &      &     & \\\\
        &     &      &  a\_1 &      &  a\_1 &      &     & \\\\
        &     &  a\_2 &      & 2a\_2 &      &  a\_2 &     & \\\\
        & a\_3 &      & 3a\_3 &      & 3a\_3 &      & a\_3 & \\\\
    a\_4 &     & 4a\_4 &      & 6a\_4 &      & 4a\_4 &     & a\_4
  \end{array}
\end{equation\*}

where the sum of the entries yields the following result,

\begin{equation\*}
  a\_0 + 2a\_1 + 4a\_2 + 8a\_3 + 16a\_4,
\end{equation\*}

located at the bottom of the first column of the second triangle of the sieve,
which we can restate as,

\begin{equation\*}
  2^0 \cdot a\_0 + 2^1 \cdot a\_1 + 2^2 \cdot a\_2 + 2^3 \cdot a\_3 + 2^4 \cdot a\_4.
\end{equation\*}

Likewise, if we calculated the next triangle and the subsequent first column, we
would obtain the values,

\begin{equation\*}
  a\_0 + 3a\_1 + 9a\_2 + 27a\_3 + 81a\_4,
\end{equation\*}

which we can once again restate as,

\begin{equation\*}
  3^0 \cdot a\_0 + 3^1 \cdot a\_1 + 3^2 \cdot a\_2 + 3^3 \cdot a\_3 + 3^4 \cdot a\_4.
\end{equation\*}

This observation suggests that the application of Moessner's sieve on an initial
configuration with the vertical seed tuple,

\begin{equation\*}
  a\_4, a\_3, a\_2, a\_1, a\_0,
\end{equation\*}

yields a sequence of Moessner triangles whose bottom-most elements enumerate the
values of the polynomial,

\begin{equation\*}
  p(t) = \sum\_{i=0}^4 a\_i \cdot {(1 + t)}^i,
\end{equation\*}

where \\(t\\) is the triangle index. Thus, we conjecture that applying the dual
sieve on an initial configuration where the vertical seed tuple consists of the
constants,

\begin{equation\*}
  a\_n, a\_{n-1}, \dots, a\_1, a\_0,
\end{equation\*}

yields a sequence of Moessner triangles where the bottom-most elements,
comprising the result sequence, enumerate the values of the polynomial,

\begin{equation\*}
  p(t) = \sum\_{i=0}^n a\_i \cdot {(1 + t)}^i.
\end{equation\*}

The reason why the above statement is a conjecture and not a theorem is because
the previous theorems have all been formalized and proved in my [Master's thesis](https://github.com/dragonwasrobot/formal-moessner),
while this last statement has not. However, there are strong indications of its
correctness as we can decompose a seed tuple consisting of any sum of two tuples
and have proved that the conjecture holds for the binomial \\(a\_{i+1} \cdot (1 + t)^{i+1} +
a\_i \cdot (1 + t)^i\\), as stated by Long's idealized theorem.


## 5. Conclusion {#5-dot-conclusion}

In this blog post, we have introduced idealized versions of Moessner's theorem
and Long's theorem -- along with Long's weak theorem -- stated in terms of the
dual of Moessner's sieve. Furthermore, we have conjectured a new generalization
of Long's theorem that connects it to polynomial evaluation.

This post is the final excerpt from my [Master's thesis](https://github.com/dragonwasrobot/formal-moessner), in which I formalize and
prove all the statements mentioned in this and the previous posts in the [Coq
proof assistant](https://en.wikipedia.org/wiki/Coq).

[^fn:1]: See "On the Moessner Theorem on Integral Powers" (1966) by Calvin T. Long.
[^fn:2]: The addition of the dotted vertical lines between each column is for the
    sake of readability.
