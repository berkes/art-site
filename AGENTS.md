# Portfolio site for art

## Context

This is a simple, static site to showcase my Generative art in a portfolio.
It follows a clean, simple design and focuses on the content.

## Tech stack

* Hugo. Documentation at [gohugo.io](https://gohugo.io/documentation/)
* Typescript compiled by hugo through esnext
* SCSS compiled by hugo
* Justfile. Use `just` to interact with the project
* Docker, used by `just` to run hugo. Dockerfile is for production builds and not relevant here.
* Github Actions that build docker images for production.

## Workflow

We go through tasks iteratively. 

Each iteration follows a strict set of steps:

- Re-read HTML, JS and CSS, to avoid overwriting changes by the user or by other agents.
- Find and list ways to achieve what we want. List it briefly in once sentence and add pros and cons.
- Wait for my input or more questions.
- I will tell what alternative we will choose, you implement that.
- Clean up the CSS, HTML and JS where appropriate: look for repetion, complexity or hardcoded values that can be replaced or removed.

Prefer simple, clean solutions. Simple is better. Avoid libraries, frameworks or other external code. Pull in any code, don't link to online resources like on cdns etc.

## Do-s and don't-s

* Do use just, fall back on docker, to run tasks and services.
* Do use skills, tools and MCPs over bash commands
* Do use simple, bash oneliners for exceptional tasks
* Do run a build with `just build` and then check the rendered HTML and/or other assets under `./public` to verify the HTML
* Do run a build to check what HTML structure is rendered for SCSS and TS setups

* Don't overwrite changes, as they may be made by the user or other agents. Stop and ask.
* Don't create scripts to perform tasks, except when explicitly told to do, or allowed to do.
* Don't overengineer. Simple is always better. Simple is not always easier.
* Don't put CSS and JS inside templates. These belong under assets only.

## SCSS

* Use SCSS skill.
* Organize by groups. Groups are: 
  * common - styling of individual html elements globally and definitions of variables.
  * layout - layout of the pages, including responsive layouts.
  * compontents - sections, elements, blocks distinguishable items.
  * pages - styling for a specific page or for an element on one specific page.
* Repetition is OK to achieve the grouping. E.g. styling for menu may occur in both layout - to achieve layout for the menu, and under "components" to style the menu.
* Override attributes in their components or per page. E.g. an "a" may get common styling but then needs different coloring in e.g. a menu so is override there.
* Use SCSS nesting.
