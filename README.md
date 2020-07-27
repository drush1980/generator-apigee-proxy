# generator-apigee-proxy
An Apigee Proxy Yeoman generator

## License

This code is Copyright (c) 2017-2020 Google LLC, and is released under the
Apache Source License v2.0. For information see the [LICENSE](LICENSE) file.

## Disclaimer

This example is not an official Google product, nor is it part of an official Google product.

## Using the generator

- Install yeoman-generator `sudo npm install -g yo`
- Clone this repo `git clone https://github.com/ssvaidyanathan/generator-apigee-proxy.git`
- Execute `npm install`
- Execute `sudo npm install . -g`

This should install a new yo generator called "Apigee Proxy"

- Run `yo apigee-proxy` on your terminal to start the prompt
- Provide the details prompted
- After the generator is executed, the Proxy is created with all configurations, tests and build scripts

The generator does the following:
- Generate proxy from the spec (using openapi2apigee)
- Apply global policies (optional)
- update Basepath, Description, Virtual host, Target server
- Copy templates for configurations
- Generate tests from the spec (using oatts)

Once the folder is generated, you can run 
>`mvn clean install -P{profile} -Dusername={username} -Dpassword={password} -Dorg={org}` 
	
It executes the following: 
- Static Code Analysis
- Unit test
- Code Coverage
- Push configurations (KVM, Cache, Target Server, etc)
- Package and Deploy Proxy bundle
- Run integration tests