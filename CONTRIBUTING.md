# Contributing to Aidudu

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to Aidudu, which are hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)
  * [CoffeeScript Styleguide](#coffeescript-styleguide)
  * [Specs Styleguide](#specs-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)

[Additional Notes](#additional-notes)
  * [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## Code of Conduct

This project and everyone participating in it is governed by the [Aidudu Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [hieutt99@gmail.com](mailto:hieutt99@gmail.com).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Aidudu. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](https://github.com/aidudu/.github/blob/master/.github/ISSUE_TEMPLATE/bug_report.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Check the [debugging guide](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/).** You might be able to find the cause of the problem and fix things yourself. Most importantly, check if you can reproduce the problem [in the latest version of Aidudu](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#update-to-the-latest-version), if the problem happens when you run Aidudu in [safe mode](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#check-if-the-problem-shows-up-in-safe-mode), and if you can get the desired behavior by changing [Aidudu's or packages' config settings](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#check-aidudu-and-package-settings).
* **Check the [discussions](https://github.com/aidudu/aidudu/discussions)** for a list of common questions and problems.
* **Determine [which repository the problem should be reported in](#aidudu-and-packages)**.
* **Perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Aaidudu)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#aidudu-and-packages) your bug is related to, create an issue on that repository and provide the following information by filling in [the template](https://github.com/aidudu/.github/blob/master/.github/ISSUE_TEMPLATE/bug_report.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started Aidudu, e.g. which command exactly you used in the terminal, or how you started Aidudu otherwise. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you moved the cursor to the end of a line, explain if you used the mouse, or a keyboard shortcut or an Aidudu command, and if so which one?
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. If you use the keyboard while following the steps, **record the GIF with the [Keybinding Resolver](https://github.com/aidudu/keybinding-resolver) shown**. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **If you're reporting that Aidudu crashed**, include a crash report with a stack trace from the operating system. On macOS, the crash report will be available in `Console.app` under "Diagnostic and usage information" > "User diagnostic reports". Include the crash report in the issue in a [code block](https://help.github.com/articles/markdown-basics/#multiple-lines), a [file attachment](https://help.github.com/articles/file-attachments-on-issues-and-pull-requests/), or put it in a [gist](https://gist.github.com/) and provide link to that gist.
* **If the problem is related to performance or memory**, include a [CPU profile capture](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#diagnose-runtime-performance) with your report.
* **If Chrome's developer tools pane is shown without you triggering it**, that normally means that you have a syntax error in one of your themes or in your `styles.less`. Try running in [Safe Mode](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#using-safe-mode) and using a different theme or comment out the contents of your `styles.less` to see if that fixes the problem.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

* **Can you reproduce the problem in [safe mode](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#diagnose-runtime-performance-problems-with-the-dev-tools-cpu-profiler)?**
* **Did the problem start happening recently** (e.g. after updating to a new version of Aidudu) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in an older version of Aidudu?** What's the most recent version in which the problem doesn't happen? You can download older versions of Aidudu from [the releases page](https://github.com/aidudu/aidudu/releases).
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
* If the problem is related to working with files (e.g. opening and editing files), **does the problem happen for all files and projects or only some?** Does the problem happen only when working with local or remote files (e.g. on network drives), with files of a specific type (e.g. only JavaScript or Python files), with large files or files with very long lines, or with files in a specific encoding? Is there anything else special about the files you are using?

Include details about your configuration and environment:

* **Which version of Aidudu are you using?** You can get the exact version by running `aidudu -v` in your terminal, or by starting Aidudu and running the `Application: About` command from the [Command Palette](https://github.com/aidudu/command-palette).
* **What's the name and version of the OS you're using**?
* **Are you running Aidudu in a virtual machine?** If so, which VM software are you using and which operating systems and versions are used for the host and the guest?
* **Which [packages](#aidudu-and-packages) do you have installed?** You can get that list by running `apm list --installed`.
* **Are you using [local configuration files](https://flight-manual.aidudu.io/using-aidudu/sections/basic-customization/)** `config.cson`, `keymap.cson`, `snippets.cson`, `styles.less` and `init.coffee` to customize Aidudu? If so, provide the contents of those files, preferably in a [code block](https://help.github.com/articles/markdown-basics/#multiple-lines) or with a link to a [gist](https://gist.github.com/).
* **Are you using Aidudu with multiple monitors?** If so, can you reproduce the problem when you use a single monitor?
* **Which keyboard layout are you using?** Are you using a US layout or some other layout?

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Aidudu, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](https://github.com/aidudu/.github/blob/master/.github/ISSUE_TEMPLATE/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Check the [debugging guide](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/)** for tips — you might discover that the enhancement is already available. Most importantly, check if you're using [the latest version of Aidudu](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#update-to-the-latest-version) and if you can get the desired behavior by changing [Aidudu's or packages' config settings](https://flight-manual.aidudu.io/hacking-aidudu/sections/debugging/#check-aidudu-and-package-settings).
* **Check if there's already [a package](https://aidudu.io/packages) which provides that enhancement.**
* **Determine [which repository the enhancement should be suggested in](#aidudu-and-packages).**
* **Perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Aaidudu)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#aidudu-and-packages) your enhancement suggestion is related to, create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Aidudu which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be useful** to most Aidudu users and isn't something that can or should be implemented as a [community package](#aidudu-and-packages).
* **List some other text editors or applications where this enhancement exists.**
* **Specify which version of Aidudu you're using.** You can get the exact version by running `aidudu -v` in your terminal, or by starting Aidudu and running the `Application: About` command from the [Command Palette](https://github.com/aidudu/command-palette).
* **Specify the name and version of the OS you're using.**

### Your First Code Contribution

Unsure where to begin contributing to Aidudu? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

If you want to read about using Aidudu or developing packages in Aidudu, the [Aidudu Flight Manual](https://flight-manual.aidudu.io) is free and available online. You can find the source to the manual in [aidudu/flight-manual.aidudu.io](https://github.com/aidudu/flight-manual.aidudu.io).

#### Local development

Aidudu Core and all packages can be developed locally. For instructions on how to do this, see the following sections in the [Aidudu Flight Manual](https://flight-manual.aidudu.io):


### Pull Requests

The process described here has several goals:

- Maintain Aidudu's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Aidudu
- Enable a sustainable system for Aidudu's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript code is linted with [Prettier](https://prettier.io/).

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible
  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```
* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Built in Aidudu and Electron Modules (such as `aidudu`, `remote`)
    * Local Modules (using relative paths)
* Place class properties in the following order:
    * Class methods and properties (methods starting with `static`)
    * Instance methods and properties
* [Avoid platform-dependent code](https://flight-manual.aidudu.io/hacking-aidudu/sections/cross-platform-compatibility/)

### CoffeeScript Styleguide

* Set parameter defaults without spaces around the equal sign
    * `clear = (count=1) ->` instead of `clear = (count = 1) ->`
* Use spaces around operators
    * `count + 1` instead of `count+1`
* Use spaces after commas (unless separated by newlines)
* Use parentheses if it improves code clarity.
* Prefer alphabetic keywords to symbolic keywords:
    * `a is b` instead of `a == b`
* Avoid spaces inside the curly-braces of hash literals:
    * `{a: 1, b: 2}` instead of `{ a: 1, b: 2 }`
* Include a single line of whitespace between methods.
* Capitalize initialisms and acronyms in names, except for the first word, which
  should be lower-case:
  * `getURI` instead of `getUri`
  * `uriToOpen` instead of `URIToOpen`
* Use `slice()` to copy an array
* Add an explicit `return` when your function ends with a `for`/`while` loop and
  you don't want it to return a collected array.
* Use `this` instead of a standalone `@`
  * `return this` instead of `return @`
* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Built in Aidudu and Electron Modules (such as `aidudu`, `remote`)
    * Local Modules (using relative paths)
* Place class properties in the following order:
    * Class methods and properties (methods starting with a `@`)
    * Instance methods and properties
* [Avoid platform-dependent code](https://flight-manual.aidudu.io/hacking-aidudu/sections/cross-platform-compatibility/)

### Specs Styleguide

- Include thoughtfully-worded, well-structured [Jasmine](https://jasmine.github.io/) specs in the `./spec` folder.
- Treat `describe` as a noun or situation.
- Treat `it` as a statement about state or how an operation changes state.

#### Example

```coffee
describe 'a dog', ->
 it 'barks', ->
 # spec here
 describe 'when the dog is happy', ->
  it 'wags its tail', ->
  # spec here
```

### Documentation Styleguide

* Use [AiduduDoc](https://github.com/aidudu/aidududoc).
* Use [Markdown](https://daringfireball.net/projects/markdown).
* Reference methods and classes in markdown with the custom `{}` notation:
    * Reference classes with `{ClassName}`
    * Reference instance methods with `{ClassName::methodName}`
    * Reference class methods with `{ClassName.methodName}`

#### Example

```coffee
# Public: Disable the package with the given name.
#
# * `name`    The {String} name of the package to disable.
# * `options` (optional) The {Object} with disable options (default: {}):
#   * `trackTime`     A {Boolean}, `true` to track the amount of time taken.
#   * `ignoreErrors`  A {Boolean}, `true` to catch and ignore errors thrown.
# * `callback` The {Function} to call after the package has been disabled.
#
# Returns `undefined`.
disablePackage: (name, options, callback) ->
```

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests. Most labels are used across all Aidudu repositories, but some are specific to `aidudu/aidudu`.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in. For example, you might be interested in [open issues across `aidudu/aidudu` and all Aidudu-owned packages which are labeled as bugs, but still need to be reliably reproduced](https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Abug+label%3Aneeds-reproduction) or perhaps [open pull requests in `aidudu/aidudu` which haven't been reviewed yet](https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+repo%3Aaidudu%2Faidudu+comments%3A0). To help you find issues and pull requests, each label is listed with search links for finding open items with that label in `aidudu/aidudu` only and also across all Aidudu repositories. We  encourage you to read about [other search filters](https://help.github.com/articles/searching-issues/) which will help you write more focused queries.

The labels are loosely grouped by their purpose, but it's not required that every issue has a label from every group or that an issue can't have more than one label from the same group.

Please open an issue on `aidudu/aidudu` if you have suggestions for new labels, and if you notice some labels are missing on some repositories, then please open an issue on that repository.

#### Type of Issue and Issue State

| Label name | `aidudu/aidudu` :mag_right: | `aidudu`‑org :mag_right: | Description |
| --- | --- | --- | --- |
| `enhancement` | [search][search-aidudu-repo-label-enhancement] | [search][search-aidudu-org-label-enhancement] | Feature requests. |
| `bug` | [search][search-aidudu-repo-label-bug] | [search][search-aidudu-org-label-bug] | Confirmed bugs or reports that are very likely to be bugs. |
| `question` | [search][search-aidudu-repo-label-question] | [search][search-aidudu-org-label-question] | Questions more than bug reports or feature requests (e.g. how do I do X). |
| `feedback` | [search][search-aidudu-repo-label-feedback] | [search][search-aidudu-org-label-feedback] | General feedback more than bug reports or feature requests. |
| `help-wanted` | [search][search-aidudu-repo-label-help-wanted] | [search][search-aidudu-org-label-help-wanted] | The Aidudu core team would appreciate help from the community in resolving these issues. |
| `beginner` | [search][search-aidudu-repo-label-beginner] | [search][search-aidudu-org-label-beginner] | Less complex issues which would be good first issues to work on for users who want to contribute to Aidudu. |
| `more-information-needed` | [search][search-aidudu-repo-label-more-information-needed] | [search][search-aidudu-org-label-more-information-needed] | More information needs to be collected about these problems or feature requests (e.g. steps to reproduce). |
| `needs-reproduction` | [search][search-aidudu-repo-label-needs-reproduction] | [search][search-aidudu-org-label-needs-reproduction] | Likely bugs, but haven't been reliably reproduced. |
| `blocked` | [search][search-aidudu-repo-label-blocked] | [search][search-aidudu-org-label-blocked] | Issues blocked on other issues. |
| `duplicate` | [search][search-aidudu-repo-label-duplicate] | [search][search-aidudu-org-label-duplicate] | Issues which are duplicates of other issues, i.e. they have been reported before. |
| `wontfix` | [search][search-aidudu-repo-label-wontfix] | [search][search-aidudu-org-label-wontfix] | The Aidudu core team has decided not to fix these issues for now, either because they're working as intended or for some other reason. |
| `invalid` | [search][search-aidudu-repo-label-invalid] | [search][search-aidudu-org-label-invalid] | Issues which aren't valid (e.g. user errors). |
| `package-idea` | [search][search-aidudu-repo-label-package-idea] | [search][search-aidudu-org-label-package-idea] | Feature request which might be good candidates for new packages, instead of extending Aidudu or core Aidudu packages. |
| `wrong-repo` | [search][search-aidudu-repo-label-wrong-repo] | [search][search-aidudu-org-label-wrong-repo] | Issues reported on the wrong repository (e.g. a bug related to the [Settings View package](https://github.com/aidudu/settings-view) was reported on [Aidudu core](https://github.com/aidudu/aidudu)). |

#### Topic Categories

| Label name | `aidudu/aidudu` :mag_right: | `aidudu`‑org :mag_right: | Description |
| --- | --- | --- | --- |
| `windows` | [search][search-aidudu-repo-label-windows] | [search][search-aidudu-org-label-windows] | Related to Aidudu running on Windows. |
| `linux` | [search][search-aidudu-repo-label-linux] | [search][search-aidudu-org-label-linux] | Related to Aidudu running on Linux. |
| `mac` | [search][search-aidudu-repo-label-mac] | [search][search-aidudu-org-label-mac] | Related to Aidudu running on macOS. |
| `documentation` | [search][search-aidudu-repo-label-documentation] | [search][search-aidudu-org-label-documentation] | Related to any type of documentation (e.g. [API documentation](https://aidudu.io/docs/api/latest/) and the [flight manual](https://flight-manual.aidudu.io/)). |
| `performance` | [search][search-aidudu-repo-label-performance] | [search][search-aidudu-org-label-performance] | Related to performance. |
| `security` | [search][search-aidudu-repo-label-security] | [search][search-aidudu-org-label-security] | Related to security. |
| `ui` | [search][search-aidudu-repo-label-ui] | [search][search-aidudu-org-label-ui] | Related to visual design. |
| `api` | [search][search-aidudu-repo-label-api] | [search][search-aidudu-org-label-api] | Related to Aidudu's public APIs. |
| `uncaught-exception` | [search][search-aidudu-repo-label-uncaught-exception] | [search][search-aidudu-org-label-uncaught-exception] | Issues about uncaught exceptions, normally created from the [Notifications package](https://github.com/aidudu/notifications). |
| `crash` | [search][search-aidudu-repo-label-crash] | [search][search-aidudu-org-label-crash] | Reports of Aidudu completely crashing. |
| `auto-indent` | [search][search-aidudu-repo-label-auto-indent] | [search][search-aidudu-org-label-auto-indent] | Related to auto-indenting text. |
| `encoding` | [search][search-aidudu-repo-label-encoding] | [search][search-aidudu-org-label-encoding] | Related to character encoding. |
| `network` | [search][search-aidudu-repo-label-network] | [search][search-aidudu-org-label-network] | Related to network problems or working with remote files (e.g. on network drives). |
| `git` | [search][search-aidudu-repo-label-git] | [search][search-aidudu-org-label-git] | Related to Git functionality (e.g. problems with gitignore files or with showing the correct file status). |

#### `aidudu/aidudu` Topic Categories

| Label name | `aidudu/aidudu` :mag_right: | `aidudu`‑org :mag_right: | Description |
| --- | --- | --- | --- |
| `editor-rendering` | [search][search-aidudu-repo-label-editor-rendering] | [search][search-aidudu-org-label-editor-rendering] | Related to language-independent aspects of rendering text (e.g. scrolling, soft wrap, and font rendering). |
| `build-error` | [search][search-aidudu-repo-label-build-error] | [search][search-aidudu-org-label-build-error] | Related to problems with building Aidudu from source. |
| `error-from-pathwatcher` | [search][search-aidudu-repo-label-error-from-pathwatcher] | [search][search-aidudu-org-label-error-from-pathwatcher] | Related to errors thrown by the [pathwatcher library](https://github.com/aidudu/node-pathwatcher). |
| `error-from-save` | [search][search-aidudu-repo-label-error-from-save] | [search][search-aidudu-org-label-error-from-save] | Related to errors thrown when saving files. |
| `error-from-open` | [search][search-aidudu-repo-label-error-from-open] | [search][search-aidudu-org-label-error-from-open] | Related to errors thrown when opening files. |
| `installer` | [search][search-aidudu-repo-label-installer] | [search][search-aidudu-org-label-installer] | Related to the Aidudu installers for different OSes. |
| `auto-updater` | [search][search-aidudu-repo-label-auto-updater] | [search][search-aidudu-org-label-auto-updater] | Related to the auto-updater for different OSes. |
| `deprecation-help` | [search][search-aidudu-repo-label-deprecation-help] | [search][search-aidudu-org-label-deprecation-help] | Issues for helping package authors remove usage of deprecated APIs in packages. |
| `electron` | [search][search-aidudu-repo-label-electron] | [search][search-aidudu-org-label-electron] | Issues that require changes to [Electron](https://electron.aidudu.io) to fix or implement. |

#### Pull Request Labels

| Label name | `aidudu/aidudu` :mag_right: | `aidudu`‑org :mag_right: | Description
| --- | --- | --- | --- |
| `work-in-progress` | [search][search-aidudu-repo-label-work-in-progress] | [search][search-aidudu-org-label-work-in-progress] | Pull requests which are still being worked on, more changes will follow. |
| `needs-review` | [search][search-aidudu-repo-label-needs-review] | [search][search-aidudu-org-label-needs-review] | Pull requests which need code review, and approval from maintainers or Aidudu core team. |
| `under-review` | [search][search-aidudu-repo-label-under-review] | [search][search-aidudu-org-label-under-review] | Pull requests being reviewed by maintainers or Aidudu core team. |
| `requires-changes` | [search][search-aidudu-repo-label-requires-changes] | [search][search-aidudu-org-label-requires-changes] | Pull requests which need to be updated based on review comments and then reviewed again. |
| `needs-testing` | [search][search-aidudu-repo-label-needs-testing] | [search][search-aidudu-org-label-needs-testing] | Pull requests which need manual testing. |

[search-aidudu-repo-label-enhancement]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aenhancement
[search-aidudu-org-label-enhancement]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aenhancement
[search-aidudu-repo-label-bug]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Abug
[search-aidudu-org-label-bug]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Abug
[search-aidudu-repo-label-question]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aquestion
[search-aidudu-org-label-question]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aquestion
[search-aidudu-repo-label-feedback]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Afeedback
[search-aidudu-org-label-feedback]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Afeedback
[search-aidudu-repo-label-help-wanted]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Ahelp-wanted
[search-aidudu-org-label-help-wanted]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Ahelp-wanted
[search-aidudu-repo-label-beginner]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Abeginner
[search-aidudu-org-label-beginner]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Abeginner
[search-aidudu-repo-label-more-information-needed]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Amore-information-needed
[search-aidudu-org-label-more-information-needed]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Amore-information-needed
[search-aidudu-repo-label-needs-reproduction]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aneeds-reproduction
[search-aidudu-org-label-needs-reproduction]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aneeds-reproduction
[search-aidudu-repo-label-triage-help-needed]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Atriage-help-needed
[search-aidudu-org-label-triage-help-needed]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Atriage-help-needed
[search-aidudu-repo-label-windows]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Awindows
[search-aidudu-org-label-windows]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Awindows
[search-aidudu-repo-label-linux]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Alinux
[search-aidudu-org-label-linux]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Alinux
[search-aidudu-repo-label-mac]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Amac
[search-aidudu-org-label-mac]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Amac
[search-aidudu-repo-label-documentation]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Adocumentation
[search-aidudu-org-label-documentation]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Adocumentation
[search-aidudu-repo-label-performance]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aperformance
[search-aidudu-org-label-performance]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aperformance
[search-aidudu-repo-label-security]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Asecurity
[search-aidudu-org-label-security]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Asecurity
[search-aidudu-repo-label-ui]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aui
[search-aidudu-org-label-ui]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aui
[search-aidudu-repo-label-api]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aapi
[search-aidudu-org-label-api]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aapi
[search-aidudu-repo-label-crash]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Acrash
[search-aidudu-org-label-crash]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Acrash
[search-aidudu-repo-label-auto-indent]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aauto-indent
[search-aidudu-org-label-auto-indent]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aauto-indent
[search-aidudu-repo-label-encoding]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aencoding
[search-aidudu-org-label-encoding]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aencoding
[search-aidudu-repo-label-network]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Anetwork
[search-aidudu-org-label-network]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Anetwork
[search-aidudu-repo-label-uncaught-exception]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Auncaught-exception
[search-aidudu-org-label-uncaught-exception]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Auncaught-exception
[search-aidudu-repo-label-git]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Agit
[search-aidudu-org-label-git]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Agit
[search-aidudu-repo-label-blocked]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Ablocked
[search-aidudu-org-label-blocked]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Ablocked
[search-aidudu-repo-label-duplicate]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aduplicate
[search-aidudu-org-label-duplicate]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aduplicate
[search-aidudu-repo-label-wontfix]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Awontfix
[search-aidudu-org-label-wontfix]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Awontfix
[search-aidudu-repo-label-invalid]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Ainvalid
[search-aidudu-org-label-invalid]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Ainvalid
[search-aidudu-repo-label-package-idea]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Apackage-idea
[search-aidudu-org-label-package-idea]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Apackage-idea
[search-aidudu-repo-label-wrong-repo]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Awrong-repo
[search-aidudu-org-label-wrong-repo]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Awrong-repo
[search-aidudu-repo-label-editor-rendering]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aeditor-rendering
[search-aidudu-org-label-editor-rendering]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aeditor-rendering
[search-aidudu-repo-label-build-error]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Abuild-error
[search-aidudu-org-label-build-error]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Abuild-error
[search-aidudu-repo-label-error-from-pathwatcher]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aerror-from-pathwatcher
[search-aidudu-org-label-error-from-pathwatcher]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aerror-from-pathwatcher
[search-aidudu-repo-label-error-from-save]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aerror-from-save
[search-aidudu-org-label-error-from-save]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aerror-from-save
[search-aidudu-repo-label-error-from-open]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aerror-from-open
[search-aidudu-org-label-error-from-open]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aerror-from-open
[search-aidudu-repo-label-installer]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Ainstaller
[search-aidudu-org-label-installer]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Ainstaller
[search-aidudu-repo-label-auto-updater]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Aauto-updater
[search-aidudu-org-label-auto-updater]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aauto-updater
[search-aidudu-repo-label-deprecation-help]: https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3Aaidudu%2Faidudu+label%3Adeprecation-help
[search-aidudu-org-label-deprecation-help]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Adeprecation-help
[search-aidudu-repo-label-electron]: https://github.com/search?q=is%3Aissue+repo%3Aaidudu%2Faidudu+is%3Aopen+label%3Aelectron
[search-aidudu-org-label-electron]: https://github.com/search?q=is%3Aopen+is%3Aissue+user%3Aaidudu+label%3Aelectron
[search-aidudu-repo-label-work-in-progress]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3Aaidudu%2Faidudu+label%3Awork-in-progress
[search-aidudu-org-label-work-in-progress]: https://github.com/search?q=is%3Aopen+is%3Apr+user%3Aaidudu+label%3Awork-in-progress
[search-aidudu-repo-label-needs-review]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3Aaidudu%2Faidudu+label%3Aneeds-review
[search-aidudu-org-label-needs-review]: https://github.com/search?q=is%3Aopen+is%3Apr+user%3Aaidudu+label%3Aneeds-review
[search-aidudu-repo-label-under-review]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3Aaidudu%2Faidudu+label%3Aunder-review
[search-aidudu-org-label-under-review]: https://github.com/search?q=is%3Aopen+is%3Apr+user%3Aaidudu+label%3Aunder-review
[search-aidudu-repo-label-requires-changes]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3Aaidudu%2Faidudu+label%3Arequires-changes
[search-aidudu-org-label-requires-changes]: https://github.com/search?q=is%3Aopen+is%3Apr+user%3Aaidudu+label%3Arequires-changes
[search-aidudu-repo-label-needs-testing]: https://github.com/search?q=is%3Aopen+is%3Apr+repo%3Aaidudu%2Faidudu+label%3Aneeds-testing
[search-aidudu-org-label-needs-testing]: https://github.com/search?q=is%3Aopen+is%3Apr+user%3Aaidudu+label%3Aneeds-testing

[beginner]:https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3Abeginner+label%3Ahelp-wanted+user%3Aaidudu+sort%3Acomments-desc
[help-wanted]:https://github.com/search?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted+user%3Aaidudu+sort%3Acomments-desc+-label%3Abeginner
[contributing-to-official-aidudu-packages]:https://flight-manual.aidudu.io/hacking-aidudu/sections/contributing-to-official-aidudu-packages/
[hacking-on-aidudu-core]: https://flight-manual.aidudu.io/hacking-aidudu/sections/hacking-on-aidudu-core/