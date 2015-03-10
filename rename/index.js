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
      name: 'replaceTHs',
      type: 'input',
      message: 'Do you want all the th-* refrences to be updated as well? (yes/no)',
      default: 'yes'
    }
    ];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      this.replaceTHs = props.replaceTHs;
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
                var re = new RegExp(this.elementName,'g'),
                contentStr = content.toString();

                var newContent = contentStr.replace(re, this.newElementName);

                /*
                if(this.replaceTHs) {
                  var thre = new RegExp('th-(:?[a-z0-9\-]+)','g'),
                      results = thre.exec(newContent);
                      console.log('results',  results ? results.length : 'no results');
                      if(results)
                      {
                        for(var i=0; i<results.length; i++) {
                            console.log('result ',results[i]);

                            var done = this.async();

                            var prompt = {name: results[i],
                                          type: 'input',
                                          message: 'Do you want ' + results[i],
                                          default: 'yes'};

                            this.prompt(prompt, function (props) {
                              console.log(props)
                              done();
      
                            }.bind(this));

                        }
                      }

                }
                */

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