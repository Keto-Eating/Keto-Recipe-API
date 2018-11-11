import React, { Component } from 'react'

import './navbar.css'

class Navbar extends Component {
	render() {
		return (
			<div className='navbar-container'>
				<h1 className='logo'>Keto Eating</h1>
        <div className='search-bar'>
          <input className='search-input'/>
          <button className='search-button'>seach</button>
        </div>
        <ul className='nav-links'>
          <li><button className='btn btn-submit'>signup</button></li>
          <li><button className='btn btn-submit'>login</button></li>
        </ul>
			</div>
		)
	}
}

export default Navbar;
