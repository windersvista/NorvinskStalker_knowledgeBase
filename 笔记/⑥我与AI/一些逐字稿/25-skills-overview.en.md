# Matt Pocock：十分钟讲完 25 个 Skills | mattpocock/skills v1.2.3

> 逐字稿（英文原声（p=1，中英字幕版））。由 faster-whisper (medium, CPU int8) 自动转写，可能存在个别识别误差（专有名词、人名、书名等），请以原视频字幕为准。

- 视频: https://www.bilibili.com/video/BV1zUh56RE8k/?p=1
- 原出处: X 原帖: https://x.com/mattpocockuk/status/2088290952704151671；仓库: https://github.com/mattpocock/skills
- 采集日期: 2026-09-08

---

[00:00] Hello, pals. It occurs to me that I've never really made a super quick just introduction to my skill set.
[00:07] You know, just a fast video that respects my time and yours walking your way through my skills.
[00:12] We're going to walk through this documentation site, which is the docs for my skills.
[00:15] You can see there are nearly up to 220k stars.
[00:18] You can install them in two separate ways currently.
[00:20] You can either just get the Claude plugin just here or you can install the skills locally via NPX skills.
[00:26] If you want a really smooth managed install, then you use Claude code.
[00:29] If you want to tinker with the skills, then you install the skills via NPX.
[00:32] I've got about 20 minutes before I pick up my son.
[00:34] And let's see if we can make that video now.
[00:37] And by the way, if you're interested in this stuff, then I'm releasing an AI coding crash course next week.
[00:42] The final pricing, the final release will open on Monday.
[00:45] And so if you want to be first in line, then if I just get out of the way, then you can join the wait list.
[00:50] This skill set is for engineering.
[00:52] So we are really focusing on engineering at the start.
[00:55] The main way you do engineering with this skill set is you first use the grill with docs skill.
[01:00] This is kind of a modification of the grill me skill, which is much more popular, well, very popular down there.
[01:07] And the idea of the grill me skill is you align on an idea before committing to it.
[01:10] So this is really kind of like plan mode and grill with docs adds just a little layer on top of that,
[01:15] forcing you to talk about domain terminology and also add a little bit of documentation on the decisions that you've been making.
[01:22] So architectural decision records.
[01:23] It interviews you pretty aggressively until you've sort of figured out what you're building.
[01:28] And then once you figure that out, you can then dive into implementing it straight away, if you like, via the implement skill.
[01:34] The implement skill, like most of my skills, is extremely small.
[01:37] Just implement the work described by the user.
[01:39] It uses a TDD skill, which is just really a reference skill on getting it to do red, green refactor.
[01:44] And then it calls code review to review the work at the end.
[01:48] The code review skill is really great.
[01:50] It does a dual axis check.
[01:52] It first checks on the standards.
[01:55] So any documented coding standards in your repo will be picked up and it checks against the original design.
[02:00] So this I found is super important for increasing the quality of what you put out there.
[02:04] So that grill with docs to implement, that's really the core.
[02:08] That's what you do on simple bug fixes, simple features where you can squeeze the grill with docs and implement into a single context window.
[02:15] And by the way, I don't mean just like one million tokens.
[02:18] I really mean the smart zone of the context window, which inside my AI coding dictionary, you can see defined here.
[02:25] Early in the session, the agent is sharp and focused.
[02:27] As the session grows, it drifts into a dumb zone, sloppier, forgetful, more mistakes.
[02:32] And the smart zone really is around 150k tokens.
[02:35] It's really not that big.
[02:36] I mean, your mileage may vary, but that's kind of my working metric.
[02:39] And so what happens when you have a task that you know is going to take more than 150k tokens?
[02:44] What about 250k?
[02:45] What about a million tokens?
[02:47] Well, for that, you do two things.
[02:48] You first define a spec.
[02:50] So you do your grilling session and then you define a spec.
[02:53] That spec is going to sit in your issue tracker.
[02:56] So that issue tracker might be GitHub, might be Beads, might be Linear, Jira, whatever.
[03:00] And you can set up what issue tracker you're using with the SetupMapPocketsSkills skill.
[03:05] So this one actually modifies your repo to say, this is the issue tracker we're using, blah, blah, blah, blah, blah.
[03:10] So to spec, what that then does is it takes the grill with docs session and it outputs a really nice specification
[03:16] that you can use as a destination.
[03:18] The journey, the question on how you actually build the thing, that is down to two tickets.
[03:24] So you have your spec, which is the destination, and then each individual session of the agent that's building it,
[03:30] each agent is going to get an individual ticket.
[03:32] So just like you would have an epic before where you would define what it is you're building
[03:36] and then you pass the tickets to the developers.
[03:39] Now you're basically saying, OK, we've got the spec.
[03:42] That's where we're going. And the tickets go to individual agents.
[03:44] From there, each agent is going to implement that ticket using the implement skill.
[03:48] So it's kind of like the same flow.
[03:50] It's just we've got a step to divide it up over multiple context windows.
[03:54] So this is fine, this setup, when grill with docs can fit inside one session.
[03:59] But what about when you need to plan something absolutely enormous,
[04:03] something that will grow outside one smart zone?
[04:05] Well, for that, you can use the Wayfinder skill down here.
[04:08] So we're down to shaping now.
[04:10] The Wayfinder skill allows you to orchestrate multiple context windows,
[04:14] kind of like to spec into tickets do for implementation, it does for planning.
[04:18] Wayfinder will grill you a little bit on the thing that you're trying to build
[04:21] and then create a map from which you can put tickets into.
[04:24] So it actually goes into your issue tracker as well.
[04:27] But these tickets are not implementation tickets, they're decision tickets.
[04:31] So Wayfinder will say, OK, we need to decide about this thing first.
[04:34] And then we maybe need to build a prototype based on that.
[04:37] So it might use the prototype skill for that.
[04:39] It might then say, OK, we need to research something as well.
[04:42] We need like the external documentation for that.
[04:44] Or we need to do a bit of market research.
[04:46] Then we can use the research skill.
[04:47] Once you end up with a proper Wayfinder map where all of the decisions have been made,
[04:52] all of the sub issues of the map are closed, then you go into to spec again
[04:56] and you go through the tickets to actually build out the thing.
[04:59] By the way, I'm not really doing Wayfinder justice in this section.
[05:02] Like Wayfinder is a massive skill all by itself.
[05:04] And if you have any follow up questions to this, obviously you can ask in the thread below.
[05:08] But you can also just use the Ask Matt skill,
[05:10] which has information encoded in all of the docs.
[05:12] But it's right there for you to use it.
[05:15] So you can actually ask it about your current situation and which skill would be best useful,
[05:20] best useful, most useful.
[05:21] You can see I'm not spending much time on this video.
[05:23] So that then is getting started.
[05:25] That is the main flow and that shaping.
[05:26] And then we have a few upkeep skills.
[05:28] The first two are pretty simple.
[05:30] The diagnosing bug skill and the resolving merge conflict skill are basically trying to make the model better at things.
[05:37] Most of my skills are designed to be user invoked.
[05:39] So the model doesn't even know about them until they pop up,
[05:43] which makes my skills very low on context load.
[05:45] But diagnosing bugs, I found this gives a really great feedback loop to the agent to basically say,
[05:50] OK, you're going to diagnose a hard bug.
[05:52] You're going to create a rigorous feedback loop.
[05:54] Here are the steps I would take because I found that models are just not very good at it.
[05:58] So that's my way of improving them.
[06:00] And it does a really good job resolving merge conflicts as well.
[06:02] I was noticing that I was just getting some terrible merge conflict resolutions from my agents.
[06:07] And so this, what this does is it goes back and forces it to look at primary sources,
[06:13] to get blame really far back until it understands why every change was made.
[06:17] If you've ever heard of Chesterton's fence, this is exactly what this is doing.
[06:20] You never remove a fence if you don't know why it was there.
[06:23] And that's what the resolving merge conflict skill does.
[06:25] The triage skill is one that I've kind of gone away from a little bit.
[06:29] I don't use it very much, but it's essentially for triaging any set of issues that you didn't create.
[06:36] In other words, it's great for open source projects where you just need to go,
[06:39] OK, I've got the huge list of open issues.
[06:41] How do I burn them down?
[06:43] The triage skill is great for that.
[06:45] The wizard skill is another great skill.
[06:47] I was getting really sick of provisioning like third party services and creating API keys and all that stuff.
[06:54] And the wizard, what it does is it generates a script that walks a human through the setup, helping it as much as it can.
[07:00] And so this means that you can basically say, just create me a wizard to walk through provisioning these 10 AWS services and it will do it.
[07:08] It will open all of the URLs for you.
[07:10] It will save the environment variables that it needs to.
[07:13] It will help you as much as possible with the CLI itself.
[07:16] The wizard skill is such a lifesaver.
[07:17] And then the improved code based architecture skill is such a nice one.
[07:22] This creates a visual report for you so that you can look at, you can basically point at your repo and just say,
[07:27] improve code base architecture in this specific area.
[07:31] And it will give you lots of candidates for different ways that you can refactor your application to improve your test suite,
[07:37] to deepen your modules, to make your code base just generally better and easier to make changes in.
[07:44] I could bang on and on about that skill, but I've already got a video on it.
[07:46] We've got the grill me skill, which is the classic kind of like grilling without docs.
[07:50] The handoff skill is when you want to hand off to another agent.
[07:53] I find this really, really useful because you can just basically just write a markdown file of the thing you want that other agent to do and it goes and does it.
[08:00] The to questionnaire skill is a great one.
[08:02] This one is it's a way of taking a grilling session offline.
[08:06] So when you're having a grilling session and you realize, oh, I actually just need someone else's help with this, you can take the grilling session and you can turn it into a questionnaire.
[08:15] This saves it as a markdown file that you can then save into a Google doc.
[08:18] You can walk through that questionnaire with the person that you need answers from and then feed that back to the agent.
[08:23] The teach skill is just a remarkable little skill.
[08:26] It creates HTML lessons to essentially teach you anything.
[08:31] You can create a teaching workspace where it's essentially trying to guide you to learn that thing and learn the knowledge, the skills and the wisdom that you need in order to actually learn it.
[08:42] And it's actually taught me a lot.
[08:44] It's an incredible skill.
[08:45] I really recommend you try it.
[08:46] It's amazing for curious people.
[08:48] It's also absolutely nuts for onboarding onto code bases.
[08:51] You just say teach me about this repo and it will create you a course, a just in time course for that repo.
[08:58] The wait what skill is a essentially an answer to Opus five being incredibly verbose.
[09:03] You can get it essentially used, you know, the model spits out some garbage and you say wait what and it goes and repeats it again.
[09:11] But this time a lot cleaner, a lot easier to understand and using the domain language that you created in the grill with doc skills.
[09:18] So it feeds into that too.
[09:19] The writing for agent skill is similar to the diagnosing bugs skill, which is it's able to the model is able to invoke it and it's essentially a skill writing skill.
[09:29] It's also able to work on your agents to MD or any documentation that is agent focused.
[09:35] These skills are pretty popular and people say they're well written and the writing for agent skill is basically my attempt to encode my skill writing skills into a skill.
[09:43] And then we have a layer of reference skills that are used in lots of other skills.
[09:47] We've already seen the TDD skill, which is used in the implements.
[09:51] We've seen grilling, which is used in wayfinder in grill with docs and grill me.
[09:55] We've got the domain modeling skill, which is used in grill with docs and we've got the code based design skill, which is used in various places.
[10:02] Oh my God, I really tried to make this a short video.
[10:04] I really did try, but I guess when you create 25 skills and you want to talk about all of them, that's quite a lot of words.
[10:10] But thank you so much for watching.
[10:11] If you're interested in this stuff, then do sign up for the AI coding crash course dropping on Monday.
[10:16] I will see you very soon.
