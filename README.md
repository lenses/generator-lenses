# Yeoman generator for Thelma components

## Introduction

Thelma web components are built using the [Polymer](http://www.polymer-project.org/) library. The project allows developers to retreive, manipulate and visualize data by chaining these components together. 

`generator-thelma` provides Thelma component scaffolding using [Yeoman](http://yeoman.io) (a scaffolding tool for the web), letting you easily create and customize Thelma (custom) elements via the command-line and import them using HTML Imports. This saves you time writing boilerplate code so you can start writing up the logic to your components straight away.

## Features
* Sub-generator to create Thelma elements for your app

## Installation

Install the generator
`npm install -g generator-thelma`

Make a new directory and cd into it
`mkdir -p my-project && cd $_`

Generate a new Thelma component:
`yo thelma:seed [element-name]`

## Generators

Available generators:

- [thelma:lenses](#lenses)
- [thelma:seed](#seed)
- [thelma:gh](#gh)

**Note: Generators are to be run from the root of your app**

### Lenses
Generates the Lens Composer and the components that can be used with Lenses. Coming soon. 

### Seed
Generates a reusable Thelma element. 

The seed-element generator will construct a new element _and_ its directory for
you. Be aware: all bower dependencies will be installed as _siblings_ of the
newly generated element. Make sure that you generate the seed element within a
directory that is intended to contain multiple components!

Example:
```bash
mkdir -p components && cd $_
yo thelma:seed my-element
```

### Gh
Generates a Github pages branch for your [seed-element](#seed).

Example:
```bash
cd components/my-element
yo thelma:gh
```

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
