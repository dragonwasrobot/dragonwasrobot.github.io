---
layout: post
title: "Equivalence proof of interpretation<br/>and compilation followed by execution"
category: mathematics
description: "In this post, we prove equivalence between interpretation and
compilation of code."
tags: [Coq, Programming Languages, Interpreters, Compilers, Virtual Machines]
---

#### prerequisites: The post "[An interpreter, a compiler and a virtual machine](/programming/2015/09/26/an-interpreter-a-compiler-and-a-virtual-machine)"

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

{% gist dragonwasrobot/32e6a508235ceee7ac5f function_signatures.v %}

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

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_example.v %}

where both expressions found in the body of the `let` expression evaluate to the
same result, `11 : nat`. If we turn the above `let` expression into a theorem,
we get the following candidate:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equality_of_interpret_and_compile_candidate.v %}

However, since we just established earlier that the state of the `data_stack`
was not important, we can actually generalize the equivalence relation to hold
for all possible stacks, and not just the empty stack. This gives us the
following revised version of the theorem:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equality_of_interpret_and_compile_statement.v %}

which perfectly captures the equivalence relation between interpretation and
compilation we were after.

Having derived our equivalence relation, we are ready to move on to proving the
relation.

### 3. Equivalence proof

Just as in the
[introductory post on the Coq Proof Assistant](/mathematics/2015/05/18/a-primer-on-the-coq-proof-assistant),
we start our proof by writing the `Proof` keyword, which gives us the following
goal:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_1.v %}

corresponding to the statement of the final theorem in the previous section.

Since the objective of our proof is to show that interpretation and compilation
yields the same result for all possible arithmetic expressions, we suspect that
doing [structural induction](http://en.wikipedia.org/wiki/Structural_induction)
on the arithmetic expression, `e`, would be a fruitful approach for getting
there. With this approach, we first introduce the arithmetic expression `e` and
then use induction on its structure,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_2.v %}

which gives us three subgoals:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_3.v %}

one for each of the constructors of the `arithmetic_expression` type. Starting
with the case of the literal expression, `Lit`:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_4.v %}

Here, we note that both interpretation and compilation of a `Lit` expression
involves no recursive calls and therefore we can just unfold the definitions
present in both expressions:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_5.v %}

and obtain the goal `n :: s = n :: s` which we can prove with `reflexivity`.

When we look at the next subgoal:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_6.v %}

things become a bit more challenging as our arithmetic expression, `(Plus e1'
e2')`, now has two sub expressions, `e1` and `e2`, which means we have to bring
our goal in a position where we can use the two induction hypotheses, `IH_e1'`
and `IH_e2'`. If we repeat the steps of the previous proof and try to unfold the
definitions at hand:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_7.v %}

we arrive at the following goal:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_8.v %}

However, now we are not able to do anymore unfolding - we do not known how to
unfold `execute_bytecode_program` when given a concatenated list - so we have to
somehow restate the right-hand side of the equation,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_9.v %}

such that we can use our induction hypotheses on it.

### 4. Lists and bytecode programs

If we look at the last statement of the previous section, it says something
about the execution of several concatenated bytecode programs, `compile e2'`,
`compile e1'` and `ADD :: nil`. Since we know that executing a bytecode
program, with respect to a stack, results in a new stack, which again can be
used to execute a new bytecode program, we propose the following statement:

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_statement.v %}

which states that executing the concatenation of two bytecode program, `p1` and
`p2`, on an initial stack, `s`, is equivalent to executing the first bytecode
program, `p1`, on the initial stack, `s`, and then executing the second bytecode
program, `p2`, on the resulting stack of the previous execution.

For this proof, we use structural induction on the first bytecode program, `p1`,
consisting of a list of bytecode instructions, which means we first have to
prove that the statement holds for the empty program, `nil`, and then for all
non-empty programs, `bci :: bcis'`:

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_proof_step_1.v %}

In the case of the empty program, `nil`, the proof is trivial and follows from
unfolding the definitions of the statement:

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_proof_step_2.v %}

For the inductive case, `bci :: bcis'`, we start by introducing the other
bytecode program, `p2`, and the stack, `s`:

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_proof_step_3.v %}

which gives us the following goal:

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_proof_step_4.v %}

Here, we would like to unfold `execute_bytecode_program` on the left-hand side
of the equation, but in order to do so we need to grab the following lemma from
the Coq library:

{% gist dragonwasrobot/32e6a508235ceee7ac5f app_comm_cons.v %}

which allows us to shift the inner parentheses in expression on the left-hand
side of the equality, `((bci' :: bcis') ++ p2)`,

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_proof_step_5.v %}

such that we can unfold `execute_bytecode_program` and apply the induction
hypothesis, `IH_bcis'`:

{% gist dragonwasrobot/32e6a508235ceee7ac5f bytecode_assoc_proof_step_6.v %}

at which point we can apply `reflexivity` to finish the proof, as both sides of
the equality have the exact same value.

The complete proof of `execute_bytecode_program_is_associative` ends up looking
like so:

{% gist dragonwasrobot/32e6a508235ceee7ac5f execute_bytecode_program_is_associative.v %}

At which point we are now ready to return to the proof of the original
equivalence relation.

### 5. Equivalence proof, continued

Having proved `execute_bytecode_program_is_associative`, we return to the `Plus
e1' e2'` case of `equality_of_interpret_and_compile`,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_10.v %}

where we can now use `execute_bytecode_program_is_associative` to rewrite the
bytecode program expression from a concatenated list to a nested structure,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_11.v %}

giving us the following goal:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_12.v %}

Now, we are able to rewrite the `execute_bytecode_program` expression with both
of our induction hypotheses,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_13.v %}

resulting in the following equality,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_14.v %}

which is again proved with `reflexivity`.

The proof of the last subgoal,

{% gist dragonwasrobot/32e6a508235ceee7ac5f equivalence_proof_step_15.v %}

is completely identical to the proof of the previous subgoal, except that `Plus`
and `ADD` have been substituted with `Mult` and `MUL`. This brings us to the
final version of the proof for `equality_of_interpret_and_compile`:

{% gist dragonwasrobot/32e6a508235ceee7ac5f equality_of_interpret_and_compile.v %}

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
