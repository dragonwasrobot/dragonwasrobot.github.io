---
layout: post
title: "An interpreter, a compiler<br/> and a virtual machine"
category: programming
description: "In this post, we implement an interpreter, a compiler and a
virtual machine."
tags: [Coq, Languages, Interpreters, Compilers, Virtual Machines]
---

#### prerequisites: Basic experience with Coq or similar

### 1. Introduction

In this post, we show how to implement an
[interpreter](https://en.wikipedia.org/wiki/Interpreter_(computing)) and a
[compiler](https://en.wikipedia.org/wiki/Compiler) for a small arithmetic
language in the [Coq Proof Assistant](http://en.wikipedia.org/wiki/Coq) along
with a [virtual machine](https://en.wikipedia.org/wiki/Virtual_machine) for
running the output of the compiler. We implement the language in Coq such that
we can later prove an equivalence relation between the two evaluation strategies
in a follow-up blog post.

We start by introducing the small arithmetic language in Section [2](#language),
which will be the subject of the rest of this post. Having defined our language,
we introduce an
[interpreter](https://en.wikipeedia.org/wiki/Interpreter_(computing)) in Section
[3](#interpreter) implementing the
[operational semantics](https://en.wikipedia.org/wiki/Operational_semantics) of
the language. Before we introduce the corresponding compiler, we first have to
build a virtual machine in Section [4](#virtual-machine) onto which we can
execute the [bytecode](https://en.wikipedia.org/wiki/Bytecode) output of the
compiler. Finally, we introduce the compiler in Section [5](#compiler) and
conclude in Section [6](#conclusion).

### 2. Language

The first step towards implementing an interpreter is to define the language
which we want to interpret. Thus, we define a small arithmetic language with
which we can perform addition and multiplication. In order to define the
language as a [formal grammar](https://en.wikipedia.org/wiki/Formal_grammar), we
say that a program consists of an expression, `e`, which can either be:

- a literal, `Lit`, that takes a natural number, `n`, or
- an addition expression, `Plus`, that takes two arithmetic expressions, `e`, or
- a multiplication expression, `Mult`, that takes two arithmetic expressions,
  `e`.

The above description yields the following grammar:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 grammar.txt %}

which we in turn can translate into an `Inductive` type in Coq:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 arithmetic_expression.v %}

Here, we state that any instance of the type `arithmetic_expression` is either a
literal, an addition expression, or a multiplication expression, as described
above. Furthermore, we can construct instances of this type by applying the
three constructors of the definition. For example, if we want to create an
`arithmetic_expression` corresponding to the expression $$(2 + 1) \cdot 5$$, we
write the following:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 language_example.v %}

where the keyword `Compute` is simply used to evaluate the expression. Note that
we have not yet computed the result of the expression, as we have not yet
implemented the semantics of the language.

### 3. Interpreter

Having defined our language as an inductive
[algebraic data type](https://en.wikipedia.org/wiki/Algebraic_data_type), we can
now introduce a function that, given an element of this type, recursively
traverses the structure of such an element and returns the result of evaluating
the arithmetic expression corresponding to the element. The semantics of our
arithmetic language are pretty straight forward:

- A literal expression, `Lit n`, evaluates to the natural number, `n`, and
- an addition expression, `Plus e e`, evaluates to the sum of the two
  sub-expressions, `e`, and
- a multiplication expression, `Mult e e`, evaluates to the product of the two
  sub-expressions, `e`.

If we translate the above definitions, we get the following Coq `Fixpoint`:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 interpret.v %}

Here, the `interpret` function pattern matches on the constructor of the
arithmetic expression, `e`, and recursively evaluates its sub-expressions. If we
want to evaluate the expression $$(2 \cdot 2) \cdot (2 + 3)$$, we first
translate it into the `arithmetic_expression` language and then pass it to the
`interpret` function:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 interpret_example.v %}

When evaluated, the above expression yields the result `20 : nat` as expected.

### 4. Virtual machine

Before we can build a compiler for our arithmetic expression language, we first
need a machine onto which we can execute the compiled source code. Thus, we
construct a minimal
[stack machine](https://en.wikipedia.org/wiki/Stack_machine) with the following
three bytecode instructions:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 bytecode_instruction.v %}

From which we define a bytecode program to be a list of byte code instructions:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 bytecode_program.v %}

and lastly we also define the data stack of our virtual machine to be a list of
natural numbers:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 data_stack.v %}

With these three definitions taken care of, we move on to define the semantics
of the three byte code instructions and translate them into a corresponding
function. As such, we define the instruction `PUSH` to take a natural number
which it then pushes onto the stack, while the `ADD` and `MUL` instructions each
pop the two topmost elements of the stack and adds or multiplies them. For the
sake of simplicity, we define the effects of executing `ADD` or `MUL` on a stack
with less than two elements to be an unchanged stack. The above semantics result
in the function `execute_bytecode_instruction`, which takes a
`bytecode_instruction` and a `data_stack` and returns a new `data_stack`,
capturing the effect of evaluation the different types of
`bytecode_instruction`:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 execute_bytecode_instruction.v %}

An example application of `execute_bytecode_instruction` multiplies the two
elements on top of the stack `[5,3,2]`:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 execute_bytecode_example.v %}

and returns the resulting stack `[15,2]`. The last step we need in order to
finish our virtual machine, is to wrap the `execute_bytecode_instruction` in a
function that takes a whole bytecode program and runs it on an initial data
stack, `execute_bytecode_program`:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 execute_bytecode_program.v %}

Here, we perform an initial pattern matching on the structure of the bytecode
program to check that it is not empty.

Now we can execute a whole bytecode program on our virtual stack machine by
calling `execute_bytecode_program` with a `bytecode_program` and a `data_stack`:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 execute_bytecode_program_example.v %}

If we step through the execution of the above program, the major steps are as
follows:

- First we push `2` and `3` onto the empty stack, giving us `(3 :: 2 :: nil)`,
  then
- we pop the two elements and push their result onto the stack, resulting in the
  stack `(5 :: nil)`, again
- we push a `5` onto the stack and multiply the two elements such that we get
  the stack `(25 :: nil)`, lastly
- we push `1` onto the stack, at which point we have run our whole bytecode
  program and return the final stack, `(1 :: 25 :: nil)`.

With the virtual machine defined and tested, we move on to construct our
compiler.

### 5. Compiler

Having introduced the needed set of bytecode instructions and seen how these can
be executed on a virtual stack machine, we are finally ready to define a
compiler that takes our arithmetic expression language as its input and
generates a bytecode program as its output.

Returning to the constructors of our `arithmetic_expression` language, we can
turn each of these into one or more bytecode instructions:

- The literal constructor, `Lit n`, can be directly translated into the act of
   returning the bytecode program consisting of the `PUSH n` instruction, while
- the addition expression, `Plus e1 e2`, corresponds to the result of first
  compiling the second expression, `e2`, followed by concatenating the result of
  compiling the first expression, `e1`, and then concatenating the bytecode
  program consisting of the `ADD` instruction, lastly
- the multiplication expression, `Mult e1 e2`, is identical to the compilation
  of the addition expression except for the use of the `MUL` instruction rather
  than the `ADD` instruction.

This brings us to the following definition of our compiler:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 compile.v %}

which takes an `arithmetic_expression` as its input and produces a
`bytecode_program` as its output. If we want to compile an
`arithmetic_expression` corresponding to $$5 + (3 \cdot 2)$$, we pass it to
`compile` like so:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 compile_example.v %}

which results in the following `bytecode_program` output:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 compile_example_output.v %}

Note that because we are working with a stack machine, the outputted program
both flattens and reverses the compiled expression.

Now that we have finally defined `interpret`, `execute_bytecode_program`, and
`compile`, we can demonstrate the equivalence relation between interpretation
and compilation of the same program:

{% gist dragonwasrobot/d46acd3d1f697c9c0030 equivalence_example.v %}

of which the proof will be the topic of a future blog post.

### 6. Conclusion

In this post, we have shown how to implement an interpreter, a compiler, and a
virtual machine for a small arithmetic language. The language has been
implemented in the Coq Proof Assistant such that we can later proof an
equivalence relation between interpretation of an arithmetic expression and
compilation followed by execution of that same expression.
