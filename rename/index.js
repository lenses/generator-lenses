'use strict';
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var ncp = require('ncp');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');


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
    if (this.newElementName.indexOf('-') === -1) {
      this.emit('error', new Error(
        'New lement name must contain a dash "-"\n' +
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
      name: 'customReplace',
      type: 'input',
      message: 'Any blind string replace? (e.g. str1:str1New,str2:str2New)',
      default: 'th-data-utility:lens-u-data-utility,th-u-data-selector:lens-u-data-selector,th-container:lens-container'
    }];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      //this.replaceTHs = props.replaceTHs;

      var replaceItems = props.customReplace.split(',');
      this.replaceItems = replaceItems.map(function(item) {
        var segs = item.split(':');
        return {from: segs[0], to: segs[1]}
      });

      done();
    }.bind(this));
  },


  rename: function () {

         // this.sourceRoot(this.elementName);
         // this.destinationRoot(this.elementName);


      var newPathPrefix = this.newElementName+'/',
          oldPathPrefix = this.elementName+'/',
          fileList = [
            {src: 'demo.html', dest: 'demo.html', checkContent: true},
            {src: 'bower.json', dest: 'bower.json', checkContent: true},
            {src: 'README.md', dest: 'README.md', checkContent: true},
            {src: 'metadata.html', dest: 'metadata.html', checkContent: true},

            {src: this.elementName+'.css', dest: this.newElementName+'.css'},

            {src: this.elementName+'.html', dest: this.newElementName+'.html', checkContent: true},

            {src: 'test/index.html', dest: 'test/index.html', checkContent: true},
            {src: 'test/'+this.elementName+'.html', dest: 'test/'+this.newElementName+'.html', checkContent: true},
          ];

      fileList.forEach(function(fileItem) {

        var path   =   fileItem.src,
            newPath =  fileItem.dest,
            processFunction = null;

        console.log(path, newPath);



        if(fileItem.checkContent) {
          processFunction = function(content) {
                var re = new RegExp(this.elementName,'g'),
                contentStr = content.toString();

                var newContent = contentStr.replace(re, this.newElementName);

                this.replaceItems.forEach(function(replaceItem) {
                    var itemRe = new RegExp(replaceItem.from,'g');
                    newContent = newContent.replace(itemRe, replaceItem.to);

                });

                

                return newContent;

          }.bind(this);
        }
        if(this.fs.exists(path)) {

          this.fs.copy(path, newPath, processFunction ? {process: processFunction} : {});

        }

        




      }.bind(this));



   
  },

  gh: function () {
    var done = this.async();
    var src = this.sourceRoot();//path.join(__dirname, '');
    var dest = this.destinationRoot();//path.join(process.cwd());//, 'tmp-' + Date.now());

    console.log('src,dest ',src, dest);

    // work around weird timing issues with this.copy...
    ncp(src, dest, function (err) {
      if (err) {
        return this.log(err);
      }

      var gp = spawn('sh', ['git.sh', this.ghUser, this.elementName, this.newElementName], {cwd: dest});

      gp.stdout.on('data', function (data) {
        this.log(data.toString());
      }.bind(this));

      gp.stderr.on('data', function (data) {
        this.log(data.toString());
      }.bind(this));

      gp.on('close', function (code) {
        this.log('child process exited with code ' + code);
        rimraf.sync(dest);
        done();
      }.bind(this));
    }.bind(this));
  }  



});



module.exports = ThelmaGenerator;