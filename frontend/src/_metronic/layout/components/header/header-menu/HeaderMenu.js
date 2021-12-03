/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { checkIsActive } from '../../../../_helpers';
import { Card } from 'react-bootstrap';
import AddIcon from '@material-ui/icons/Add';
import { Button, Divider, Typography } from '@material-ui/core';
import axios from 'axios';
import { BACKEND_ORIGIN } from '../../../../../config';

export const GET_WORKSPACES_URL = BACKEND_ORIGIN + 'api/v1/workspaces/';
export const GET_STARRED_BOARDS_URL = BACKEND_ORIGIN + 'api/v1/boards?starred=true';

export function HeaderMenu({ layoutProps }) {
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState([]);
  const [starredBoards, setStarredBoards] = useState([]);

  useEffect(() => {
    axios.get(GET_WORKSPACES_URL)
      .then(r => {
        console.log(r.data);
        let workspaces = r.data.map(({id, logo, name}) => ({id, logo, name}));
        setWorkspaces(workspaces);
      })
      .catch(e => {
        console.log(e);
      });
    axios.get(GET_STARRED_BOARDS_URL)
      .then(r => {
        console.log(r.data);
        // TODO
        // let starredBoards = r.data.map(({}) => ({}));
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

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
            <Card style={{ width: '25rem' }}>
              <Card.Header>
                <Typography variant={"h6"} align={'center'} >Workspaces</Typography>
              </Card.Header>
              <Card.Body>
                <p className={'text-black-50 font-size-lg mb-1'}>Your workspaces</p>
                {
                  workspaces.map((w, key) => (
                    <Button
                      key={key}
                      // startIcon={<ArrowForwardIos style={{ fill: '#4960ab' }} />}
                      fullWidth
                      style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
                    >
                      <Link to={`/workspace/${w.id}`} className='navi-item cursor-pointer'>
                        <div className='text-dark font-size-lg cursor-pointer'>
                          {w.name}
                        </div>
                      </Link>
                    </Button>
                  ))
                }
                <p className={'text-black-50 font-size-lg mt-4 mb-1'}>Guest workspaces</p>
                {
                  workspaces.map((w, key) => (
                    <Button
                      key={key}
                      // startIcon={<ArrowForwardIos style={{ fill: '#4960ab' }} />}
                      fullWidth
                      style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
                    >
                      <Link to={`/workspace/${w.id}`} className='navi-item cursor-pointer'>
                        <div className='text-dark font-size-lg cursor-pointer'>
                          {w.name}
                        </div>
                      </Link>
                    </Button>
                  ))
                }
              </Card.Body>
            </Card>
          </div>
        </li>
      {/*  /!*end::1 Level*!/*/}

      {/*  /!*begin::1 Level*!/*/}
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
                  <Divider/><br/>
                  <Card.Text>
                    //TODO: fetch starred boards
                  </Card.Text>
                </Card.Body>
              </Card>
            </Card>
          </div>
        </li>

      {/*  /!*begin::level1*!/*/}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup='true'
          className={`menu-item menu-item-submenu menu-item-rel ml-3`}>
          <Button className='menu-link menu-toggle ' to='/custom'>
            <span className='menu-text'>Create</span>
            <AddIcon className="ml-2" htmlColor="#ffffff"/>
          </Button>
          <div className='menu-submenu w-auto bg-light'>
            <Card style={{ width: '20rem' }}>
              <Card style={{ width: '20rem' }}>
                <Card.Body>
                  <Card.Title>Workspace</Card.Title>
                  <Divider/><br/>
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
