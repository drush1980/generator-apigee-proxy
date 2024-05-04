const Generator = require('yeoman-generator');
const OptionOrPrompt = require('yeoman-option-or-prompt');
const path = require('path');
const validators = require('./validators.js');

module.exports = class extends Generator {
	// note: arguments and options should be defined in the constructor.
	constructor(args, opts) {
	   super(args, opts);
	   this.argument("name", { type: String, required: false });
	   this.argument("version", { type: String, required: false });
       this.argument("basePath", { type: String, required: false });       
	   this.argument("spec", { type: String, required: false });
	   this.argument("destination", { type: String, required: false });
	   this.optionOrPrompt = OptionOrPrompt;
	}

	async prompting() {
		this.answers = await this.optionOrPrompt([
			{
				type: 'input',
				name: 'name',
				message: "What is your proxy's name?",
				default: 'MockTarget',
				validate: validators.name
			},
			{
				type: 'input',
				name: 'version',
				message: "What is your proxy's version?",
				default: 'v1',
				validate: validators.version
			},
			{
				type: 'input',
				name: 'basePath',
				message: "What is your proxy's basePath?",
				default: '/v1/mock'
			},            
			{
				type: 'input',
				name: 'spec',
				message: "Please provide the path of your spec",
				default: 'https://raw.githubusercontent.com/apigee/api-platform-samples/master/default-proxies/helloworld/openapi/mocktarget3.0.yaml',
				validate: validators.spec
			},
			{
				type: 'input',
				name: 'destination',
				message: "Please provide the destination path of your proxy",
				default: '.'
			}
		]);
	}

    copySpec(){
        this.fs.copyTpl(
           this.answers.spec,
           this.destinationPath(`${this.answers.destination}/${this.answers.name}/openapi/spec.yaml`),
           {name : this.answers.name}
        );
        this.fs.commit(()=>{});
   }

    copyGoTemplates(){
        this.fs.copyTpl(
           this.templatePath('proxy-templates'),
           this.destinationPath(`${this.answers.destination}/${this.answers.name}/proxy-templates`),
           {name : this.answers.name}
        );
        this.fs.commit(()=>{});
   }

    copyConfigResources(){
	     this.fs.copyTpl(
	        this.templatePath('resources'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/resources`),
	        {name : this.answers.name}
	     );
	     this.fs.commit(()=>{});
    }

    copyTestTemplate(){
	     this.fs.copyTpl(
	        this.templatePath('tests'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/tests`),
	        {name : this.answers.name}
	     );
	     this.fs.commit(()=>{});
    }

    copyPomTemplate(){
	     this.fs.copyTpl(
	        this.templatePath('cloudbuild-pom.xml'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/cloudbuild-pom.xml`),
	        {name : this.answers.name, version: this.answers.version, basePath: this.answers.basePath, northboundDomain: this.answers.northboundDomain}
	     );
	     this.fs.commit(()=>{});
    }

    copyOtherTemplates(){
    	this.fs.copyTpl(
	        this.templatePath('cloudbuild.yaml'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/cloudbuild.yaml`),
	        {name : this.answers.name}
	     );
	     this.fs.copyTpl(
	        this.templatePath('gitignore.txt'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/.gitignore`),
	        {name : this.answers.name}
	     );
	     this.fs.copyTpl(
	        this.templatePath('README.md'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/README.md`),
	        {name : this.answers.name}
	     );
	     this.fs.commit(()=>{});
    }

    copyPackageJsonTemplate(){
	     this.fs.copyTpl(
	        this.templatePath('packagejson.txt'),
	        this.destinationPath(`${this.answers.destination}/${this.answers.name}/package.json`),
	        {name : this.answers.name, version: this.answers.version}
	     );
	     this.fs.commit(()=>{});
    }

    generateOattsTests(){
	    this.log('Generating tests...');
	    this.spawnCommandSync('oatts',
      		['generate', 
      			'-s', this.answers.spec,
      			'--scheme', 'https', 
      			'-w', `${this.answers.destination}/${this.answers.name}/tests/dev-integration`,
      			'--host', `api.acme.com${this.answers.basePath}`,
      			]);
      	this.log('Tests Generated');
    }
};