# Yeoman generator for Lenses components

## Introduction

Lenses web components are built using the [Polymer](http://www.polymer-project.org/) library. The project allows developers to retrieve, manipulate and visualize data by chaining these components together. 

`generator-lenses` provides Lenses component scaffolding using [Yeoman](http://yeoman.io) (a scaffolding tool for the web), letting you easily create and customize Lenses (custom) elements via the command-line and import them using HTML Imports. This saves you time writing boilerplate code so you can start writing up the logic to your components straight away.

## Features
* Sub-generator to create Lenses elements for your app
* Quick deploy to GitHub pages

## Installation

Install the generator
`npm install -g generator-lenses`

Make a new directory and cd into it
`mkdir -p my-project && cd $_`

Generate a new Lenses component:
`yo lenses:seed [element-name]`

## Generators

Available generators:

- [lenses:lenses](#lenses)
- [lenses:seed](#seed)
- [lenses:gh](#gh)

### Lenses
Generates the Lens Composer and the components that can be used with Lenses. Coming soon. 

### Seed
Generates a reusable Lenses element. 

The seed-element generator will construct a new element _and_ its directory for
you. Be aware: all bower dependencies will be installed as _siblings_ of the
newly generated element. Make sure that you generate the seed element within a
directory that is intended to contain multiple components!

Example:
```bash
mkdir -p components && cd $_
yo lenses:seed my-element
```

### Gh
Generates a Github pages branch for your [seed-element](#seed).

Example:
```bash
cd components/my-element
yo lenses:gh
```

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
