# Visual Reports of Models

![Platforms](https://img.shields.io/badge/platform-Windows|MacOS-lightgray.svg)
[![License](http://img.shields.io/:license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/overview/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](https://forge.autodesk.com/api/data-management-cover-page/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-red.svg)](https://forge.autodesk.com/api/model-derivative-cover-page/)
[![Viewer](https://img.shields.io/badge/Viewer-v7-blue.svg)](https://forge.autodesk.com/api/viewer-cover-page/)

## Thumbnail

![thumbnail](/thumbnail.png)

# Description

This sample application demonstrates how to extract models properties of Autodesk360/BIM360/Autodesk Construction Cloud (ACC) and generate a project dashboard. Also shows a nested view with 2d views of the model (if available). In the project tree of this sample, Autodesk360, BIM360 and ACC project are listed with different icons.

   <p align="center"><img src="/project_icon.png" width="200" ></p> 

This sample is based on the Learn [Forge tutorials](https://learnforge.autodesk.io/#/tutorials/viewhubmodels) in the section *View BIM 360 models* and *Dashboard*. The original implementation was based on [Jim Awe - LMVNavTest](https://github.com/JimAwe/LmvNavTest) (Depracated).

## Live version

[https://visualreports.autodesk.io](https://visualreports.autodesk.io/)


# Setup

## Prerequisites

1. **BIM 360 or ACC Account**: must be Account Admin to add the app integration. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps).
2. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). 
3. **Visual Code** or any other text-based tool.
4. **JavaScript** basic knowledge with **jQuery**.
5. [NodeJS](https://nodejs.org).

### Run locally

Install [NodeJS](https://nodejs.org).

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/autodesk-forge/forge-visualreports

To run it, install the required packages, set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    export FORGE_CALLBACK_URL=<<YOUR CALLBACK URL FROM FORGE DEVELOPER PORTAL>>
    npm run dev

Windows (use <b>Node.js command line</b> from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    set FORGE_CALLBACK_URL=<<YOUR CALLBACK URL FROM FORGE DEVELOPER PORTAL>>
    npm run dev

Open the browser: [http://localhost:3000](http://localhost:3000).

**Important:** do not use **npm start** locally, this is intended for PRODUCTION only with HTTPS (SSL) secure cookies.

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Watch [this video](https://www.youtube.com/watch?v=Oqa9O20Gj0c) on how deploy samples to Heroku.


## Packages used

All Autodesk Forge NPM packages are included by default, see complete list of what's available at [NPM website](https://www.npmjs.com/browse/keyword/autodesk). OAuth, Model Derivative and OSS are used. Some other non-Autodesk packaged are used, including [express](https://www.npmjs.com/package/express) and its session/cookie middlewares ([express-session](https://www.npmjs.com/package/express-session) and [cookie-parser](https://www.npmjs.com/package/cookie-parser)) for user session handling. The front-end uses [bootsrap](https://www.npmjs.com/package/bootstrap) and [jquery](https://www.npmjs.com/package/jquery).

## Tips & tricks

For local development/testing, consider use [nodemon](https://www.npmjs.com/package/nodemon) package, which auto restart your node application after any modification on your code. To install it, use:

    sudo npm install -g nodemon

Then, instead of <b>npm run dev</b>, use the following:

    npm run nodemon

Which executes **nodemon ./start.js**.  The flag option **--ignore www/** indicates that the app should not restart if files under specific folder (such as **www**) are modified.

## Further Reading

Documentation:

- [BIM 360 or ACC API Provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps)
- [Data Management API](https://developer.autodesk.com/en/docs/data/v2/overview/)
- [Viewer](https://developer.autodesk.com/en/docs/viewer/v7)

Tutorials:

- [View BIM 360 or ACC Models](http://learnforge.autodesk.io/#/tutorials/viewhubmodels)

Blogs:

- [Forge Blog](https://forge.autodesk.com/categories/bim-360-api)
- [Field of View](https://fieldofviewblog.wordpress.com/), a BIM focused blog
- [Autodesk Construction Cloud Unified Products: Does it Affect My Application?](https://forge.autodesk.com/blog/autodesk-construction-cloud-unified-products-does-it-affect-my-application)
- [Autodesk Build and Other Autodesk Construction Cloud Unified Products Launch](https://forge.autodesk.com/blog/autodesk-build-and-other-autodesk-construction-cloud-unified-products-launch)

## Troubleshooting

1. **Cannot see my BIM 360 or ACC projects**: Make sure to provision the Forge App Client ID within the BIM 360 or ACC Account, [learn more here](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). This requires the Account Admin permission.

2. **Cannot load Autodesk360 model**: In Autodesk360, the model is not translated by default until the end user loads the model one time in Autodesk360, or the developer posts job to translate. 

3. **error setting certificate verify locations** error: may happen on Windows, use the following: `git config --global http.sslverify "false"`

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by


Jaime Rosales D. <br /> 
[![Twitter Follow](https://img.shields.io/twitter/follow/afrojme.svg?style=social&label=Follow)](https://twitter.com/AfroJme) <br />Forge Partner Development <br />
<a href="http://developer.autodesk.com/">Forge Developer Portal</a> <br />