Install
=======

The steps to get started.

Create a react starter app::

  $ cd .virtualenvs
  $ npx create-react-app work

Python virtual environment::

  $ cd work
  $ virtualenv -p python3 .
  $ source bin/activate

Install `nodeenv` into same directory and activate::

  $ pip install nodeenv
  $ nodeenv -p
  $ source bin/activate

With local `npm` install `react-router`::

  (work) $ npm install --save react-router react-router-dom

Install `react`/`apollo`/`graphql` stack::

  (work) $ npm install --save apollo-boost apollo-link-context react-apollo graphql-tag graphql

`react-form`::

  (work) $ npm install --save react-form

`font-awesome`::

  (work) $ npm install --save @fortawesome/fontawesome
  (work) $ npm install --save @fortawesome/react-fontawesome
  (work) $ npm install --save @fortawesome/fontawesome-free-solid
  (work) $ npm install --save @fortawesome/fontawesome-free-regular
  (work) $ npm install --save @fortawesome/fontawesome-free-brands


