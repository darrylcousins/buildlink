/**
 * @file Provides a `Parser` object for parsing (hopefully) csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Link } from 'react-router-dom'

export default () =>
  <div>
    <Link to="/single" className="fw6 mt0 mb1 link black-70 db" title="Parser">
      Buildlink csv parser and actions
      <div className="dib">
        <small className="nowrap ml1 mt2 mt3-ns pr2 black-70 fw2">
          (Update descriptions, calculate min/max, and other actions.)
        </small>
      </div>
    </Link>
    <Link to="/double" className="fw6 mt0 mb1 link black-70 db" title="Merge">
      Compare supplier csv with Buildlink and actions
      <div className="dib">
        <small className="nowrap ml1 mt2 mt3-ns pr2 black-70 fw2">
          (Update product codes, outers, prices, etc..)
        </small>
      </div>
    </Link>
  </div>
