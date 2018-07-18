Install
=======

The steps to get started.

Create a react starter app::

  $ cd .virtualenvs
  $ npx create-react-app buildlink

Maybe it should all work by cloning this repository and then continue.

Python virtual environment::

  $ cd buildlink
  $ virtualenv -p python3 .
  $ source bin/activate

Install `nodeenv` into same directory and activate::

  $ pip install nodeenv
  $ nodeenv -p
  $ source bin/activate

With local `npm` install `react-router`::

  (buildlink) $ npm install --save react-router react-router-dom

Install `react`/`apollo`/`graphql` stack::

  (buildlink) $ npm install --save apollo-boost apollo-link-context react-apollo graphql-tag graphql

`react-form`::

  (buildlink) $ npm install --save react-form

`font-awesome`::

  (buildlink) $ npm install --save @fortawesome/fontawesome
  (buildlink) $ npm install --save @fortawesome/react-fontawesome
  (buildlink) $ npm install --save @fortawesome/fontawesome-free-solid
  (buildlink) $ npm install --save @fortawesome/fontawesome-free-regular
  (buildlink) $ npm install --save @fortawesome/fontawesome-free-brands

Using `PapaParse <https://www.papaparse.com/>`_ to handle csv files::

  (buildlink) $ npm install --save papaparse

Using `react-table <https://react-table.js.org>`_ to display data.::

  (buildlink) $ npm install --save react-table

Transitions::

  (buildlink) $ npm install --save react-transition-group

CSV helper::

  (buildlink) $ npm install --save react-csv

Modals::

  (buildlink) $ npm install --save react-modal
