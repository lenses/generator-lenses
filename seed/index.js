'use strict';
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var ThelmaGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('element-name', {
      desc: 'Tag name of the element and directory to generate.',
      required: true,
    });

    this.option('skip-install', {
      desc: 'Whether bower dependencies should be installed',
      defaults: false,
    });

    this.option('skip-install-message', {
      desc: 'Whether commands run should be shown',
      defaults: false,
    });

  },
  validate: function () {
    this.elementName = this['element-name'];
    if (this.elementName.indexOf('-') === -1) {
      this.emit('error', new Error(
        'Element name must contain a dash "-"\n' +
        'ex: yo thelma:seed my-element'
      ));
    }
  },
  checkForDanger: function () {
    var done = this.async();

    // Because the element installs its dependencies as siblings, we want to
    // make it clear to the user that it is potentially dangerous to generate
    // their element from workspace containing other directories.
    var entries = this.expand('*');
    var bowerEntries = _.map(this.expand('*/bower.json'), path.dirname);
    var nonComponents = _.difference(entries, bowerEntries);

    // Whew, everything looks like a bower component!
    if (nonComponents.length === 0) {
      done();
      return;
    }

    console.warn(
      'You are generating your element in a workspace that appears to contain data\n' +
      'other than web components. This is potentially dangerous, as your element\'s\n' +
      'dependencies will be installed in the current directory. Bower will\n' +
      'overwrite any conflicting directories.\n'
    );

    var prompts = [{
      name: 'livesDangerously',
      message: 'Are you ok with that?',
      default: 'no',
    }];

    this.prompt(prompts, function (props) {
      if (props.livesDangerously[0] !== 'n') {
        done();
      }
    }.bind(this));
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Thelma') + ' custom web component generator!'
    ));

    var prompts = [{
      name: 'ghUser',
      type: 'input',
      message: 'What is your GitHub username?',
      default: 'thelmanews'
    },{
      name: 'author',
      type: 'input',
      message: 'Name of author?',
      default: 'Thelma team'
    },{
      type: 'confirm',
      name: 'd3chart',
      message: 'Will your component require the D3 JavaScript library?',
      default: false
    },{
      type: 'confirm',
      name: 'animated',
      message: 'Will your component contain any animation?',
      default: false
    },{
      type: 'list',
      name: 'componentType',
      message: 'What type of component is this?',
      choices: [ 'input', 'transform', 'output' ]
    }];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      this.author = props.author;
      this.d3chart = props.d3chart;
      this.animated = props.animated;
      this.componentType = props.componentType;
      done();
    }.bind(this));
  },
  seed: function () {
    // Construct the element as a subdirectory.
    this.destinationRoot(this.elementName);    
    this.copy('_gitignore', '.gitignore');
    this.copy('_gitattributes', '.gitattributes');
    this.copy('_bowerrc', '.bowerrc');
    this.copy('_jshintrc', '.jshintrc');
    this.copy('_editorconfig', '.editorconfig');
    this.template('_wct.conf.js', 'wct.conf.js');
    this.template('_bower.json', 'bower.json');
    this.template('_README.md', 'README.md');
    this.template('_index.html', 'index.html');
    this.template('_test/_index.html', 'test/index.html');
    this.template('_test/_seed-element-basic.html',
                  'test/' + this.elementName + '-basic.html');
    this.template('_element-name.css', this.elementName + '.css');
    this.template('_element-name-'+this.componentType+'.html', this.elementName + '.html');
    this.template('_demo.html', 'demo.html');
  },

  install: function () {
    this.installDependencies({
      npm: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  }
});



module.exports = ThelmaGenerator;