---
layout: post
title: "A primer on the Coq Proof Assistant"
categories: mathematics
description: "In this post, we give a short primer on interactive theorem
proving in the Coq Proof Assistant."
tags: [Coq, Case analysis, Induction, Natural numbers, Arithmetic]
---

#### prerequisites: An installation of the Coq Proof Assistant.

*“Beware of bugs in the above code;*<br/>
*I have only proved it correct, not tried it.”*<br/>
-- **Donald Knuth**

### Introduction

In this post, we give a short primer on
[interactive theorem proving](http://en.wikipedia.org/wiki/Proof_assistant) in
the [Coq Proof Assistant](http://en.wikipedia.org/wiki/Coq) (or simply, Coq)
with the guiding example of natural numbers and their basic arithmetic
operators.

Rather than give a theoretical introduction to the
[The Curry-Howard isomorphism](http://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence) and
[Dependent types](http://en.wikipedia.org/wiki/Dependent_type), this post will
have a hands-on approach and focus on writing code and doing proofs. By the end
of this small tutorial we will have done the following:

- Defined a type in Coq corresponding to the natural numbers,
- defined addition and multiplication functions for natural numbers,
  and
- proved basic arithmetic properties about these functions.

### How to define natural numbers in Coq

In order to define an (inductive) type in Coq, we start by writing the
`Inductive` keyword followed by the name of our type, `nat` (as in natural
number), and the keyword `Type`. This tells Coq that we are defining an
inductive type named `nat`. Next, we specify the set of constructors from which
to create a `nat`. Here, we start by specifying the base case, `O : nat`, which
states that `O` is a constructor that takes no arguments and returns a `nat`. In
layman's terms, we are basically saying that zero is a natural number. Then, we
specify the inductive case, `S : nat -> nat`, which states that `S` is a
constructor that takes one argument, a `nat`, and returns a `nat`. Once again,
what we are really saying is that the successor of any natural number is itself
a natural number, which gives us the following definition:

{% highlight coq %}
Inductive nat : Type :=
| O : nat
| S : nat -> nat.
{% endhighlight %}

We can instantiate types like `nat` using the `Compute` keyword followed by the
constructor. For example, if we wanted to create `nat`s corresponding to the
natural numbers 0, 1, and 2, it would look like this:

{% highlight coq %}
Compute O.
Compute (S O).
Compute (S (S O)).
{% endhighlight %}

Notice the nice onion-like structure where we add another layer of `S` for each
time we increment the value of a natural number. As we will see in the next
section, this onion-like structure allows us to write some elegant definitions
of classic operators like `+` and `*`.

### How to define addition and multiplication in Coq

In order to define a (recursive) function in Coq, we start by writing the
`Fixpoint` keyword followed by the name of our function, `plus`, its arguments,
`(n m : nat)`, and its return type, `nat`. Similar to when we were defining the
`nat` type, we are now telling Coq that we want to define a function named
`plus` which takes two natural numbers, `n` and `m`, and returns a natural
number. Next, we add the body of our function which in this case consists of a
pattern matching, `match n with ... end`, on the structure of the first
argument, `n`. If `n` is `O` we return the second argument `m`, otherwise `n`
must be the successor of another natural number `n'`, so we peel a successor
layer off `n` and apply it to the result of adding `n'` and `m`:

{% highlight coq %}
Fixpoint plus (n m : nat) : nat :=
  match n with
    | O => m
    | S n' => S (plus n' m)
  end.
{% endhighlight %}

The intuition behind this recursive function is to take two onion-shaped natural
numbers, peel off one layer of the first number, add it to the second number,
and repeat these two steps until there are no more layers to peel off the first
number at which point we return the second number. Also notice how we do not
have to worry about null checks or similar junk in our pattern matching since
our initial type definition states the only two ways to construct a natural
number: by applying `O` or `S`.

If we want to add two natural numbers, we can use the `Compute` keyword again
like so:

{% highlight coq %}
Compute (plus O (S O)).
(* ==> S O *)
Compute (plus (S (S O)) (S O)).
(* ==> S (S (S O)) *)
Compute (plus (S (S O)) (S (S (S O)))).
(* ==> S (S (S (S (S O))))) *)
{% endhighlight %}

where `(* ... *)` is simply a Coq comment that we use to show the expected
output of our computations.

Besides defining new types and functions, Coq also gives us the ability to
define our own notation, thus we can introduce the traditional infix syntax for
plus, `+`. We do this by writing the `Notation` keyword followed by a string
describing the intended notation, the function call corresponding to the
notation, and a precedence level:

{%highlight coq %}
Notation "x + y" := (plus x y) (at level 50, left associativity).
Compute ((S (S O)) + (S O)). (* ==> S (S (S O)) *)
{% endhighlight %}

While we will not go into that much detail about custom notation, know that it
can be a useful tool when we want to define our own
[domain specific language](http://en.wikipedia.org/wiki/Domain-specific_language)
to better describe a specific mathematical problem or space. As a further
example, Coq provides the convenient notation of
[arabic numerals](http://en.wikipedia.org/wiki/Arabic_numerals), when using the
built-in `nat` type, such that we can write `5` instead of `S (S (S (S (S
O))))`.

To recap: So far we have defined our first recursive function, `plus`, called a
`Fixpoint`, which adds two instances of the `nat` type, by repeatedly peeling
off one successor layer, `S`, from its first argument and applying it to the
result of adding the remainder of the first argument with the second
argument. Furthermore, we have also introduced our own notation so we can use
the traditional infix symbol, `+`, when adding instances of the `nat` type.

Having defined our addition function, `plus`, we can use the exact same approach
to define our multiplication function, `mult`, where the only difference is that
in the result of the inductive case pattern matching, `S n' => m + (mult n' m)`,
we add the second argument `m` (notice the use of `+` rather than `plus`) to the
result, instead of `S`.

{% highlight coq %}
Fixpoint mult (n m : nat) : nat :=
  match n with
    | O => O
    | S n' => m + (mult n' m)
  end.

Compute (mult (S (S O)) O). (* ==> O *)
Compute (mult (S (S O)) (S (S O))). (* ==> S (S (S (S O))) *)

Notation "x * y" := (mult x y) (at level 40, left associativity).
Compute ((S (S O)) * (S (S O))). (* ==> S (S (S (S O))) *)
{% endhighlight %}

Now that we have defined our natural number type, `nat`, and defined two functions
that manipulate natural numbers, `plus` and `mult`, we are ready to start
proving basic properties about these functions.

### How to prove basic properties in Coq

In order to define a proof, we start by writing the keyword `Lemma` followed by
the name of our proof, `plus_O_l`, and its statement, `forall (n : nat), O + n =
n`. If we break down the statement of the proof, then the first part, `forall
(n : nat)`, essentially says that what follows next, `O + n = n`, is true for
all natural numbers (`forall` is a so-called
[quantifier](http://en.wikipedia.org/wiki/Quantifier_(logic))). The second part,
`O + n = n`, simply states that zero plus a natural number is equal to that
natural number:

{% highlight coq %}
Lemma plus_O_l :
  forall (n : nat),
    O + n = n.
{% endhighlight %}

The way we begin to prove our statement is by writing the keyword `Proof` which
gives us the following content in our goal buffer:

{% highlight coq %}
============================
forall n : nat, O + n = n
{% endhighlight %}

which says that we have to prove the conclusion `forall n : nat, O + n = n` (the
stuff below the horizontal rule) and that we currently have no hypotheses (the
stuff above the horizontal rule). Now, if we write `intro n`, we instantiate the
quantifier such that the `forall n : nat` disappears from our conclusion and is
added as a hypothesis:

{% highlight coq %}
n : nat
============================
O + n = n
{% endhighlight %}

allowing us to better manipulate the statement in our conclusion. Having
introduced our natural number `n`, we can apply a so-called unfold proof tactic,
`unfold plus`, which tries to apply `plus` to the arguments in the
conclusion. Since `plus O n` returns `n`, according to the definition of our
`plus` function, we get:

{% highlight coq %}
n : nat
===========================
n = n
{% endhighlight %}

Now that the left- and right-hand side of the equality, `=`, in the conclusion
are exactly the same, we can apply the `reflexivity` proof tactic, which proves
the current conclusion if the left- and right-hand side of an equality are
trivially equivalent. To finish the proof we write the keyword `Qed`, and our
final proof looks like this:

{% highlight coq %}
Proof.
  intro n.
  unfold plus.
  reflexivity.
Qed.
{% endhighlight %}

Thus we have now proved our first lemma. Even better: just like we could
reuse the structure of the definition of `plus`, when defining the `mult`
function, so can we reuse the proof structure of `plus_O_l`, when proving the
equivalent property of mult, `mult_O_l`, which says that for all natural
numbers, zero times a natural number is zero:

{% highlight coq %}
Lemma mult_O_l :
  forall (n : nat),
    O * n = O.
Proof.
  intro n.
  unfold mult.
  reflexivity.
Qed.
{% endhighlight %}

Having proved that zero plus a natural number is equal to that same natural
number, the next logical step is to prove that a natural number plus zero is
also equal to that same natural number:

{% highlight coq %}
Lemma plus_O_r :
  forall (n : nat),
    n + O = n.
{% endhighlight %}

As before, we first `intro n` to remove the `forall` quantifier:

{% highlight coq %}
============================
forall n : nat, n + O = n
{% endhighlight %}

which gives us the intended conclusion `n + O = n`:

{% highlight coq %}
n : nat
============================
n + O = n
{% endhighlight %}

However, now we cannot just unfold `plus` and be done with it. The reason for
this is that in the implementation of `plus` we pattern matched on the first
argument, `n`, and thus cannot trivially infer anything from the definition of
`plus` about what the result is when we let the second argument be `O`. So for
this we will need to use a proof technique known as
[structural induction](http://en.wikipedia.org/wiki/Structural_induction). The
basic idea behind structural induction (on natural numbers) is the following:

- If we can prove that some property, `P`, holds for the base case, `O`, written
  `P O`, and
- we can prove that the property holds for the inductive case, `S n'`, if we
  assume that it already holds `n'`, called the induction hypothesis, written
  `forall (n' : nat), P n' -> P (S n')`,
- then the property holds for all natural numbers, written `forall n : nat, P
  n`.

In practice, we do this with the command `induction n`, which tells Coq to do
induction on the natural number `n`. What happens then is that we get two
subgoals we have to prove: a base case, `O + O = O`, and an inductive case `S
n' + O = S n'`:

{% highlight coq %}
============================
O + O = O

subgoal 2 (ID 19) is:
 S n' + O = S n'
{% endhighlight %}

In order to prove the base case,`O + O = O`, we can again use the definition of
`plus`, as the first argument is `O`, and do `unfold plus` followed by
`reflexivity`, leaving us with the inductive case:

{% highlight coq %}
n' : nat
IH_n' : n' + O = n'
============================
S n' + O = S n'
{% endhighlight %}

Here, we notice a new addition to our hypotheses: the induction hypothesis,
`IH_n': n' + O = n'`, which lets us assume that the property we are trying to
prove already holds for `n'`. But first we have to *massage* our conclusion into
a state where we can use this hypothesis. Once again, if we look at the
definition of `plus`, we actually know what the result of applying `plus` on `S
n'` and some `m` is: `S n' => S (plus n' m)`. Thus, we can again unfold `plus`
giving us:

{% highlight coq %}
n' : nat
IH_n' : n' + O = n'
============================
S (n' + O) = S n'
{% endhighlight %}

Our conclusion now contains the statement `(n' + O)`, corresponding to the
left-hand side of our induction hypothesis, `IH_n'`. This allows us to do a
so-called rewrite from left to right, `rewrite -> IH_n'`, where we substitute
the expression in our conclusion corresponding to the expression found on the
left-hand side of the equality in `IH_n'` with the right-hand side of the
equality in `IH_n'`:

{% highlight coq %}
n' : nat
IH_n' : n' + O = n'
============================
S n' = S n'
{% endhighlight %}

We have now reached a point where the left-hand and right-hand side of the
equality in the conclusion are trivially equivalent. Thus, we can again use
`reflexivity` and our proof, that a natural number plus zero is equal to that
same natural number, is done. The code corresponding to the proof outlined above
looks like so:

{% highlight coq %}
Proof.
  intro n.
  induction n as [ | n' IH_n' ].

  (* case: n = O *)
  unfold plus.
  reflexivity.

  (* case: n = S n' *)
  unfold plus; fold plus.
  rewrite -> IH_n'.
  reflexivity.
Qed.
{% endhighlight %}

with the addition of `as [ | n' IH_n' ]` in the `induction` proof step, which is
some extra syntax used to properly name the natural number and induction
hypothesis used in the inductive case of the proof. Furthermore, we have also
added a few comments, surrounded by `(* ... *)`, to indicate when we reach the
two cases of the proof, and lastly there is also a small twist regarding the
last use of `unfold` which is immediately followed by a `fold` command. Without
going in to too much detail, the use of `unfold/fold` is an idiom relating to
the way Coq tends to unfold a recursive call too eagerly, so we immediately call
`fold` afterwards to get the expression we expected.

Having proved that a natural number plus zero is equal to that same natural
number, we can use the exact same approach to prove that a natural number
multiplied by zero is equal to zero:

{% highlight coq %}
Lemma mult_O_r :
  forall (n : nat),
    n * O = O.
Proof.
  intro n.
  induction n as [ | n' IH_n' ].

  (* case: n = O *)
  unfold mult.
  reflexivity.

  (* case: n = S n' *)
  unfold mult; fold mult.
  rewrite -> plus_O_l.
  rewrite -> IH_n'.
  reflexivity.
Qed.
{% endhighlight %}

The only difference in the proof script for `mult` is the extra proof step
`rewrite -> plus_O_l`, which demonstrates how we can use our already proved
statement, `plus_O_l`, to manipulate the conclusion of a goal in another proof.

### Conclusion

In this post, I have given a primer on interactive theorem proving in the Coq
Proof Assistant with the guiding example of natural numbers and their basic
arithmetic operators. For further reading, I recommend the book
[Software Foundations](http://www.cis.upenn.edu/~bcpierce/sf/current/index.html)
by Pierce et al. which gives a nice and enjoyable introduction to interactive
theorem proving in Coq.
