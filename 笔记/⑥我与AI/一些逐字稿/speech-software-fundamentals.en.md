# Matt Pocock 演讲：AI 时代，软件基本功反而更重要 | AI Engineer Europe

> 逐字稿（英文原声（p=1，中英字幕版））。由 faster-whisper (medium, CPU int8) 自动转写，可能存在个别识别误差（专有名词、人名、书名等），请以原视频字幕为准。

- 视频: https://www.bilibili.com/video/BV1pq8B64EFH/?p=1
- 原出处: YouTube: https://www.youtube.com/watch?v=v4F1gFy-hqg (频道 AI Engineer)
- 采集日期: 2026-09-08

---

[00:00] Hello everyone, having a good conference so far?
[00:16] Are you having a good conference so far?
[00:19] Good, wonderful.
[00:22] I have a message for you that I hope will be a comforting message for folks who believe
[00:27] that their skill set is no longer worth anything in this new age, which is I believe that
[00:34] software fundamentals matter now more than they actually ever have.
[00:39] And I'm a teacher, and I've been recently teaching a course called Claude Code for
[00:45] Real Engineers, nice and provocative, and in the process of kind of working on this
[00:50] course I had to come up with a curriculum about AI coding, which is a bit of a nightmare
[00:57] because things are changing all the time, right?
[01:00] AI is a whole new paradigm.
[01:02] We need to chuck out all of the old rules, surely, so that we can bring in the new
[01:06] stuff.
[01:08] And there's a kind of movement that has come up around this, which is the specs to code
[01:14] movement.
[01:15] And the specs to code movement says that, okay, you can write a specification about
[01:19] how an application is supposed to work, then you can use AI to turn it into code.
[01:23] If there's a problem with the application, you then go back to the spec, you don't
[01:27] really look at the code, you just change the spec, you run the compiler again,
[01:32] and you end up with more code.
[01:34] Raise your hand if you've heard of that.
[01:37] Put your hand raised if you've tried it.
[01:39] Okay, I've tried it too, you can put your hands down.
[01:43] What I noticed was I would run it, and I would try not to look at the code, but
[01:48] I would look at the code, and I realised I would get code out first of all, and
[01:52] then I would run it, I would get worse code, and then I did it again, I got
[01:55] even worse code, and I got it again, I kept running the compiler, kept running
[01:59] the compiler, and I would just end up with garbage.
[02:04] Raise your hand if that's happened to you.
[02:06] Yes, I don't think this works.
[02:09] The idea that we can just ignore the code and just have the code,
[02:12] let it manage itself, it's just sort of i-coding by another name.
[02:16] And I didn't believe that back then.
[02:18] I thought, okay, how do I fix the compiler?
[02:21] How do I make it so that it doesn't produce bad code each time or worse code?
[02:25] And so I thought, okay, I need to explain to the LLM in English
[02:29] what a good code base looks like.
[02:31] Let me dig out one of my old favourite books, which is
[02:35] A Philosophy of Software Design by John Ousterhout.
[02:37] Go on Amazon, get it.
[02:40] And he has a definition for what bad code looks like.
[02:45] He calls it complex code.
[02:46] Complexity is anything related to the structure of a software system
[02:49] that makes it hard to understand and modify the system, right?
[02:53] So a bad code base is a code base that's hard to change.
[02:57] If you can't change a code base without causing bugs,
[03:00] then it's a bad code base.
[03:01] Good code bases are easy to change.
[03:04] So I thought, ooh, that was good.
[03:05] Let's try another book. Let's try The Pragmatic Programmer.
[03:08] Go on Amazon, get it.
[03:10] They have a whole chapter on something called software entropy.
[03:14] And this is exactly what I was seeing.
[03:16] Entropy is the idea that things tend towards disaster
[03:20] and floating away from each other and collapse.
[03:23] And this is exactly how most software systems behave, too,
[03:25] is that every time you make a change to a code base,
[03:28] if you're only thinking about that change,
[03:29] not thinking about the design of the whole system,
[03:32] your code bases are gonna get worse and worse and worse.
[03:35] And that's what I was seeing.
[03:36] Everything inside the specs to code idea
[03:39] that you just run the compiler again and again
[03:41] was making worse code.
[03:43] Now, there's an idea
[03:45] that sort of drives the specs to code movement,
[03:47] which is that code is cheap.
[03:50] Raise your hand if you've heard that phrase before,
[03:51] that code is cheap.
[03:52] Yeah.
[03:55] Well, I don't think this is right.
[03:57] I think code is not cheap.
[03:59] In fact, bad code is the most expensive it's ever been.
[04:03] Because if you have a code base that's hard to change,
[04:06] you're not able to take all of the bounty
[04:08] that AI can offer,
[04:10] because AI in a good code base
[04:11] actually does really, really well.
[04:15] And this means good code bases matter more than ever,
[04:17] which means software fundamentals matter more than ever.
[04:20] That's the thesis of this talk.
[04:22] So let's actually get into practical stuff.
[04:25] I'm gonna talk about different failure modes
[04:27] that you may have experienced
[04:28] or you may not have experienced yet with AI
[04:30] and how you can avoid them
[04:31] by just going back to old books
[04:33] and looking at good software practices.
[04:34] Sound good?
[04:36] So the first one is that the AI didn't do what I wanted.
[04:40] You know, I thought I had a good idea in my head
[04:43] and the AI just did something totally different
[04:44] or it did some like specs that I, you know,
[04:47] it just made something I didn't want.
[04:49] Raise your hand if you've hit this mode.
[04:51] Cool, okay.
[04:53] Well, this is what they say in the pragmatic programmer
[04:56] is that no one knows exactly what they want.
[04:59] It's that you and the AI,
[05:01] there is a communication barrier there, right?
[05:04] And so when you're talking to the AI,
[05:05] that's kind of like the AI doing its requirements gathering.
[05:08] It's basically working out from you
[05:10] what it is that you need.
[05:12] And I realized that there was another book,
[05:16] Frederick P. Brooks, The Design of Design,
[05:19] and it talks about this idea called the design concept.
[05:22] It's that when you have more than one person
[05:23] designing something together,
[05:25] you have this idea sort of floating between you,
[05:28] this ephemeral idea of the thing that you're building.
[05:32] And that thing that you're building
[05:33] or the idea of it is called the design concept.
[05:35] It's not an asset.
[05:37] It's not something you can put in a markdown file.
[05:39] It is the invisible sort of theory of what you're building.
[05:44] And so I thought, okay, that's what's going on.
[05:46] Me and the AI don't share a design concept.
[05:49] So I came up with a skill.
[05:51] The skill is very, very simple.
[05:53] It's called grill me.
[05:54] And it looks like this.
[05:57] Interview me relentlessly about every aspect
[05:59] of this plan until we reach a shared understanding.
[06:03] Walk down each branch of the design tree,
[06:05] which is another thing from Frederick P. Brooks,
[06:07] resolving dependencies between decisions one by one.
[06:10] This skill is like,
[06:12] the repo containing this skill has like 13,000 stars
[06:14] or something like it just went nuts, went viral.
[06:17] People would love this thing.
[06:18] These couple of lines means the AI asks you
[06:21] like 40 questions, 60 questions.
[06:24] I've had it ask people 100 questions
[06:26] before it's satisfied.
[06:27] They've reached a shared understanding.
[06:29] And it means it turns the AI into a kind of adversary
[06:33] where it's just continually pinging you ideas
[06:35] and trying to reach a shared understanding.
[06:38] And that means that the conversation that you then generate,
[06:41] you can take that and turn it
[06:42] into a product requirements document or something.
[06:45] Or if it's a small change,
[06:47] you can just turn it directly into issues.
[06:52] And then your AFK agent will then pick it up.
[06:54] And don't at me on this,
[06:56] but I personally believe this is better
[06:58] than the default plan mode in the tool that I use,
[07:02] which is claw code.
[07:04] Plan mode is extremely eager to create an asset.
[07:07] It really wants to just create a plan and start working.
[07:12] Whereas I think it's a lot nicer
[07:14] to reach a shared design concept first.
[07:18] So that's tip number one.
[07:21] Now failure mode number two
[07:22] is that the AI is just way too verbose.
[07:26] It's like you're almost talking
[07:27] across purposes with the AI.
[07:29] Raise your hand if you feel this,
[07:31] if you ever experienced that failure mode.
[07:33] It's kind of like the AI is like talking,
[07:34] just using too many words
[07:36] to try to communicate what it's doing.
[07:38] It's not like you're talking using the same language.
[07:42] And this to me felt very, very familiar, right?
[07:45] If you've ever been a developer for a long time
[07:47] and you've worked with, let's say domain experts,
[07:49] someone building an application.
[07:51] Let's say the domain expert wants you
[07:53] to build something on microchips.
[07:55] You have no idea what microchips are.
[07:57] You need to establish some kind of shared language,
[08:00] because otherwise they're gonna be using terms
[08:01] you don't understand.
[08:03] They're gonna be translating that into code
[08:04] that maybe you don't even understand,
[08:05] and certainly the domain expert won't.
[08:07] And so there's this kind of language gap
[08:09] between you and the domain expert.
[08:12] And so I went back to domain-driven design, DDD.
[08:17] This is something I'm still kind of on the edge
[08:19] of exploring, but everything I'm reading about DDD
[08:22] is just music to my ears.
[08:24] I fricking love it.
[08:25] And DDD has a concept of a ubiquitous language.
[08:30] With a ubiquitous language,
[08:32] conversations among developers
[08:34] and expressions of the code
[08:35] and conversations with domain experts
[08:37] are all derived from the same domain model.
[08:39] It's essentially a markdown file full of a list of terms
[08:42] that you and the AI have in common.
[08:44] And you really focus on those terms
[08:46] and you really make sure that they're aligned
[08:48] with what it actually means,
[08:49] and you use them all the time in the code,
[08:52] when you're talking about the code,
[08:53] when you're talking to domain experts,
[08:55] or in our case, when you're talking with AI.
[08:57] So I made a skill.
[08:59] This skill is the ubiquitous language skill.
[09:02] Basically just scans your code base,
[09:04] looks for terminology,
[09:05] and then creates a markdown file.
[09:09] Creates the ubiquitous language markdown file,
[09:11] a bunch of markdown tables with all of the terminology.
[09:14] And this, then I pass it to the AI
[09:17] and I'm able to read it too.
[09:19] And I actually have it open all the time
[09:21] when I'm grilling with the AI and planning and that.
[09:23] What I noticed by reading the thinking traces
[09:25] of the AI not only improves the planning,
[09:28] but it allows the AI to think in a less verbose way
[09:32] and actually means that the implementation
[09:33] is more aligned with what you actually planned.
[09:37] So this has absolutely been a powerhouse.
[09:39] It's been unbelievably good.
[09:41] So that's tip number two,
[09:42] create a shared language with the AI.
[09:46] So okay, let's imagine that you've aligned with the AI.
[09:49] You know what it is you're supposed to be building.
[09:51] The AI has built the right thing, but it doesn't work.
[09:55] Raise your hands if that's happened to you.
[09:57] Yep, just doesn't work.
[09:59] Well, there's an obvious thing
[10:00] that we can do to make that better,
[10:03] which is we can use feedback loops.
[10:05] We can use static types.
[10:07] If you're not using TypeScript, that's crazy.
[10:10] If you're not using, if you're building a front end app
[10:13] and you're not giving the LLM access to the browser
[10:16] so it can look around, absolutely needs that.
[10:19] And you obviously also need automated tests.
[10:23] And one sort of thing I noticed here
[10:27] is that even with these feedback loops,
[10:29] the LLM doesn't use them very well.
[10:31] It doesn't kind of like get the most
[10:34] out of its feedback loops
[10:35] in the way that a veteran developer would.
[10:36] And so it does, what it tends to do
[10:38] is just does way too much at once.
[10:41] It will produce huge amounts of code
[10:43] and then think, oh, I should probably
[10:44] type check that actually.
[10:46] Or I should maybe check a test on that
[10:48] or maybe do something like that.
[10:50] And this in the Pragmatic Programmer,
[10:52] they describe as outrunning your headlights
[10:55] as essentially driving too fast
[10:56] because the rate of feedback is your speed limits.
[11:02] The rate of feedback is your speed limit
[11:03] which means that you should be testing as you go,
[11:06] taking small deliberate steps.
[11:08] And the AI by default is really not very good at that.
[11:12] So skill number three is TDD.
[11:14] You should be using test driven developments
[11:17] because TDD forces the LLM to really take small steps.
[11:23] You create a test first, you make that test pass
[11:27] and then you refactor the code
[11:28] to make it nicer and consider the design.
[11:32] The issue here is that testing is really hard.
[11:36] Testing has always been hard.
[11:38] And the reason for that is there are a ton
[11:43] of different decisions you need to make
[11:45] when you write a test.
[11:46] You need to figure out how big a unit
[11:48] do you want to test.
[11:50] You need to figure out what to mock.
[11:52] You need to figure out what behaviors
[11:53] do you even want to test in the first place.
[11:55] And all of these decisions are dependent.
[11:57] So if you are testing a really big unit
[11:59] like an entire massive application,
[12:02] then it might be quite flaky,
[12:03] you might not want to test that many behaviors.
[12:06] If you only test this unit, you need to mock this unit.
[12:09] It's all interlinked.
[12:10] And I've been thinking about this for years
[12:12] for my entire development career.
[12:15] And what we notice is that good code bases
[12:18] are easy code bases to test.
[12:21] So here we're starting to get back
[12:22] to the idea of code being important.
[12:25] Is that the better your code base is,
[12:26] the better your feedback loops are
[12:28] because you're able to give better feedback to the LLM,
[12:33] it produces better code.
[12:35] And so I thought, what does a good code base,
[12:37] what does a testable code base look like?
[12:40] Again, we go to John Osterhout.
[12:42] He talks about having deep modules in your code base.
[12:46] Not shallow modules, not lots of modules
[12:49] that expose kind of lots of functions.
[12:52] They should be relatively few large deep modules
[12:55] with simple interfaces.
[12:57] Let's compare them quickly.
[12:59] Deep modules, lots of functionality
[13:01] hidden behind a simple interface.
[13:03] Hiding the complexity.
[13:05] You can look inside the deep module if you want to,
[13:07] but you don't need to.
[13:08] You can just use the interface.
[13:09] Shallow modules, not much functionality, complex interface.
[13:13] And I'll just wait for you to take the photos.
[13:18] Shallow modules in a code base kind of look like this.
[13:21] We have a ton of different tiny little blobs
[13:24] that the AI has to walk through and navigate.
[13:26] And this is really hard for the AI to explore actually.
[13:31] And so often what you'll see is
[13:32] if you have a code base like this,
[13:33] which AI is really good at creating code bases like this,
[13:36] is that you'll have a situation
[13:38] where AI doesn't understand what your code is doing.
[13:41] It will attempt to explore the code,
[13:42] but because it's poorly laid out
[13:45] and filled with shallow modules,
[13:46] it doesn't maybe get to the right module in time
[13:49] or doesn't understand all the dependencies,
[13:50] all that stuff.
[13:51] It doesn't understand your code.
[13:53] And so what does a code base
[13:55] full of deep modules look like?
[13:58] Well, it looks like this,
[14:00] where it's the same code,
[14:01] but it's just structured inside boundaries
[14:04] where you have these interfaces on the top.
[14:08] And these interfaces,
[14:09] you should probably have a lot of control over them
[14:12] and design them really well.
[14:14] Otherwise, AI might mess up the design.
[14:17] But the implementation,
[14:18] you can kind of leave that to the AI a bit.
[14:21] So how do you turn a code base that looks like this
[14:25] into a code base that looks like that?
[14:29] Well, I've got a skill for that.
[14:30] Improve code base architecture.
[14:32] Turns out this is not,
[14:34] it's quite complicated to do this,
[14:36] but it's like a set of steps
[14:38] that you can reusably do again and again.
[14:40] You just sort of explore the code base,
[14:42] look for opportunities where there's code
[14:44] that's kind of related,
[14:46] and wrap all of that in a deep module.
[14:50] And this is a testable code base
[14:51] because the boundaries around this code are so, so simple.
[14:55] You test out the interface,
[14:57] you verify using that interface,
[14:59] and you're good to go.
[15:00] And so this is a code base that rewards TDD.
[15:04] But how about failure bone number six?
[15:06] Which is your, okay,
[15:07] let's say your feedback loops are working.
[15:09] Let's say that things are kicking into gear.
[15:11] You're able to ship more code than you ever have before,
[15:13] but your brain can't keep up, right?
[15:17] Raise your hand if you felt more tired
[15:19] than you have ever before in your development career.
[15:22] Yeah, me too.
[15:23] It's knackering.
[15:25] And I think that this is a code base
[15:27] that actually makes it harder for your brain
[15:30] because you, as well as the AI,
[15:32] need to keep all of that information in your head.
[15:34] Whereas this, not only is it simpler
[15:38] for you to read and understand,
[15:40] it also means you can kind of treat these modules
[15:43] or these deep modules as gray boxes.
[15:47] You can kind of say,
[15:49] okay, I'm gonna just design the interface,
[15:52] but I'm not gonna worry too much
[15:53] or not review the implementation too much.
[15:57] You can do this obviously with things
[15:58] that are less critical in your application.
[16:00] Can't do this with various things
[16:02] like finance or whatever,
[16:04] but in many, many modules in your app,
[16:06] you don't need to think about the implementation too much
[16:08] as long as you have a testable boundary
[16:10] outside the module
[16:12] and as long as you understand its purpose
[16:13] and can design it from the outside.
[16:15] I have found this has really saved my brain
[16:18] because I can just go, okay, the AI,
[16:20] I'll let you handle what's inside the big blob.
[16:22] I'm just gonna test from the outside and verify it.
[16:26] So that's tip number five.
[16:27] Design the interface, delegate the implementation.
[16:32] But this means that whenever we're touching the code,
[16:35] whenever we're planning stuff,
[16:36] we need to think about and be aware
[16:38] of the modules in our application.
[16:40] We need to know that map really well.
[16:42] It needs to be part of our ubiquitous language.
[16:45] We need to build it into our planning skills as well.
[16:47] So my right to PRD, inside the PRD,
[16:49] I'm specific about the module changes
[16:51] and the interfaces inside those modules,
[16:54] how they're being modified.
[16:55] I'm thinking about them all the time.
[16:56] And this comes from Kent Beck.
[16:58] Invest in the design of the system every day.
[17:02] And this is the core of it, right?
[17:04] Because specs to code,
[17:05] we are not investing in the design of the system.
[17:08] We are divesting from it.
[17:10] We're getting rid of that.
[17:12] Whereas this, I think, is absolutely key.
[17:16] And so code is not cheap.
[17:19] That's the message I want you to take away.
[17:20] Code is important.
[17:23] And if we think about AI
[17:24] as a really great on the ground programmer,
[17:28] a kind of tactical programmer,
[17:29] a sergeant on the ground making the code changes,
[17:33] you need someone above that.
[17:35] You need someone thinking on the strategic level.
[17:38] And that's you.
[17:39] And that requires software fundamental skills
[17:42] that we've been using for 20 years, for longer.
[17:46] Now, if you were interested
[17:47] in any of the skills I put up here,
[17:49] it's in the GitHub repo, MattPocockSkills.
[17:52] And if you're interested in the training that I do
[17:54] or any free stuff, I'm on YouTube, I'm on Twitter,
[17:57] but I'm also at aihero.dev
[17:58] where I have a newsletter that you can check out.
[18:01] Thank you so much.
[18:02] I hope that this gives you confidence in this new AI age
[18:05] so you can actually make a good impact.
[18:07] Thank you.
