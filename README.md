# ToolsProject

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
----------------------------------
## Developers Comments
Project setup on local 
1. clone the project git clone <git Url >
2. npm install :- this command will download all the modules <node_modules>
3. ng server : this command will run the application

## Deployment to Github pages
1. Install the Angular CLI GitHub Pages deploy tool
npm install -g angular-cli-ghpages :  Run this command inside project to install Gihup pages deploy tool
2. Build your Angular app for production
ng build --configuration production --base-href "/Tools-Angular/" :  Run this command to build with base url Tools-Angular now it will build dist folder and inside that we will have tool-project and inside this browser and server and we need to deploy only browser which we will do next
3. Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/tools-project/browser

## Merging the feature branch to main and then deleting this branch
git checkout main -  Switch to main branch
git pull origin main - Pull the latest changes 
git merge <feature branch> - Merge feature branch into main
git push origin main -  Push the updated main branch to remote
git branch -d <feature branch> - Delete the policypages branch locally
git push origin --delete <feature branch> - Delete the policypages branch remotely



  
