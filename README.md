# Flashcard Application

This repo holds a demo flashcard application.

The application has the following tech stack:

```java
Frontend:   React
API Layer:  Go + Gorillia/Mux
Backend:    MySQL 5.6
```

These 3 pieces of technology are presently driven by `docker-compose` but will eventually be converted to Kubernetes.

# Pre-Requisites

Since this application is designed to work with `docker-compose` you must install Docker and it's corresponding tool "docker-compose".

The following documentation from Docker can help with installation of both pieces of software:

<b>
<a href="https://docs.docker.com/get-docker/">Install Docker</a>


<a href="https://docs.docker.com/compose/install/">Install Docker-Compose</a>
</b>

# How-To Install

<details><summary>Step 1: Clone Repo & Build Docker Images</summary>
<p>

### Clone Repo & Build Docker Images

The following command will clone the repository to your local dev environment.

```bash
git clone https://github.com/excircle/flashcard_app.git
```
Once cloned, change directories into the folder called `dockerfiles` and build the <b>3 images</b> needed for the flashcard app.

```bash
cd dockerfiles
 2292  2021-01-04 17:04:21 sudo docker build -t flashcards/mysql57 flashcards_mysql57
 2304  2021-01-04 17:07:11 sudo docker build -t flashcards/goapi flashcards_goapi
 2319  2021-01-04 17:22:08 sudo docker build -t flashcards/frontend flashcards_frontend
```
</p>
</details>

# React Composition

### App

```babel
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

<details><summary>React.Fragment</summary>
<details><summary>Banner</summary>
<p>
  Banner Details
</p>
</details>
<details><summary>Menu</summary>
<p>
  Menu Details
</p>
</details>
<details><summary>Submit</summary>
<p>
  Submit Details
</p>
</details>
</details>
