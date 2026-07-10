+++
title = "Shippers and Theory Builders"
author = ["Peter Urbak"]
date = 2026-06-27T00:00:00Z
tags = ["Software Development"]
categories = ["Musings"]
draft = false
+++

<div class="verse">

_"[...] the tools we are trying to use and the language or notation we are using_<br />
_to express or record our thoughts, are the major factors determining_<br />
_what we can think or express at all!"_<br />
-- **Edsger W. Dijkstra, EWD340 (1972)**<br />

</div>

Over a decade ago, when I was writing my master's thesis in computer science, on
the topic of interactive theorem proving, my adviser shared the following
excerpt from [Gian-Carlo Rota's](https://en.wikipedia.org/wiki/Gian-Carlo_Rota) book **Indiscrete Thoughts (1997)**:

> Mathematicians can be subdivided into two types: problem solvers and theorizers.
> Most mathematicians are a mixture of the two although it is easy to find extreme
> examples of both types.
>
> To the problem solver, the supreme achievement in mathematics is the solution to
> a problem that had been given up as hopeless. It matters little that the
> solution may be clumsy; all that counts is that it should be the first and that
> the proof be correct. Once the problem solver finds the solution, he will
> permanently lose interest in it, and will listen to new and simplified proofs
> with an air of condescension suffused with boredom.
>
> The problem solver is a conservative at heart. For him, mathematics consists of
> a sequence of challenges to be met, an obstacle course of problems. The
> mathematical concepts required to state mathematical problems are tacitly
> assumed to be eternal and immutable.
>
> Mathematical exposition is regarded as an inferior undertaking. New theories are
> viewed with deep suspicion, as intruders who must prove their worth by posing
> challenging problems before they can gain attention. The problem solver resents
> generalizations, especially those that may succeed in trivializing the solution
> of one of his problems.
>
> The problem solver is the role model for budding young mathematicians. When we
> describe to the public the conquests of mathematics, our shining heroes are the
> problem solvers.
>
> To the theorizer, the supreme achievement of mathematics is a theory that sheds
> sudden light on some incomprehensible phenomenon. Success in mathematics does
> not lie in solving problems but in their trivialization. The moment of glory
> comes with the discovery of a new theory that does not solve any of the old
> problems but renders them irrelevant.
>
> The theorizer is a revolutionary at heart. Mathematical concepts received from
> the past are regarded as imperfect instances of more general ones yet to be
> discovered. Mathematical exposition is considered a more difficult undertaking
> than mathematical research.
>
> To the theorizer, the only mathematics that will survive are the definitions.
> Great definitions are what mathematics contributes to the world. Theorems are
> tolerated as a necessary evil since they play a supporting role or rather, as
> the theorizer will reluctantly admit, an essential role in the understanding of
> definitions.
>
> Theorizers often have trouble being recognized by the community of
> mathematicians. Their consolation is the certainty, which may or may not be
> borne out by history, that their theories will survive long after the problems
> of the day have been forgotten.
>
> If I were a space engineer looking for a mathematician to help me send a rocket
> into space, I would choose a problem solver. But if I were looking for a
> mathematician to give a good education to my child, I would unhesitatingly
> prefer a theorizer.

This dichotomy between the problem solver and theorizer archetypes neatly
captured the tension I was experiencing while trying to prove the hypothesis of
my thesis; whether to lean into the automated opaque proof tactics provided by
the theorem prover or slowly build my own intuition about the mathematical
concepts by interrogating their behavior and characteristics. If I leaned too
heavily into proof tactics I might arrive faster at a proved theorem, but I
might miss key insights that would simplify the proof or open up new conjectures
or concepts.

This excerpt has been popping up in my mind recently, when looking at the
current discourse surrounding AI-Assistance in software development, and I
believe it captures an unarticulated aspect of this discourse: the clashing of
archetypes. Given that mathematics and software engineering both involve solving
hard problems and discovering the underlying model, I thought it worth mimicking
Rota's dichotomy in the context of software engineering, using the same elegant
mirrored structure:[^fn:1]

> Software engineers can be subdivided into two types: shippers and theory
> builders. Most engineers are a mixture of the two although it is easy to find
> extreme examples of both types.
>
> To the shipper, the supreme achievement in software is the feature that ships
> against all odds. It matters little that the solution may be a tangle of special
> cases; all that counts is that it ends up in prod and that it works. Once the
> shipper closes the ticket, they will permanently lose interest in the code, and
> will listen to proposals for cleaner rewrites with an air of condescension
> suffused with boredom.
>
> The shipper is a conservative at heart. For them, software consists of a
> sequence of problems to solve, a backlog of features that need to be shipped.
> The tools required to tackle those problems are tacitly assumed to be eternal
> and immutable.
>
> Refactoring is regarded as an inferior undertaking. New paradigms are viewed
> with deep suspicion, as intruders who must prove their worth by solving real
> problems before they can gain attention. The shipper resents abstractions,
> especially those that may succeed in trivializing one of their hard-won fixes.
>
> The shipper is the role model for budding young engineers. When we tell the
> public the conquests of software, our shining heroes are the ones who shipped.
>
> To the theory builder, the supreme achievement of software is a design that
> sheds sudden light on a domain everyone thought was hopelessly tangled. Success
> does not lie in solving problems but in generalizing categories of them. The
> moment of glory comes with a model that solves none of the old bugs but renders
> them unrepresentable.
>
> The theory builder is a revolutionary at heart. The abstractions inherited from
> the past are regarded as imperfect instances of more general ones yet to be
> discovered. Designing a system is considered a more difficult undertaking than
> building one.
>
> To the theory builder, the only things that will survive are the lines we draw
> through a system. The seams between subsystems and the conceptual model are what
> an engineer contributes to the world. Implementations are tolerated as a
> necessary evil since they play a supporting role or rather, as the theory
> builder will reluctantly admit, an essential role in revealing whether those
> lines were drawn in the right place.
>
> Theory builders often have trouble being recognized by the engineering
> community. Their consolation is the certainty, which may or may not be borne out
> by history, that the structure they uncovered will survive long after the bugs
> of the day have been forgotten.
>
> If I were a startup founder looking for an engineer to get my product out the
> door before the runway ran dry, I would choose a shipper. But if I were looking
> for an engineer to lay the foundation that a thousand others would build upon
> for a decade, I would unhesitatingly prefer a theory builder.

Given that most engineers are a mixture of the two archetypes, the problem
becomes clear when we shift our focus back to the discourse about AI-Assistance:
the driving narrative has become heavily skewed in favor of the shipper while
ignoring the equal importance of the theory builder. This skew is a natural
consequence of the incentives of the AI vendors to reduce software engineering
to the measurable artifacts it produces: lines of code written, features
shipped, tickets closed, etc., as these are the very same artifacts that their
AI agents can automate. Unfortunately, this reductionist view of software
engineering is actively harmful as it ignores the theory produced by the process
itself.

Peter Naur argued in his paper [Programming as Theory Building (1985)](https://pages.cs.wisc.edu/~remzi/Naur.pdf) that a
program is not just its source code, but also the theory of it held in the minds
of the people who built it, a theory that cannot be reconstructed from the
artifact alone. As a consequence, if an engineering team has to take over the
ownership of a codebase where no maintainers are left to hand over the theory of
the codebase, then that codebase is effectively dead and resurrecting it
requires much greater effort compared to taking over a live codebase, and may
sometimes even be an impossible task, as the team has to take on the daunting
task of rebuilding the theory of the system from scratch.

Transferring Naur's insights to the current state of AI-Assistance, we see that
while an agent can produce the _text_ of a program with astonishing speed, it
cannot build, hold, nor transfer the _theory_ of it, as the theory by its very
nature is tacit knowledge. That theory is precisely what the theory builder
contributes, and what we stand to lose when the discourse flattens to a single
archetype. Thus, as pointed out by Naur, we face the real risk of having coding
agents produce codebases that are effectively dead if the human is no longer in
the loop.

These risks have also been raised recently by Margaret-Anne Storey in her paper
[From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in
the Age of AI (2026)](https://arxiv.org/abs/2603.22106), where she coins the terms **Cognitive Debt** and **Intent
Debt**, as counters to the traditional well-established **Tech Debt**. These two
concepts capture the debt that accumulates when developers start losing the
shared understanding of the system, and the debt that accumulates when the goals
and constraints of the system stop being captured and maintained.

With papers like Storey's, we can start to see a silver-lining appear, as these
tools are causing novel introspection to happen in spite of the skewed
discourse, i.e. what types of tacit knowledge do we actually accumulate when
building complex systems, and what happens when we offload certain decisions to
AI-Assistance. Likewise, how these same tools can serve the theory builder is
also being explored, not by generating code, but using it to externalize the
reasoning behind it: probing alternative designs, surfacing implicit tradeoffs,
and making the tacit theory of a system more legible before it is lost.

Reflecting on Dijkstra's observation 50 years later, it now looks more like a
warning than an observation: do we double-down on the skewed view of only
thinking as shippers and let AI tools constrain what we can think and express,
or do we insist on seeking a balance that includes the theory builder as equally
important?

[^fn:1]: I made the slight editorial choice to replace he/him with they/them
    throughout the text.
