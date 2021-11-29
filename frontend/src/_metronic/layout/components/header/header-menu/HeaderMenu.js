/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from 'react';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import { checkIsActive } from '../../../../_helpers';
import { Button, Card } from 'react-bootstrap';
import AddIcon from '@material-ui/icons/Add';
import { Divider } from '@material-ui/core';

export function HeaderMenu({ layoutProps }) {
  const location = useLocation();

  const getMenuItemActive = (url) => {
    return checkIsActive(location, url) ? 'menu-item-active' : '';
  };

  return (
    <div
      id='kt_header_menu'
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}
    >
      {/*begin::Header Nav*/}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup='true'
          className={`menu-item menu-item-submenu menu-item-rel `}>
          <NavLink className='menu-link menu-toggle' to='/custom'>
            <span className='menu-text'>Workspaces</span>
            <i className='menu-arrow' />
          </NavLink>
          <div className='menu-submenu w-auto bg-light'>
            <Card style={{ width: '20rem' }}>
              <Card.Body>
                <Card.Title>Workspace</Card.Title>
                <Card.Text><Divider/></Card.Text>
                <Card.Text>
                  //TODO: fetch workspaces
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup='true'
          className={`menu-item menu-item-submenu menu-item-rel `}>
          <NavLink className='menu-link menu-toggle' to='/custom'>
            <span className='menu-text'>Starred</span>
            <i className='menu-arrow' />
          </NavLink>
          <div className='menu-submenu w-auto bg-light'>
            <Card style={{ width: '20rem' }}>
              <Card style={{ width: '20rem' }}>
                <Card.Body>
                  <Card.Title>Workspace</Card.Title>
                  <Card.Text><Divider/></Card.Text>
                  <Card.Text>
                    //TODO: fetch starred boards
                  </Card.Text>
                </Card.Body>
              </Card>
            </Card>
          </div>
        </li>

        {/*begin::level1*/}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup='true'
          className={`menu-item menu-item-submenu menu-item-rel ml-3`}>
          <Button className='menu-link menu-toggle ' to='/custom'>
            <span className='menu-text'>Create</span>
            <AddIcon className="ml-2" color={"#ffffff"}/>
          </Button>
          <div className='menu-submenu w-auto bg-light'>
            <Card style={{ width: '20rem' }}>
              <Card style={{ width: '20rem' }}>
                <Card.Body>
                  <Card.Title>Workspace</Card.Title>
                  <Card.Text><Divider/></Card.Text>
                  <Card.Text>
                    //TODO: create workspace, board options
                  </Card.Text>
                </Card.Body>
              </Card>
            </Card>
          </div>
        </li>
        {/*end::level1*/}

      </ul>
      {/*end::Header Nav*/}
    </div>
  );
}
