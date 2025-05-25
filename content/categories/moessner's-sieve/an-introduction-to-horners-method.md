+++
title = "An introduction to Horner's method"
author = ["Peter Urbak"]
date = 2015-08-03T00:00:00Z
tags = ["Haskell", "Mathematics", "Polynomial evaluation", "Polynomial division", "Horner's method", "Moessner's Process"]
categories = ["Moessner's Sieve"]
draft = false
+++

> _"What makes the desert beautiful,"_<br />
> _said the little prince,_<br />
> _“is that somewhere it hides a well..."_<br />
> -- **Antoine de Saint-Expuéry**, [The Little Prince](https://app.thestorygraph.com/books/97ee2a58-fc20-4b49-a578-4ee9189c1c74)


## 1. Introduction {#1-dot-introduction}

The goal of this blog post is to introduce [Horner's method](https://en.wikipedia.org/wiki/Horner%27s_method) for polynomial
evaluation and polynomial division, and subsequently prove an equivalence
relation between these two types of application.

The blog post is structured as follows. In Section [2](#2-dot-polynomial-evaluation-using-horner-s-method), we argue for the
application of Horner's method for polynomial evaluation, and subsequently
derive its definition. Having covered polynomial evaluation, we then argue for
the application of Horner's method for polynomial division and derive its
definition in Section [3](#3-dot-polynomial-division-using-horner-s-method). Lastly, we state and prove an equivalence relation
between the definition of polynomial evaluation and the definition of polynomial
division using Horner's method in Section [4](#4-dot-equivalence-of-the-two-horner-procedures). The blog post is concluded in
Section [5](#5-dot-conclusion).


## 2. Polynomial evaluation using Horner's method {#2-dot-polynomial-evaluation-using-horner-s-method}

In order to understand the advantages of using Horner's method for evaluating a
polynomial, we first examine how this is usually done. If we let \\(p(x) = 7x^4 +
2x^3 + 5x^2 + 4x + 6\\) and \\(x = 3\\), then we would evaluate \\(p(3)\\) one term at a
time and sum all the intermediate results. However, by doing so we are
unfortunately performing redundant operations when evaluating the exponents, as
can be seen when we unfold the evaluation of the exponents,

\begin{align\*}
  p(3) &= 7 \cdot (3^4) + 2 \cdot (3^3) + 5 \cdot (3^2) + 4 \cdot (3) + 6 \\\\
       &= 7 \cdot (3 \cdot 3 \cdot 3 \cdot 3) + 2 \cdot (3 \cdot 3 \cdot 3) + 5 \cdot (3 \cdot 3) + 4 \cdot (3) + 6.
\end{align\*}

Here, the evaluation of the largest exponent, \\(3^4 = (3 \cdot 3 \cdot 3 \cdot 3)\\), also
calculates all exponents of a lesser degree, i.e., \\(3^3 = (3 \cdot 3 \cdot 3)\\) and \\(3^2
= (3 \cdot 3)\\), as its intermediate results. Luckily, we can transform the formula
of the polynomial \\(p\\) in such a way that the operations calculating the
exponents are shared across the terms. In fact, since the number of
multiplications by \\(3\\) decreases by \\(1\\) for each term, we can nest the
multiplications across the terms like so,

\begin{align}
  \tag{1}\label{eq:polynomial-evaluation-horner-example-formula}
  p(3) &= 7 \cdot (3 \cdot 3 \cdot 3 \cdot 3) + 2 \cdot (3 \cdot 3 \cdot 3) + 5 \cdot (3 \cdot 3) + 4 \cdot (3) + 6 \\\\
  p(3) &= (7 \cdot (3 \cdot 3 \cdot 3) + 2 \cdot (3 \cdot 3) + 5 \cdot (3) + 4) \cdot 3 + 6 \\\\
  p(3) &= ((7 \cdot (3 \cdot 3) + 2 \cdot (3) + 5) \cdot 3 + 4) \cdot 3 + 6 \\\\
  p(3) &= (((7 \cdot 3 + 2) \cdot 3 + 5) \cdot 3 + 4) \cdot 3 + 6,
\end{align}

thus removing any redundant multiplications used for evaluating the exponents.
Formula \ref{eq:polynomial-evaluation-horner-example-formula} now exhibits a
simple inductive structure which adds one multiplication and one addition for
each term in the polynomial \\(p\\). As a result, we can now evaluate the final
formula of \\(p\\),

\begin{equation}
  \tag{2}\label{eq:polynomial-evaluation-horner-example-inductive}
  p(3) = (((7 \cdot 3 + 2) \cdot 3 + 5) \cdot 3 + 4) \cdot 3 + 6,
\end{equation}

by repeatedly performing a multiplication and an addition, starting from the
innermost set of parentheses,

\begin{align}
  \tag{3}\label{eq:polynomial-evaluation-horner-example-calculation}
  p(3) &= (((7 \cdot 3 + 2) \cdot 3 + 5) \cdot 3 + 4) \cdot 3 + 6 \\\\
  &= ((23 \cdot 3 + 5) \cdot 3 + 4) \cdot 3 + 6 \\\\
  &= (74 \cdot 3 + 4) \cdot 3 + 6 \\\\
  &= 226 \cdot 3 + 6 \\\\
  &= 684.
\end{align}

If we compare the number of operations performed in the first and last equation
of Formula \ref{eq:polynomial-evaluation-horner-example-formula}, we count a
total of \\(14\\) in the former and \\(8\\) in the latter. The difference of \\(6\\)
operations corresponds exactly to the number of multiplications required to
evaluate the exponents in the first equation. Thus, our transformation of the
polynomial formula into its inductive form, has removed the computational
overhead of evaluating each of the exponents in sequence. Lastly, it has even
been proved that the number of additions and multiplications used in this
procedure, are indeed the smallest number possible for evaluating a
polynomial.[^fn:1]

Upon closer examination of the intermediate results of Formula
\ref{eq:polynomial-evaluation-horner-example-calculation}, we can make out a
recursive substitution scheme happening under the hood,

\begin{align}
  \tag{4}\label{eq:polynomial-evaluation-horner-example-substitution-numbers}
  7 &= 7\\\\
  23 &= 7 \cdot 3 + 2\\\\
  74 &= 23 \cdot 3 + 5\\\\
  226 &= 74 \cdot 3 + 4\\\\
  684 &= 226 \cdot 3 + 6.
\end{align}

where each intermediate result is the result of multiplying the previous result
by \\(3\\) and adding the next coefficient. If we assign the intermediate values on
the left-hand side, \\((7, 23, 74, 226, 684)\\), to the variable \\(b\_i\\), assign the
value \\(3\\) to the variable \\(k\\), and lastly assign the values corresponding to the
coefficients of \\(p\\), \\((7, 2, 5, 4, 6)\\), to the variable \\(a\_i\\), we can restate
Formula \ref{eq:polynomial-evaluation-horner-example-substitution-numbers} like
so,

\begin{align}
  \tag{5}\label{eq:polynomial-evaluation-horner-example-substitution-variables}
  b\_4 &= a\_4\\\\
  b\_3 &= b\_4 \cdot k + a\_3\\\\
  b\_2 &= b\_3 \cdot k + a\_2\\\\
  b\_1 &= b\_2 \cdot k + a\_1\\\\
  b\_0 &= b\_1 \cdot k + a\_0.
\end{align}

Formula \ref{eq:polynomial-evaluation-horner-example-substitution-variables} now
reflects a recursively structured, and easily generalizable, substitution
procedure where \\(b\_4 = a\_4\\) is the base case, and the inductive case is defined
in terms of the next coefficient in the polynomial and the preceding
intermediate result, \\(b\_3 = b\_4 \cdot k + a\_3\\). The procedure terminates when it
reaches the last term of the polynomial \\(p\\), where \\(b\_0 = b\_1 \cdot k + a\_0\\) is the
result of evaluating \\(p(k)\\).

We call the above procedure Horner's method[^fn:2] for polynomial evaluation, and
formalize it in [Haskell](https://en.wikipedia.org/wiki/Haskell_(programming_language)) by first representing a polynomial as a list of
integers,

```haskell
type Polynomial = [Int]
```

for which we define the procedure,

```haskell
hornersPolyEvalAcc :: Polynomial -> Int -> Int -> Int
hornersPolyEvalAcc cs x a = case cs of
  [] -> a
  (c:cs') -> let a' = c + x * a
             in hornersPolyEvalAcc cs' x a'
```

which takes a polynomial, `cs`, corresponding to \\(a\_i\\), an integer, `x`,
corresponding to \\(k\\), and an accumulator, `a`, corresponding to the intermediate
result \\(b\_i\\). As described above, it returns the final value of the accumulator
(result), `a`, in the base case, and multiplies `a` by `x` for each recursive
call and adds the coefficient `c`. Lastly, we define a wrapper procedure,

```haskell
hornersPolyEval :: Polynomial -> Int -> Int
hornersPolyEval cs x = hornersPolyEvalAcc cs x 0
```

which initializes the accumulator to `0`. As a result, we now can evaluate the
example polynomial of Formula
\ref{eq:polynomial-evaluation-horner-example-inductive},

\begin{equation\*}
  7x^4 + 2x^3 + 5x^2 + 4x + 6,
\end{equation\*}

for \\(x = 3\\), by passing the coefficients of \\(p\\) as the list `[7, 2, 5, 4, 6]`,
along with the value of \\(x\\), `3`, to `hornersPolyEval` like so, `hornersPolyEval
[7, 2, 5, 4, 6] 3`, giving the expected result, `684`.

Having formalized Horner's method for polynomial evaluation, as the procedures
`hornersPolyEvalAcc` and `hornersPolyEval`, we now define Horner's method for
polynomial division.


## 3. Polynomial division using Horner's method {#3-dot-polynomial-division-using-horner-s-method}

Now that we have used Horner's method as an efficient procedure for evaluating a
polynomial, using a recursive substitution scheme, we move on to examine its use
for polynomial division.

According to the definition of [polynomial division](https://en.wikipedia.org/wiki/Polynomial_division), when dividing two
polynomials, \\(p\\) and \\(d\\), \\(\frac{p(x)}{d(x)}\\), where \\(d \not= 0\\), the result is a
quotient, \\(q\\), and a remainder, \\(r\\), satisfying the relation,

\begin{equation}
  \tag{6}\label{eq:poly-div-relation}
  p(x) = d(x) \cdot q(x) + r(x),
\end{equation}

where \\(r\\) has a degree less than \\(d\\). In this blog post, we restrict ourselves
to division with a [binomial](https://en.wikipedia.org/wiki/Binomial), \\(x - k\\), which means that \\(r\\) is always a constant,
and \\(0\\) in the case where \\(d\\) divides \\(p\\).

One procedure for polynomial division is [polynomial long division](https://en.wikipedia.org/wiki/Polynomial_long_division), which we can
use to divide the polynomial \\(p(x) = 2x^3 + 4x^2 + 11x + 3\\) with the binomial
\\(d(x) = x - 2\\), giving us the following result,[^fn:3]

\begin{equation}
  \begin{array}{ c c c c c c c c c }
         &   &      &   & 2x^2 & + &  8x & + & 27 \\\\
  \hline
  x - 2) &   & 2x^3 & + & 4x^2 & + & 11x & + &  3 \\\\
         & - & 2x^3 & + & 4x^2 &   &     &   &    \\\\
  %\hline
         &   &      &   & 8x^2 & + & 11x &   &    \\\\
         &   &      & - & 8x^2 & + & 16x &   &    \\\\
  %\hline
         &   &      &   &      &   & 27x & + &  3 \\\\
         &   &      &   &      & - & 27x & + & 54 \\\\
  %\hline
         &   &      &   &      &   &     &   & 57
  \end{array}
\end{equation}

where we can read the quotient, \\(2x^2 + 8x + 27\\), from the line above the
numerator, \\(2x^3 + 4x^2 + 11x + 3\\), and we can read the remainder, \\(57\\), from
the value at the bottom of the calculation. Lastly, we can verify the
calculations by checking that the relation in Formula \ref{eq:poly-div-relation}
is satisfied,

\begin{equation\*}
  2x^3 + 4x^2 + 11x + 3 = (x - 2)(2x^2 + 8x + 27) + 57.
\end{equation\*}

If we examine the intermediate results of the procedure, \\((2, 8, 27, 57)\\), i.e.,
the leftmost values of each step of the procedure, we can make out a similar
recursive substitution scheme to what we saw in the case of polynomial
evaluation,

\begin{align\*}
  2 &= 2\\\\
  8 &= 2 \cdot 2 + 4\\\\
  27 &= 8 \cdot 2 + 11\\\\
  57 &= 27 \cdot 2 + 3.
\end{align\*}

where each intermediate result is equal to the previous result multiplied by the
second term of the denominator, \\(x - 2\\), plus the next coefficient. This time,
we assign the intermediate results on the left to the variable \\(b\_{i-1}\\), the last
result to the variable \\(r\\), the second term of the denominator to the variable
\\(k\\), and the coefficients of \\(p\\) to the variable \\(a\_i\\), which yields the
following set of equations,

\begin{align\*}
  b\_{2} &= a\_3\\\\
  b\_{1} &= b\_2 \cdot k + a\_2\\\\
  b\_{0} &= b\_1 \cdot k + a\_1\\\\
  r &= b\_0 \cdot k + a\_0.
\end{align\*}

These equations strongly suggest that we can divide \\(p\\) with \\(d\\) using the same
recursive substitution procedure, as described in the evaluation case, spending
just one addition and multiplication per term, which again reduces the number of
operations to a minimum. Furthermore, we can put the substitution scheme above
in a tabular format, similar to polynomial long division,

\begin{equation}
  \tag{7}\label{eq:horner-div-abstract}
  \begin{array}{ c | c c c c }
       &  a\_3 &           a\_2 &           a\_1 &     a\_0 \\\\
    k  &      &       b\_2 \cdot k &      b\_1 \cdot k  & b\_0 \cdot k \\\\
       \hline
       &  a\_3 & b\_2 \cdot k + a\_2 & b\_1 \cdot k + a\_1 & b\_0 \cdot k + a\_0 \\\\
       & =b\_2 &          =b\_1 &          =b\_0 &     =r
  \end{array}
\end{equation}

where the coefficients of the polynomial are located at the top row, the second
term of the denominator to the far left, and the coefficients of the resulting
quotient, \\(b\_2, b\_1, b\_0\\), and the remainder, \\(r\\), at the bottom row of the table.

We formalize the tabular representation in Formula \ref{eq:horner-div-abstract}
as the following procedure,

```haskell
hornersPolyDivAcc :: Polynomial -> Int -> Int -> Polynomial
hornersPolyDivAcc cs x a = case cs of
  [] -> []
  (c:cs') -> let a' = c + x * a
              in a' : (hornersPolyDivAcc cs' x a')
```

which performs the exact same substitution scheme as in `hornersPolyEvalAcc`,
except that it also aggregates the intermediate results and adds them to the
result polynomial. Likewise, we define a wrapper function,

```haskell
hornersPolyDiv :: Polynomial -> Int -> Polynomial
hornersPolyDiv cs x = case cs of
  [] -> []
  (c:cs') -> c : (hornersPolyDivAcc cs' x c)
```

which sets the initial accumulator to the first coefficient and adds it to the
result polynomial. Now, if we wanted to divide our initial polynomial \\(p(x) =
2x^3 + 4x^2 + 11x + 3\\) with the binomial \\(d(x) = x - 2\\), we would pass the list
`[2, 4, 11, 3]` as the input polynomial `cs` and `2` as the input value `x` to
`hornersPolyDiv`, from which we would get the result list `[2, 8, 27, 57]`,
where `[2, 8, 27]` are the coefficients of the quotient and `57` is the
remainder. Thus, we have now defined Horner's method for polynomial division as
the procedures `hornersPolyDivAcc` and `hornersPolyDiv`.


## 4. Equivalence of the two Horner procedures {#4-dot-equivalence-of-the-two-horner-procedures}

Due to the strong similarity between the procedure for polynomial evaluation and
the procedure for polynomial division, we are interested in stating an
equivalence relation between the two. As such, we note that the last element in
the result polynomial of `hornersPolyDiv` is equal to the result of
`hornersPolyEval` when given the same input,

```coq
forall (cs : Polynomial) (x : Int),
  hornersPolyEval cs x == last $ hornersPolyDiv cs x
```

Proving the relation requires us to first prove a similar equivalence relation
between the underlying procedures `hornersPolyEvalAcc` and `hornersPolyDivAcc`,
parameterized over the accumulator,

```coq
forall (cs' : Polynomial) (c x a : Int),
  hornersPolyEvalAcc (c:cs') x a ==
  let a' = c + x * a
  in last $ hornersPolyDivAcc cs' x a'
```

The equivalence can be proved by first proving the underlying theorem, using
structural induction on the polynomial, `cs'`, followed by case analysis on the
polynomial, `cs`, in the original theorem.[^fn:4] Incidentally, the above theorem
also proves an implementation-specific version of the [polynomial remainder
theorem](https://en.wikipedia.org/wiki/Polynomial_remainder_theorem).


## 5. Conclusion {#5-dot-conclusion}

In this post, we have introduced Horner's method for polynomial evaluation and
polynomial division. Furthermore, we have also stated and proved an equivalence
relation between the definition of Horner's method for polynomial evaluation and
polynomial division.

In our [next post](/categories/moessners-sieve/obtaining-taylor-polynomials-with-horners-method), we show how we can obtain [Taylor polynomials](https://en.wikipedia.org/wiki/Taylor%27s_theorem) using Horner's
method.

[^fn:1]: See "On Two Problems in Abstract Algebra Connected with Horner's
    Rule" (1954) by Alexander Markowich Ostrowski and "Methods of computing
    values of polynomials" (1966) by Victor Ya Pan.
[^fn:2]: See "A new method of solving numerical equations of all orders,
    by continuous approximation" (1819) by William G. Horner.
[^fn:3]: Unfortunately, [MathJax](<https://www.mathjax.org/>) does not
    support partial horizontal lines (`\cline`) and thus we cannot
    format polynomial long division in the traditional way.
[^fn:4]: While we do not show each step of the proof in this post, a Coq
    implementation of Horner's method and accompanying equivalence proof can be
    found in my [Master's thesis](https://github.com/dragonwasrobot/formal-moessner).
