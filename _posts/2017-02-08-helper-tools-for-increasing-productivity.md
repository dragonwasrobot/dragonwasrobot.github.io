---
layout: post
title: "Helper tools for increasing productivity"
category: tools-and-techniques
description: "In this post, we go through a set of tools for speeding up trivial
tasks and cut out distractions."
tags: [Productivity]
---

*“Squirrel!”*<br/>
-- **Dug, Up (2009)**

### Introduction

I have recently started investigating ways in which I can improve my
productivity and stay more focused while working. One of the ways in which I
have been trying to accomplish this, is by identifying trivial tasks that can be
sped up, or made redundant, and sources of distraction that can be blocked.

In this blog post, I go through the set of helper tools for macOS I use on a
daily basis to either speed up trivial tasks by providing shortcuts, or cut out
various kinds of distraction.

### Spectacle

[Spectacle](https://www.spectacleapp.com/) is a helper tool that provides
keyboard shortcuts for moving and resizing windows in macOS. Given that macOS is
notoriously bad at rearranging and maximizing windows, this is a much needed
tool that reduces these issues to simple keystrokes.

### Jitouch

[Jitouch](http://www.jitouch.com/) is a helper tool that expands the set of
multi-touch gestures for the magic trackpad on MacBooks. I have used the tool to
make browsing the web easier using just the trackpad by using gestures for
navigating between tabs, closing tabs and opening links in new tabs. I have also
used its gestures for maximizing windows or filling either the left- or
right-hand side of the display. Jitouch also provides gestures for opening
custom applications, but this I prefer to do
using Alfred.

### Alfred

[Alfred](https://www.alfredapp.com/) is an alternative to the
built-in [Spotlight](https://en.wikipedia.org/wiki/Spotlight_(software)) search
tool. It makes it even easier to find files on your machine, open applications,
run macOS commands, among other features. It also offers a paid 'powerpack'
which allows you to script custom workflows for further productivity boosts,
though I have not tried out this feature yet.

### f.lux

[f.lux](https://justgetflux.com/) is an app that solves a simple but important
problem: reducing the eye strain and negative impact on your sleep cycle caused
by the blue light emitted from your screen. The f.lux app does this by slowly
changing the color temperature of your screen during the day in accordance with
the [circadian rhytm](https://en.wikipedia.org/wiki/Circadian_rhythm) of humans.
Be aware that when you initially start using it, the colors can seem very
orange, but you eyes adjust to this quite fast. You can also choose different
preferences, e.g. I use a scheme called *classic f.lux* which does not become
quite as warm during the late evenings as *recommended colors*.

### Bartender

[Bartender](https://www.macbartender.com/) is a helper tool that lets you
organize the menu bar icons by hiding or rearranging them according to your
tastes. Furthermore, it also adds keyboard shortcuts and allows you to choose
whether the app icons should appear when the underlying application experiences
some updated state. I have personally only used the app to hide all the noise in
the menu bar, such that by default it only shows the date and time along with
the bartender icon, which is used for showing/hiding all the other menu bar
icons.

### Fohkuhs

[Fohkuhs](http://www.fohkuhs.com/) is
a [Pomodoro timer](https://en.wikipedia.org/wiki/Pomodoro_Technique) app, which
helps you divide your work into a set of intervals with fixed a time span
interrupted by short breaks. The Fohkuhs app is simple to use and allows you to
customize more or less all the different aspects of doing Pomodoros,
e.g. Pomodoro time, break time, daily Pomodoro goal etc. While there is a ton of
these timers out there, I ended up with this one as it displays a giant splash
screen when each Pomodoro ends, and you need to take a break. Others I have
tried only played a gong sound between Pomodoros which was too easy to ignore
and keep working, while the splash screen requires you to actually interact with
the screen in order to remove it, if you do not want to take the scheduled
break.

### get-shit-done

[get-shit-done](https://github.com/dragonwasrobot/get-shit-done) is a script I
have written myself -- adapted from
existing [similar scripts](https://gitlab.esy.fun/yogsototh/get-shit-done) --
that restricts access to a customized list of distracting websites, by
blacklisting them while in *work*-mode and whitelisting them while in
*play*-mode. Compared to other `get-shit-done` scripts, I have added the extra
feature of being able to set an optional timeout for a given mode, after which
is returns to its previous mode. For example, if you are finishing a Pomodoro
and want to make sure that you can only access your custom list of distracting
websites during the Pomodoro break, you can invoke the `get-shit-done` script
with the span of the given break, e.g. `get-shit-done play 30m` which then
blacklists your list of websites again after the 30 minutes has passed.

### Conclusion

In this blog post I gone through the set of helper tools I use on a daily basis
to speed up trivial tasks and cut out distractions.
