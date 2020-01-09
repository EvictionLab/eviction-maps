# Contributing to the Eviction Lab maps and rankings

The following is a set of guidelines for contributing to the [Eviction Lab Maps](https://evictionlab.org/map).  The Eviction Lab Maps and Rankings tool is hosted and managed by [Hyperobjekt](https://hyperobjekt.com/). These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code Of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Packages in use](#packages-in-use)
  * [Application Structure](#application-structure)
  * [Data Retrieval and State Mutation](#data-retrieval-and-state-mutation)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Features](#suggesting-features)
  * [Making a Contribution](#making-a-contribution)
  * [Code Deployment](#code-deployment)

[Conventions and Styleguides](#conventions-and-styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [Angular Components](#angular-components)
  * [Styling and CSS](#styling-and-css)


## Code of Conduct

All project participants are expected to abide by the project [code of conduct](docs/CODE_OF_CONDUCT.md).

## What should I know before I get started?

The code in this repository is the front-end application consisting of the [eviction maps](https://evictionlab.org/map) and [eviction rankings](https://evictionlab.org/rankings).

### Packages In Use

The main libraries, frameworks, and services used in this project include:

  - Angular
  - [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/) (for base components)
  - [Mapbox](https://mapbox.com): provided map styles and vector tile hosting.
  - [MapboxGL](https://docs.mapbox.com/mapbox-gl-js/api/) (for map rendering)

The graph functionality in the eviction maps is provided by a custom graph module created for this project.

  - [angular-d3-graph](https://github.com/EvictionLab/angular-d3-graph): provides base functionality for rendering charts with SEDA data

Other repositories associated with this project are:
  - [EvictionLab/eviction-lab-etl](https://github.com/EvictionLab/eviction-lab-etl): ETL pipeline to process census and eviction data into tilesets and static data files.
  - [EvictionLab/angular-d3-graph](https://github.com/EvictionLab/angular-d3-graph): D3 graph used to render bar / line chart
  - [EvictionLab/eviction-lab-exports](https://github.com/EvictionLab/eviction-lab-exports): serverless functions for file exports
  - [EvictionLab/lambda-utils](https://github.com/EvictionLab/lambda-utils): server side lambda functions used in the project


### Application Structure

#### App Modules (`/src/app`)

App modules contain a grouped set of functionality.  This project is split into the following modules:

  * **Eviction Graphs Module** (`/src/app/eviction-graphs/`)

    contains the shared module used for graphs in the project, built using `angular-d3-graph` as a base.

  - **MapToolModule** (`/src/app/map-tool/`)
  
    contains the configuration, components, and services specific to the [eviction maps](https://evictionlab.org/map)

  - **RankingModule** (`/src/app/ranking/`)
  
    contains the components and services specific to the [eviction rankings tool](https://evictionlab.org/rankings)

  - **UI Module** (`/src/app/ui/`) 
  
    contains all of the shared UI components (presentational components) used in the project
  
  - **Services Module** (`/src/app/services`)
    
    contains all of the shared services used to provide data and handle events throughout the project (e.g. analytics, search, routing, loading, data retrieval, etc.)


#### Other Folders

  - `/src/environments`: contains settings relevant to the environment (dev, staging, prod) as well as versioning
  - `/src/theme`: universal styles for components in the project
  - `/src/assets`: contains the map style, English / Spanish language files, fonts and images


### Data Retrieval and State Mutation

#### Map Tool

Eviction and demographic data in the map tool is loaded from static vector tilesets (produced in the `eviction-lab-etl` repository).  All data retrieval and state mutation for the map tool is handled in `/src/app/map-tool/map-tool.service.ts`.

#### Eviction Rankings

Data for the eviction rankings is loaded from static CSV files (produced in the `eviction-lab-etl` directory). All data retrieval and state mutation for the map tool is handled in the Ranking Service (`/src/app/ranking/ranking.service.ts`).  

## How Can I Contribute?

### Reporting Bugs

If you have identified a bug in the Eviction Lab map or ranking tool, [create an issue](https://github.com/EvictionLab/eviction-maps/issues/new/choose) for the bug using the "Bug Report" template.

### Suggesting Features

This section guides you through submitting a new feature request for the Eviction Lab maps and rankings tool, including completely new features and minor improvements to existing functionality.

To suggest a new feature, [create an issue](https://github.com/EvictionLab/eviction-maps/issues/new/choose) for the bug using the "Feature Request" template.

### Making a Contribution

#### 1. Claim an issue
First assign yourself to the corresponding issue on the [issues page](https://github.com/EvictionLab/eviction-maps/issues).  

> Before development begins, the work item should have an issue that has been flagged for development.  If the work item is a new feature, it should have an approved spec outlining the functionality that will be developed and a wireframe showing what it will look like.

#### 2. Create a branch

When working on a contribution to the repository, you should always be working in a separate branch. 
Create a branch in your repository with a branch name based on what type of contribution is being made and a reference to the issue number.

  - **Feature**: `feature/issue-{ISSUE_ID}`
  - **Change**: `change/issue-{ISSUE_ID}`
  - **Fix**: `fix/issue-{ISSUE_ID}`

#### 3. Implement

Perform all of your development for the issue in your new branch following the outlined [conventions and style guides](#conventions-and-styleguides).

#### 4. Submit a pull request

Create a pull request of your branch to the working branch (`development`) when you have code that:

  - is ready to be merged into the code base
  - requires some review or have questions from another team member

If the feature or code is not ready, mark it with "WIP" (work in progress) in the title or as a label.

When the code is ready to be integrated assign someone on the team as a reviewer.

Before a pull request is approved it must meet the following requirements:
  - must pass linting, tests, or any other checks performed in Travis CI.
  - must have code used for debugging purposes removed (e.g. `console.log`) or handled in a way that it does not print to the console in a production environment
  - should follow [conventions and styleguides](#conventions-and-styleguides) established for the project, or provide reason for bypassing conventions 

Once the pull request is approved it can be merged into the working branch.


### Code Deployment

#### Lifecycle (git branching strategy)

When deploying new code to the tool, the code will proceed through the following steps:

  1. **Development**: the `development` branch contains the working copy of the current code base. Pull requests containing fixes, changes, and features are merged into this branch.  Once code is merged into this branch, a live copy can be viewed at dev.evictionlab.org (IN PROGRESS)
  3. **Staging**: when a new version of the working copy in the `development` branch is ready to be deployed (or a hotfix), it is merged into the `staging` branch.  a live copy of the code in the staging environment can be seen at staging.evictionlab.org
  4. **Production**: once the new version has been tested and approved on the staging site it is merged into the `production` branch.  code in the `production` branch is deployed to the live version of the map and rankings at evictionlab.org 

## Conventions and Styleguides

### Git Commit Messages

* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### Angular Components

When developing components, keep reusable presentational (visual) components in the UI Module (`/src/app/ui`) and container components bundled with the module they are relevant to.  (e.g. Map Legend bundled with Map Tool Module)

> **Presentational Components**<br />these components simply take data as input and know how to display it on the screen. They also can emit custom events. <br />[source](https://blog.angular-university.io/angular-component-design-how-to-avoid-custom-event-bubbling-and-extraneous-properties-in-the-local-component-tree/)

> **Container Components**<br />These components know how to retrieve data from the service layer. Note that the top-level component of a route is usually a Container Component, and that is why this type of components where originally named like that. <br /> [source](https://blog.angular-university.io/angular-component-design-how-to-avoid-custom-event-bubbling-and-extraneous-properties-in-the-local-component-tree/)

### Styling and CSS

  - if modifying the style of a base component provided by `ngx-bootstrap`, do so in the SCSS files in the `/src/theme` folder.
  - all component styles should be in a `.scss` file alongside the component typescript file.  you can import the `/src/theme.scss` to access common variables and mixins used for the project.
