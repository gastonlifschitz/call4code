# HospitAlly

[![License](https://img.shields.io/badge/License-Apache2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Slack](https://img.shields.io/badge/Join-Slack-blue)](https://callforcode.org/slack) [![Website](https://img.shields.io/badge/View-Website-blue)](https://code-and-response.github.io/Project-Sample/)

This is a GitHub repository for the IBM Agentina Innovation Team Call 4 Code 2020 edition (IBM Internal competition).

## Contents

1. [Short description](#short-description)
1. [Demo video](#demo-video)
1. [The architecture](#the-architecture)
1. [Long Description](#synopsis)
1. [Project roadmap](#project-roadmap)
1. [Getting started](#getting-started)
1. [Prototype (Live demo)](#live-demo)
1. [Built with](#built-with)
1. [Versioning](#versioning)
1. [Authors](#authors)
1. [License](#license)
1. [Acknowledgments](#acknowledgments)

## Short description

### What's the problem?

Institutions all around the world have reported problems gathering accurate metrics of critical health resources, such as beds available at a site, available medical staff (doctors, nurses, and so forth) or respirators. To have this information available quickly and accurately is of paramount importance to health institutions public or private and to the governments.
In order to be able to efficiently and securely manage their health systems and prevent collapse so that each individual patient of COVID-19 can be treated properly.

### How can technology help?

A lot of time is spent gathering information, usually involving administrative staff moving information from notes to a spreadsheet to a database. Particularly in poor countries and remote sites where advanced technology isn't readily available. The available technology that is omnipresent in everyday life, such as smartphones, tablets, and other mobile devices, and provide enormous help in regards to data gathering in case of an epidemic or any other disaster palliative initiative.

### The idea

It's of critical importance to be able to gather information related to available resources and track its usage to get efficient use of them. Providing an easy to use application that can be quickly deployed and easily executed on any mobile device will enable local authorities in providing an improved health service to their communities, particularly at times when resources are scarce.

#### Key Features

- Cloud Native, reduced cost through containerization & cloud standards adoption.
- Doesn't involve vendor lock-in. Fully developed with open-source technology.
- Doesn't require active internet to work. The application stores data locally and synchronizes when connection is available. Particularly important at sites with poor connectivity.
- Easy to use, designed with modern UX/UI standards for mobile (Tablet and smartphones).
- Web based, works with both iOS and Android. Tested on Chrome, Firefox and Safari.

## Demo video

[Watch the video on youtube](https://www.youtube.com/watch?v=NInn6n9qOgc)

## Long Description

In this pandemic situation, hotels, university dormitories, convention centers, gymnasiums, stadiums and so many other non-medical centers are turning into field hospitals, as medical centers are stressed and over its capacity. In this context, keeping track of patients, staff and supplies is both - problematic and essential - at the same time. Having accurate and trustable data in the exact moment is once again the key to take better decisions and provide a fast response.

This information is more important than ever to keep the situation under control and provide better care and support to the community.
This is where the HospitAlly can help. It is a simple and easily deployable solution that can help health centers to have a better knowledge of the resources they can count on.
The app has an Inspection module where the user will indicate the supplies inventory, staff attendance and patients per hospital, floor level and/or room.

The inspection itself does not require internet connection; so you can walk through the entire health center without worrying about data loss. The inspection data is stored locally in your device and it will be automatically sent to the server once your connection is restored.
The supervisor will be able to see one or all hospitals’ real-time status in a Visual Dashboard. This will allow the supervisor to have control of one or more hospitals at a glance. Summarized information as well as a color-coded alert system will simplify the status monitoring and decision taking.
Our roadmap includes e-mail alerts and push notifications when critical levels are reached so the supervisor can take action immediately and historical statistics.

HospitAlly’s main advantage is its flexibility. The app administrator can create new users and hospitals in the Management module; but also customize the supplies, the bed types, the staff… all the inspected items can be fully modified to fulfill to your needs.
We have developed HospitAlly to be fully responsive, so you can use it from a computer, tablet, TV or phone.

We also know that time is critical – medical NGOs usually build field hospitals really quickly; so we have containerized HospitAlly so you can deploy to IBM Cloud and have it up and running in less than a day.
Our commitment is not just with the health system; but also with the community. That’s why our roadmap includes geolocation and AI features related so people being addressed to the nearest available center, emergency supplies reallocation and more.
We help you to manage your hospital, so you can focus on what is really important. You have an ally. This is HospitAlly.

## The architecture

![Video transcription/translation app](ha-arch.png)

The application is written entirely in Javascript, on the most popular programming languages in the world (if not the most popular). This is convenient so to facilitate adoption since it's easier to find JS programmers anywhere in the world. It uses the latest version of node.js for the backend, and react.js for the frontend making it very lightweight and performative.

It runs on a container so it can be executed on any Kubernetes orchestrator. We choose Openshift of its ease of use, strong scalability, and fault tolerance features. For the database, we choose to use MongoDB as a service, a no-SQL Database that is lighting fast and it is hosted on an external location to reduce single points of failures.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- node.js

You can get the latest version and install instructions [here](https://nodejs.org/en/).

On Mac, you can install with Homebrew

```zsh
brew install node
```

- MongoDB

You need a running instance of MongoDB in order to test or deploy the application. A cloud instance is preferred, you can get one [here](https://cloud.ibm.com/catalog/services/databases-for-mongodb), or you can install MongoDB on locally following the instructionns [here](https://docs.mongodb.com/manual/installation/).

If you are running Mac, alternativly, you can use Homebrew

```zsh
brew update
brew install mongodb
```

After installation is done, complete configuration by creating a db and settings permissions:

```zsh
mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

To start mongo simply excute `mongod` from a terminal.

### Installing

The following steps will guide you through the steps to get a development env running:

Open a terminal and clone this repository:

```zsh
git clone git@github.ibm.com:InnovationAndGrowth/call4code2020.git
```

Access the project's folder and install required packages with `NPM`:

```zsh
cd call4code2020/
/call4code> npm i
```

End with an example of getting some data out of the system or using it for a little demo

### Initial config

- The database requires an initial config with documents stating the types of information that will be stored. There are API available to submit such information that for the final product will be document with swagger, but for this prototype we provide document files that can be imported directly into your db instance via mongodb-compass or the mongoshell. These files are located in the `/samples` folder

The required types are

- user (i.e admin, supervisor)
- bed (i.e occupied, available)
- observations (i.e lack of time, unanswered)
- staff (i.e doctor, nurse)
- supply (i.e goggles, boots, camisole)
- patients (i.e critical, high, severe)

Also, an initial user needs to be created to be able to use the API, to do so, follow these steps:

- Temporary remove `auth` from post user to create initial user from `/server/routes/users.js`

```js
router.post("/", [val400(validate)], async (req, res) => {
    ...
});
```

- Create initial user by doing a `POST` call to `http://localhost:5000/api/users/` with a data body as shown below:

```json
{
  "name": "John Doe",
  "mail": "john.doe@hospital.com",
  "password": "12345678"
}
```

- You can test login doing a `POST` to `http://localhost:5000/api/auth/` with body:

```json
{
  "mail": "john.doe@hospital.com",
  "password": "12345678"
}
```

This is a sample response of sucess login:

```json
{
  "auth": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWU5MWZiMzQ0MTFmZDU0Mzk0ZTI4YTgiLCJuYW1lIjoiSk9ITiBET0UiLCJtYWlsIjoiam9obi5kb2VAaG9zcGl0YWwuY29tIiwiX2hvc3BpdGFsIjpbXSwiaXNBZG1pbiI6ZmFsc2UsImlzQWN0aXZlIjp0cnVlLCJpYXQiOjE1OTIzMzY1NjV9.8_etbbG3nVqODcw5OisK1j8kSi1Qo2XmcyxGbQ2OZIc"
}
```

## Project roadmap

The live demo in the next section is a fully functional prototype but isn't the final product. This is our current roadmap:

**NOTE** The current prototype doesn't include _automated testing_ (both unit and integration tests) and _js linting_ files, but they will be included in the main project.

![Roadmap](ha-roadmap.png)

## Live demo

You can find a running system to test at [https://hospitally.myinnovx.com/](https://hospitally.myinnovx.com/).

- user: **12345678**
- pass: **12345678**

<!-- ![Login](ha-main.png) -->

<img src="ha-main.png" alt="drawing" width="200" style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 30 px;"/>

You can also view the dashboard at [https://hospitally.myinnovx.com/dashboard](https://hospitally.myinnovx.com/dashboard). Keep in mind that for the final product we intend to use MongoDB Charts for improved statics, including geolocation information to aid supply among nearby locations.

![Dashboard](ha-dash.png)

You can also experience the mock up flow of our application in the following links:

- [Inspector view](https://www.figma.com/proto/OYrWCGoSHgo4My9iXdXKw4/Call4Code-HospitAlly?node-id=156%3A316&viewport=219%2C173%2C0.11949585378170013&scaling=scale-down)
- [Admin view](https://www.figma.com/proto/OYrWCGoSHgo4My9iXdXKw4/Call4Code-HospitAlly?node-id=173%3A301&viewport=355%2C-222%2C0.13062433898448944&scaling=scale-down)
- [Dashboard view](https://www.figma.com/proto/OYrWCGoSHgo4My9iXdXKw4/Call4Code-HospitAlly?node-id=146%3A357&viewport=166%2C332%2C0.1470886915922165&scaling=scale-down)

## Built with

- [node.js](https://nodejs.org/en/) - The backend runtime based on Javascript and built on Chrome's V8 engine.
- [React](https://reactjs.org/) - The web framework used for the UX
- [IBM Databases for MongoDB](https://cloud.ibm.com/catalog?search=mongodb#search_results) - The NoSQL database used
- [Red Hat OpenShift on IBM Cloud](https://cloud.ibm.com/catalog?search=openshift#search_results) - The containers platform for handling workload, scalability, resiliency and automation.
- [Figma](https://www.figma.com/) - The design and prototype framework.
- [Mongo DB Charts](https://www.mongodb.com/products/charts) - User for visualizations of MongoDB data (Not implemented during prototyping)

## Versioning

We use [IBM Enterprise Github](https://github.ibm.com/) for versioning. For the versions available, see the [tags on this repository](https://github.ibm.com/InnovationAndGrowth/call4code2020).

## Authors

- **Matias Salimbene** - _Initiative Lead & Sr. Dev_ - [msalimbe](https://github.ibm.com/msalimbe) - msalimbe@ar.ibm.com
- **Cecilia Bel** - _Architect_ - [belcecilia](https://github.ibm.com/belcecilia) - belcecilia@ar.ibm.com
- **Julieta Romero** - _UX Lead & Dev_ - [Julieta-Ayelen-Romero](https://github.ibm.com/Julieta-Ayelen-Romero) - julieta.ayelen.romero@ibm.com
- **Antonella Ovando** - _Full Stack Developer_ - [ovandoan](https://github.ibm.com/ovandoan) - ovandoan@ar.ibm.com
- **Gaston Lifschitz** - _Full Stack Developer_ - [Gaston-Lifschitz](https://github.ibm.com/Gaston-Lifschitz) - gaston.lifschitz@ibm.com
- **Gaston Kuracz** - _Full Stack Developer_ - [Gaston-Kuracz](https://github.ibm.com/Gaston-Kuracz) - gaston.kuracz@ibm.com

## License

This project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- The video has been developed by our great media specialists at the Innovation Team media: Veronica Casillo (veronica.casillo@ibm.com) and Sabrina Cinzer (sabrinacinzer@ibm.com)

- Icons made by [Icongeek26](https://www.flaticon.com/authors/icongeek26) from [www.flaticon.com](https://www.flaticon.com/).

- Based on [Billie Thompson's README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2).
