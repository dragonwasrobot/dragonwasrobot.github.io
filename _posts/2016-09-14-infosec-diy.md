---
layout: post
title: "InfoSec DIY"
category: infosec
description: "In this post, we discuss a selection of tools and actions to
improve your privacy."
tags: [Privacy, InfoSec]
---

> Disclaimer: I'm not an
> [InfoSec (information security)](https://en.wikipedia.org/wiki/Information_security)
> person by trade, so this is just a personal compilation of entry-level DIY
> InfoSec "home improvements" I've done in order to protect my data and minimize
> the amount of data I share with third parties.

*If you are not paying for it,*<br/>
*you're not the customer;*<br/>
*you're the product being sold.*<br/>
-- Andrew Lewis

### Introduction

I recently went to an event in which the speaker talked about the data we each
share with Facebook and what characteristics Facebook infers about us. However,
as the discussion opened up, a lot of wider questions about ad blocking,
malware, encrypted instant messaging, etc. started popping up. As I happened to
be one of the few tech people at the event, I ended up answering a fair share of
these diverse InfoSec related questions - as best as I could.

After the event, it really dawned on me that a lot of non-tech people are just
as concerned with the integrity of their data and the privacy of their
communications, but have a hard time finding an entry point into the complex
world of InfoSec. So, in order to do my small part in improving the state of
personal online privacy and security, here is a quick overview (or checklist) of
the steps I've taken myself to do just that.

### Concepts

Before we dive into *how* we can improve our privacy and security, we first have
to define a few concepts related to these topics in order to reduce the amount
of potential confusion:

- **Backup**: a [backup](https://en.wikipedia.org/wiki/Backup), or the process
  of backing up, refers to the copying and archiving of computer data so it may
  be used to restore the original after a data loss event.

- **Encryption**: [encryption](https://en.wikipedia.org/wiki/Encryption) is the
  process of encoding messages or information in such a way that only authorized
  parties can access it.

- **Data breach**: a [data breach](https://en.wikipedia.org/wiki/Data_breach) is
  the intentional or unintentional release of secure or private/confidential
  information to an untrusted environment.

- **Malware**: short for
  [malicious software](https://en.wikipedia.org/wiki/Malware), is any software
  used to disrupt computer or mobile operations, gather sensitive information,
  gain access to private computer systems, or display unwanted advertising.

- **Phishing**: [Phishing](https://en.wikipedia.org/wiki/Phishing) is the
  attempt to obtain sensitive information such as usernames, passwords, and
  credit card details (and, indirectly, money), often for malicious reasons, by
  disguising as a trustworthy entity in an electronic communication.

- **Two-factor authentication**:
  [Two-factor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication)
  (also known as 2FA) is a method of confirming a user's claimed identity by
  utilizing a combination of two different components.

- **Password manager**: A
  [password manager](https://en.wikipedia.org/wiki/Password_manager) is an app
  that helps a user store and organize passwords. Password managers usually
  store passwords encrypted, requiring the user to create a master password: a
  single, ideally very strong password which grants the user access to their
  entire password database.

- **VPN**: A [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) or
  *virtual private network* extends a private network across a public network,
  and enables users to send and receive data across shared or public networks as
  if their computing devices were directly connected to the private network.

With these concepts defined, we are ready to go through different steps we can
take to improve our privacy and security.

### Two-factor authentication

Two-factor authentication works by requiring you to supply a second piece of
information when logging in to a website, e.g. besides entering your password
for the given website, you may also have to enter a one-time code sent to your
smart phone - usually via SMS or via an Authenticator app that you install on
your phone.

By enabling two-factor authentication it becomes harder for a hacker to gain
access to your data on a particular website, e.g. using a phising attack, as
they not only need to know your password but they also have to gain physical
access to the device you use for the second authentication step, e.g. your smart
phone.

Two-factor authentication is available for many common services like Facebook,
Twitter, Github, Google, and what else the kids use these days.

### Hard drive encryption

On macOS, turn on FileVault found in `System preferences -> Security & Privacy
-> FileVault`. This essentially encrypts all your data on your hard drive and
requires your user password to decrypt, which happens automatically behind the
scenes when you log in.

I presume that there also exists tools for Windows and Linux to do this, but I
am unfamiliar with them and thus will not recommend anything here.

### Backup

You can backup your data in several ways, here we make the distinction between
local and remote backup.

#### Local backup

It can be a good idea to keep a local physical backup of your data in case your
machine gets stolen, gets damaged beyond repair, or if you are the victim of
[ransomware](https://en.wikipedia.org/wiki/Ransomware).

One way is to find an old SD card or USB stick and then use a disk utility tool,
on macOS go to `Applications -> Utilities -> Disk Utility`, to reformat the SD
card with a file system format that encrypts the content of the card/stick, such
that a password is needed in order to read the content of the card/stick.

**Note: Always remember to choose a sufficiently strong password, i.e. something
that mixes lower- and uppercase letters, numbers and special characters and has
a good length; in these days 12 characters seems to be a minimum length.**

#### Remote backup

Besides the occasional local backup, it is convenient these days to use a remote
backup/storage service as Dropbox or Google Drive which keeps your files in sync
and backed up in the cloud. Unfortunately, there are a few issues with many of
these *cloud storage providers*:

1. While your data is encrypted in the storage provider's *cloud*, they often
   have just as much access to your data as you do - unless stated otherwise,
   which is a clear privacy issue, and this can often lead to your data being
   sold and/or profiled for the sake of targeted ads,
2. because these services can read your data, this means that your data can also
   end up in a data breach, if the storage service is somehow compromised in
   a successful attack by hackers.

However, there a few of these cloud storage providers that use something called
end-to-end encryption which is often stated as *zero-knowledge authentication*
or similar. Without going into too much detail, it basically means that you
alone know the password needed to decrypt - and thereby read - the data stored
in their cloud, but this also has the disadvantage that if you forget your
password, they can do absolutely nothing to help you recover your data.

One such cloud storage provider is [Tresorit](https://tresorit.com/), which has
a nice user interface and allows two-factor authentication. Another example is
[Spideroak](https://spideroak.com/solutions/spideroak-one).

### Private messaging

Just as your cloud provider is usually able to access your data, so is it also
the case for the services you use for messaging, e.g. Facebook messenger, Google
Hangouts, Skype, Snapchat, etc., which comes with the same downsides: poor
privacy, risk of profiling, and vulnerable to data breaches. To avoid this, you
can use a secure messaging app
like
[Signal](https://itunes.apple.com/us/app/signal-private-messenger/id874139669)
which uses an end-to-end encryption protocol such that it never has access to
your unencrypted communications. Furthermore, it is also open source which means
that it can be audited by the public thus ensuring that the app does what it
claims.

### Data breaches

As stated previously, a data breach is when a large piece of private data is
unintentionally leaked, usually these leaks consists of information like email
address, username and the hashed password (not as bad as your clear text
password) for millions of users. This sort of leak has happened to giant players
like Adobe, LinkedIn, Yahoo, Dropbox, and tumblr over the years and it can be
hard to guard against if you are using any service where you are not in total
control of your data. One thing you can do is to subscribe to the
service [Have i been pwned?](https://haveibeenpwned.com/), which is a website
that will send you an email if your email address is present in any type of
major leak. If this should happen, you should change your password for the given
website/service, and hope your data has not been compromised yet.

### Tracking and profiling

While it is - sadly - obvious that giant websites like Facebook, YouTube,
Google, etc. are tracking and profiling you in order to serve you targeted ads
and what not, they actually tend to give you quite a lot of control of what data
they store, if you bother to spend time looking it up. I will not put any links
here, as they tend to change once in a while, but a quick search like *"What
does {Google, Facebook, Evil Corp} know about you"* will usually point you in
the right direction.

### Malware

Malware comes in many different shapes and sizes, but the way it finds its way
to your computer is usually through malicious files being downloaded that
pretends to be innocent, or malicious websites that manages to exploit security
holes in your web browser.

#### Antivirus

Right now,
[antivirus does not seem worth the trouble on macOS](https://security.stackexchange.com/questions/62835/should-i-get-an-antivirus-for-my-mac#answer-62920),
so probably better to skip this part.

#### Web browsers

Today, using a modern and secure browser is the first defense against malicious
websites. However, browsers may also collect data about you thus invading your
privacy.

Personally, I've just switched to [Brave](https://www.brave.com/), which is an
open source browser that blocks harmful advertisements, uses HTTPS for all
connections and blocks tracking cookies and pixels. It is just as easy to use as
Google Chrome or Firefox but has been designed with security and privacy in mind
from the beginning, which is also reflected in the *preferences* menu where you
can fine tune the privacy and security aspects of your browsing even
further. Lastly, it also has a very limited set of available browser plugins, as
suspect browser plugins have recently been used to infect machines with malware
on several occasions.

### Search engine

Just as the browser can record your browsing history, so can your search engine
record your search history. Generally, there are few alternatives to good old
Google, but if you do not want Google snooping in your browsing history you can
use [DuckDuckGo](https://duckduckgo.com/), which I've personally been using for
the last few months, with very few hiccups.

### Passwords managers

As described in the concepts section, a password manager allows you to only
remember one strong password which you then use to log into the password manager
and then it remembers - and often generates - all the other passwords you need.

Personally, I use [Lastpass](https://www.lastpass.com/) with 2-factor
authentication enabled and configured my Brave browser to use Lastpass as the
password manager when confronted with a password input form on a website.

Because Lastpass uses end-to-end encryption like the *zero-knowledge* cloud
storage services we discussed earlier, there should be no extra risk in storing
your encrypted data in their cloud rather than locally. If you would rather have
a local password manager, you can use [1password](https://1password.com/) or
[KeePass](http://keepass.info/).

### VPN

As mentioned in the concepts section, a virtual private network allows you to
communicate privately across a public network. What this means is that a VPN
creates a secure, encrypted connection, which can be thought of as a tunnel,
between your computer and a server operated by the VPN service. Such a mechanism
obscures to outsiders which websites you are visiting, what you search for,
etc., as all they can see is that you are sending request to this VPN
service. However, now that you are sending all your data through this VPN
service, it is very important that you can trust that this VPN is not also
storing and selling your data for profit. Two VPN services which claim to care
about their users privacy and has gotten good reviews
are [TunnelBear](https://www.tunnelbear.com/)
and [NordVPN](https://nordvpn.com/), of which I have myself installed the latter
just recently.

### A few steps further

Besides the topics mentioned above, there are a lot of other things you can do
to get more control of your privacy and security:

- Minimize your online footprint by deleting users on social networks that just
  waste your time and/or think about what data you choose to put online,
- switch to an open source operating system like
  [Arch Linux](https://www.archlinux.org/) or similar,
- use an encrypted email service like [Protonmail](https://protonmail.com/) or
  add [GPG](https://en.wikipedia.org/wiki/GNU_Privacy_Guard) to your existing
  email service, or
- do as [Henry David Thoreau](https://en.wikipedia.org/wiki/Henry_David_Thoreau)
  and go live in a cabin in the woods.

### Parting words

If you feel that I did not cover any of the above topics in great enough detail,
you can easily find more information using your search engine (DuckDuckGo) and a
few well placed keywords in your search query.

Before we leave, remember the following:

- Do not click on suspicious links on the Internet,
- be aware of phising attempts and other suspicious activity, and
- put some tape over your web cam.
