---
layout: post
title: "Equivalence proof of interpretation<br/>and compilation followed by execution"
category: mathematics
description: "In this post, we prove equivalence between interpretation and
compilation of code."
tags: [Coq, Programming Languages, Interpreters, Compilers, Virtual Machines]
---

#### prerequisites: The post [An interpreter, a compiler and a virtual machine](/programming/2015/09/26/an-interpreter-a-compiler-and-a-virtual-machine)

### 1. Introduction

In this post, we prove an
[equivalence relation](https://en.wikipedia.org/wiki/Equivalence_relation)
between **interpretation of an arithmetic expression** and **compilation of an
arithmetic expression followed by execution of the bytecode program resulting
from compilation**.

First, we derive the equivalence relation in Section [2](#equivalence-relation),
start the proof in Section [3](#equivalence-proof), take a detour in Section
[4](#lists-and-bytecode-programs), and finish the proof in Section
[5](#equivalence-proof-continued). Finally, we conclude in Section [4](#conclusion).

### 2. Equivalence relation

Before we can prove an equivalence relation between **interpretation of an
arithmetic expression** and **compilation of an arithmetic expression followed
by execution of the compiled bytecode program**, we first have to capture the
nature of this relation. If we look at the signatures of `interpret`, `compile`,
and `execute_bytecode_program`:

{% highlight coq linenos %}
Fixpoint interpret
           (e : arithmetic_expression) : nat := ...
Fixpoint compile
           (e : arithmetic_expression) : bytecode_program := ...
Fixpoint execute_bytecode_program
           (s : data_stack)
           (bcp : bytecode_program) : data_stack := ...
{% endhighlight %}

we note that while `interpret` returns a `nat`, when given an
`arithmetic_expression`, `compile` returns a `bytecode_program`, when given an
`arithmetic_expression`, which we can then pass to `execute_bytecode_program`,
along with a `data_stack`, and finally obtain a `data_stack`.

Given that `interpret` does not use a `data_stack`, or similar, a possible
candidate for an equivalence relation would not depend on the state of the
stack. As such, we would expect that any `arithmetic_expression` given to
`interpret` results in the same value as found at the top of the `data_stack`,
when applying `execute_bytecode_program` on the output of `compile`, when given
the same `arithmetic_expression`. Thus, if we let our example expression be
$$5 + (3 \cdot 2)$$, we can capture the equivalence relation with the following
snippet of code:

{% highlight coq linenos %}
Compute let e := Plus (Lit 5) (Mult (Lit 3) (Lit 2))
        in (interpret e :: nil,
            execute_bytecode_program nil (compile e)).
{% endhighlight %}

where both expressions found in the body of the `let` expression evaluate to the
same result, `11 : nat`. If we turn the above `let` expression into a theorem,
we get the following candidate:

{% highlight coq linenos %}
Theorem equality_of_interpret_and_compile_candidate :
  forall (e : arithmetic_expression),
    (interpret e) :: nil =
    execute_bytecode_program nil (compile e).
{% endhighlight %}

However, since we just established earlier that the state of the `data_stack`
was irrelevant, we can actually generalize the equivalence relation to hold
for all possible stacks, and not just the empty stack. This gives us the
following revised version of the theorem:

{% highlight coq linenos %}
Theorem equality_of_interpret_and_compile :
  forall (e : arithmetic_expression) (s : data_stack),
    (interpret e) :: s =
    execute_bytecode_program s (compile e).
{% endhighlight %}

which perfectly captures the equivalence relation between interpretation and
compilation we were after.

Having derived our equivalence relation, we are ready to move on to proving the
relation.

### 3. Equivalence proof

Just as in the
[introductory post on the Coq Proof Assistant](/mathematics/2015/05/18/a-primer-on-the-coq-proof-assistant),
we start our proof by writing the `Proof` keyword, which gives us the following
goal:

{% highlight coq linenos %}
============================
forall (e : arithmetic_expression) (s : data_stack),
  interpret e :: s = execute_bytecode_program s (compile e)
{% endhighlight %}

corresponding to the statement of the final theorem in the previous section.

Since the objective of our proof is to show that interpretation and compilation
yields the same result for all possible arithmetic expressions, we suspect that
doing [structural induction](http://en.wikipedia.org/wiki/Structural_induction)
on the arithmetic expression, `e`, would be a fruitful approach for getting
there. With this approach, we first introduce the arithmetic expression `e` and
then use induction on its structure,

{% highlight coq linenos %}
intro e.
induction e as [ n |
                 e1' IH_e1' e2' IH_e2' |
                 e1' IH_e1' e2' IH_e2' ].
{% endhighlight %}

which gives us three subgoals:

{% highlight coq linenos %}
n : nat
============================
forall s : data_stack,
  interpret (Lit n) :: s =
  execute_bytecode_program s (compile (Lit n))

subgoal 2 is:
 forall s : data_stack,
 interpret (Plus e1' e2') :: s =
 execute_bytecode_program s (compile (Plus e1' e2'))

subgoal 3 is:
 forall s : data_stack,
 interpret (Mult e1' e2') :: s =
 execute_bytecode_program s (compile (Mult e1' e2'))
{% endhighlight %}

one for each of the constructors of the `arithmetic_expression` type. Starting
with the case of the literal expression, `Lit`:

{% highlight coq linenos %}
n : nat
============================
forall s : data_stack,
  interpret (Lit n) :: s =
  execute_bytecode_program s (compile (Lit n))
{% endhighlight %}

Here, we note that both interpretation and compilation of a `Lit` expression
involves no recursive calls and therefore we can just unfold the definitions
present in both expressions:

{% highlight coq linenos %}
intro s.
unfold interpret.
unfold compile.
unfold execute_bytecode_program.
unfold execute_bytecode_instruction.
{% endhighlight %}

and obtain the goal `n :: s = n :: s` which we can prove with `reflexivity`.

When we look at the next subgoal:

{% highlight coq linenos %}
e1' : arithmetic_expression
e2' : arithmetic_expression
IH_e1' : forall s : data_stack,
         interpret e1' :: s =
         execute_bytecode_program s (compile e1')
IH_e2' : forall s : data_stack,
         interpret e2' :: s =
         execute_bytecode_program s (compile e2')
============================
forall s : data_stack,
  interpret (Plus e1' e2') :: s =
  execute_bytecode_program s (compile (Plus e1' e2'))
{% endhighlight %}

things become a bit more challenging as our arithmetic expression, `(Plus e1'
e2')`, now has two sub expressions, `e1` and `e2`, which means we have to bring
our goal in a position where we can use the two induction hypotheses, `IH_e1'`
and `IH_e2'`. If we repeat the steps of the previous proof and try to unfold the
definitions at hand:

{% highlight coq linenos %}
intro s.
unfold interpret; fold interpret.
unfold compile; fold compile.
{% endhighlight %}

we arrive at the following goal:

{% highlight coq linenos %}
============================
interpret e1' + interpret e2' :: s =
execute_bytecode_program
  s (compile e2' ++ compile e1' ++ ADD :: nil)
{% endhighlight %}

However, now we are not able to do anymore unfolding - we do not known how to
unfold `execute_bytecode_program` when given a concatenated list - so we have to
somehow restate the right-hand side of the equation,

{% highlight coq linenos %}
execute_bytecode_program
  s (compile e2' ++ compile e1' ++ ADD :: nil)
{% endhighlight %}

such that we can use our induction hypotheses on it.

### 4. Lists and bytecode programs

If we look at the last statement of the previous section, it says something
about the execution of several concatenated bytecode programs, `compile e2'`,
`compile e1'` and `ADD :: nil`. Since we know that executing a bytecode
program, with respect to a stack, results in a new stack, which again can be
used to execute a new bytecode program, we propose the following statement:

{% highlight coq linenos %}
Lemma execute_bytecode_program_is_associative :
  forall (p1 p2 : bytecode_program) (s : data_stack),
    execute_bytecode_program s (p1 ++ p2) =
    execute_bytecode_program (execute_bytecode_program s p1) p2.
{% endhighlight %}

which states that executing the concatenation of two bytecode program, `p1` and
`p2`, on an initial stack, `s`, is equivalent to executing the first bytecode
program, `p1`, on the initial stack, `s`, and then executing the second bytecode
program, `p2`, on the resulting stack of the previous execution.

For this proof, we use structural induction on the first bytecode program, `p1`,
consisting of a list of bytecode instructions, which means we first have to
prove that the statement holds for the empty program, `nil`, and then for all
non-empty programs, `bci :: bcis'`:

{% highlight coq linenos %}
intro p1.
induction p1 as [ | bci' bcis' IH_bcis' ].
{% endhighlight %}

In the case of the empty program, `nil`, the proof is trivial and follows from
unfolding the definitions of the statement:

{% highlight coq linenos %}
intros p2 s.
unfold app.
unfold execute_bytecode_program; fold execute_bytecode_program.
reflexivity.
{% endhighlight %}

For the inductive case, `bci :: bcis'`, we start by introducing the other
bytecode program, `p2`, and the stack, `s`:

{% highlight coq linenos %}
intros p2 s.
{% endhighlight %}

which gives us the following goal:

{% highlight coq linenos %}
============================
execute_bytecode_program
  s ((bci' :: bcis') ++ p2) =
execute_bytecode_program
  (execute_bytecode_program s (bci' :: bcis')) p2
{% endhighlight %}

Here, we would like to unfold `execute_bytecode_program` on the left-hand side
of the equation, but in order to do so we need to grab the following lemma from
the Coq library:

{% highlight coq linenos %}
app_comm_cons
  : forall (A : Type) (x y : list A) (a : A),
     a :: x ++ y = (a :: x) ++ y
{% endhighlight %}

which allows us to shift the inner parentheses in expression on the left-hand
side of the equality, `((bci' :: bcis') ++ p2)`,

{% highlight coq linenos %}
rewrite <- app_comm_cons.
{% endhighlight %}

such that we can unfold `execute_bytecode_program` and apply the induction
hypothesis, `IH_bcis'`:

{% highlight coq linenos %}
unfold execute_bytecode_program; fold execute_bytecode_program.
rewrite <- IH_bcis'.
{% endhighlight %}

at which point we can apply `reflexivity` to finish the proof, as both sides of
the equality have the exact same value.

The complete proof of `execute_bytecode_program_is_associative` ends up looking
like so:

{% highlight coq linenos %}
Lemma execute_bytecode_program_is_associative
  : forall (p1 p2 : bytecode_program) (s : data_stack),
    execute_bytecode_program s (p1 ++ p2) =
    execute_bytecode_program (execute_bytecode_program s p1) p2.
Proof.
  intro p1.
  induction p1 as [ | p1' p1s' IH_p1s' ].

  (* case: p1 = nil *)
  intros p2 s.
  unfold app.
  unfold execute_bytecode_program; fold execute_bytecode_program.
  reflexivity.

  (* case: p1 = p1' :: p1s' *)
  intros p2 s.
  rewrite <- app_comm_cons.
  unfold execute_bytecode_program; fold execute_bytecode_program.
  rewrite -> IH_p1s'.
  reflexivity.
Qed.
{% endhighlight %}

At which point we are now ready to return to the proof of the original
equivalence relation.

### 5. Equivalence proof, continued

Having proved `execute_bytecode_program_is_associative`, we return to the `Plus
e1' e2'` case of `equality_of_interpret_and_compile`,

{% highlight coq linenos %}
============================
interpret e1' + interpret e2' :: s =
execute_bytecode_program
  s (compile e2' ++ compile e1' ++ ADD :: nil)
{% endhighlight %}

where we can now use `execute_bytecode_program_is_associative` to rewrite the
bytecode program expression from a concatenated list to a nested structure,

{% highlight coq linenos %}
rewrite ->2 execute_bytecode_program_is_associative.
{% endhighlight %}

giving us the following goal:

{% highlight coq linenos %}
============================
interpret e1' + interpret e2' :: s =
  execute_bytecode_program
    (execute_bytecode_program
      (execute_bytecode_program s (compile e2'))
      (compile e1'))
    (ADD :: nil)
{% endhighlight %}

Now, we are able to rewrite the `execute_bytecode_program` expression with both
of our induction hypotheses,

{% highlight coq linenos %}
rewrite <- IH_e1'.
rewrite <- IH_e2'.
unfold execute_bytecode_program.
unfold execute_bytecode_instruction.
{% endhighlight %}

resulting in the following equality,

{% highlight coq linenos %}
============================
interpret e1' + interpret e2' :: s =
interpret e1' + interpret e2' :: s
{% endhighlight %}

which is again proved with `reflexivity`.

The proof of the last subgoal,

{% highlight coq linenos %}
e1' : arithmetic_expression
e2' : arithmetic_expression
IH_e1' : forall s : data_stack,
         interpret e1' :: s =
         execute_bytecode_program s (compile e1')
IH_e2' : forall s : data_stack,
         interpret e2' :: s =
         execute_bytecode_program s (compile e2')
============================
forall s : data_stack,
interpret (Mult e1' e2') :: s =
execute_bytecode_program s (compile (Mult e1' e2'))
{% endhighlight %}

is completely identical to the proof of the previous subgoal, except that `Plus`
and `ADD` have been substituted with `Mult` and `MUL`. This brings us to the
final version of the proof for `equality_of_interpret_and_compile`:

{% highlight coq linenos %}
Theorem equality_of_interpret_and_compile :
  forall (e : arithmetic_expression) (s : data_stack),
    (interpret e) :: s = execute_bytecode_program s (compile e).
Proof.
  intro e.
  induction e as [ n |
                   e1' IH_e1' e2' IH_e2' |
                   e1' IH_e1' e2' IH_e2' ].

  (* case: e = Lit n *)
  intro s.
  unfold interpret.
  unfold compile.
  unfold execute_bytecode_program.
  unfold execute_bytecode_instruction.
  reflexivity.

  (* case: e = Plus e1' e2' *)
  intro s.
  unfold interpret; fold interpret.
  unfold compile; fold compile.
  rewrite ->2 execute_bytecode_program_is_associative.
  rewrite <- IH_e1'.
  rewrite <- IH_e2'.
  unfold execute_bytecode_program.
  unfold execute_bytecode_instruction.
  reflexivity.

  (* case: e = Mult e1' e2' *)
  intro s.
  unfold interpret; fold interpret.
  unfold compile; fold compile.
  rewrite ->2 execute_bytecode_program_is_associative.
  rewrite <- IH_e1'.
  rewrite <- IH_e2'.
  unfold execute_bytecode_program.
  unfold execute_bytecode_instruction.
  reflexivity.
Qed.
{% endhighlight %}

with which we have now proved an equivalence relation between interpreting an
arithmetic expression and compiling it and then executing it on a virtual
machine.

### 6. Conclusion

In this post, we have proved an equivalence relation between **interpretation of
an arithmetic expression** and **compilation of an arithmetic expression
followed by execution of the bytecode program resulting from compilation**.

With the above result, we have actually proved that we can think of
interpretation as the act of compiling an expression and immediately executing
it on a virtual machine, which is a pretty cool result.
