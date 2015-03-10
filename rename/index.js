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

    this.argument('old-element-name', {
      desc: 'Current element name.',
      required: true,
    });

    this.argument('new-element-name', {
      desc: 'New element name',
      required: true,
    });

    this.option('rename-github-repo', {
      desc: 'Rename github repository',
      defaults: false,
    });



  },
  validate: function () {
    this.elementName = this['old-element-name'];
    this.newElementName = this['new-element-name'];
    if (this.elementName.indexOf('-') === -1) {
      this.emit('error', new Error(
        'Element name must contain a dash "-"\n' +
        'ex: yo thelma:seed my-element'
      ));
    }
  },

  // checkForDanger: function () {
  //   var done = this.async();

  //   // Because the element installs its dependencies as siblings, we want to
  //   // make it clear to the user that it is potentially dangerous to generate
  //   // their element from workspace containing other directories.
  //   var entries = this.expand('*');
  //   var bowerEntries = _.map(this.expand('*/bower.json'), path.dirname);
  //   var nonComponents = _.difference(entries, bowerEntries);

  //   // Whew, everything looks like a bower component!
  //   if (nonComponents.length === 0) {
  //     done();
  //     return;
  //   }

  //   console.warn(
  //     'You are generating your element in a workspace that appears to contain data\n' +
  //     'other than web components. This is potentially dangerous, as your element\'s\n' +
  //     'dependencies will be installed in the current directory. Bower will\n' +
  //     'overwrite any conflicting directories.\n'
  //   );

  //   var prompts = [{
  //     name: 'livesDangerously',
  //     message: 'Are you ok with that?',
  //     default: 'no',
  //   }];

  //   this.prompt(prompts, function (props) {
  //     if (props.livesDangerously[0] !== 'n') {
  //       done();
  //     }
  //   }.bind(this));
  // },
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
    },
    {
      name: 'replaceTH',
      type: 'input',
      message: 'Do you want all the th-* refrences to be updated as well? (yes/no)',
      default: 'yes'
    }
    ];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      done();
    }.bind(this));
  },
  rename: function () {

         // this.sourceRoot(this.elementName);
          this.destinationRoot(this.elementName);


      var newPathPrefix = this.newElementName+'/',
          oldPathPrefix = this.elementName+'/',
          fileList = [
            {src: 'demo.html', dest: 'demo.html', checkContent: true},
            {src: 'bower.json', dest: 'bower.json', checkContent: true},
            {src: 'README.md', dest: 'README.md', checkContent: true},

            {src: this.elementName+'.css', dest: this.newElementName+'.css'},

            {src: this.elementName+'.html', dest: this.newElementName+'.html', checkContent: true},

            {src: 'test/index.html', dest: 'test/index.html', checkContent: true},
            {src: 'test/'+this.elementName+'.html', dest: 'test/'+this.newElementName+'.html', checkContent: true},
          ];

      fileList.forEach(function(fileItem) {

        var path   =   fileItem.src,
            newPath = '../' + newPathPrefix + fileItem.dest,
            processFunction = null;

        console.log(path, newPath);



        if(fileItem.checkContent) {
          processFunction = function(content) {
                var re = new RegExp(this.elementName,"g");
                var newContent = content.toString().replace(re, this.newElementName);
                //console.log('\n ----- NEW CONTENT----',newContent);
                return newContent;

          }.bind(this);
        }
        if(this.fs.exists(path)) {

          this.fs.copy(path, newPath, processFunction ? {process: processFunction} : {});

        }

        




      }.bind(this));
      

   
  }


});



module.exports = ThelmaGenerator;