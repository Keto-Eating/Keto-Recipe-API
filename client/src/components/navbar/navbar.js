import React, { Component } from 'react'

import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap';
import './navbar.css'

class Nav extends Component {
	render() {
		return (
			<div className='navbar-container'>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Keto</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
					{/* <Navbar.Collapse> */}
            <Navbar.Form pullLeft>
              <FormGroup>
                <FormControl type="text" placeholder="Search" />
              </FormGroup>{' '}
              <Button type="submit">Submit</Button>
            </Navbar.Form>
					{/* </Navbar.Collapse> */}
        </Navbar>
			</div>
		)
	}
}

export default Nav;
