# rplace-concept - a crowd-sourced art project

This app lets any visitor paint a single pixel of a persistent image visible to anyone. Users can see who and when painted each of the pixels. CDK proof of concept inspired by r/place. Available on [GH Pages](https://tonypanczenko.github.io/rplace-concept/) and my portfolio page on [tonypanczenko.github.io](https://tonypanczenko.github.io/).

[![GitHub repo active](https://img.shields.io/badge/repo-active-brightgreen)](https://tonypanczenko.github.io/rplace-concept/)
[![GitHub last commit](https://img.shields.io/github/last-commit/tonypanczenko/rplace-concept-backend)](https://github.com/TonyPanczenko/rplace-concept-backend)
[![GitHub](https://img.shields.io/github/license/tonypanczenko/rplace-concept-backend)](https://github.com/TonyPanczenko/rplace-concept-backend/blob/production/LICENSE)
[![Maintained with renovate](https://img.shields.io/badge/maintained%20with-renovate-blue?logo=renovatebot)](https://renovatebot.com)

## Project Setup

```sh
npm install
```

### Compile Lambda functions source code into bundles

```sh
npm run build
```

### Compile Lambda functions, then deploy cloud resources on AWS

```sh
npm run deploy
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Useful CDK commands

* `cdk deploy`           deploy this stack to your default AWS account/region
* `cdk diff`             compare deployed stack with current state
* `cdk synth`            emits the synthesized CloudFormation template
