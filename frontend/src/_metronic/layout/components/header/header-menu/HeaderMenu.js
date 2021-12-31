/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { checkIsActive } from '../../../../_helpers';
import { Card } from 'react-bootstrap';
import AddIcon from '@material-ui/icons/Add';
import { Avatar, Button, Divider, Typography } from '@material-ui/core';
import axios from 'axios';
import { BACKEND_ORIGIN } from '../../../../../config';
import { Rating } from '@material-ui/lab';
import WorkspaceCreateModal from './component/WorkspaceCreateModal';
import BoardCreateModal from './component/BoardCreateModal';
import { useSelector } from 'react-redux';

export const GET_WORKSPACES_URL = BACKEND_ORIGIN + 'api/v1/workspaces/';
export const GET_STARRED_BOARDS_URL = BACKEND_ORIGIN + 'api/v1/boards?starred=true';
export const POST_REMOVE_STARRED_BOARDS = BACKEND_ORIGIN + 'api/v1/boards/';

export function HeaderMenu({ layoutProps }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  // todo: to redux if needed
  const [workspaces, setWorkspaces] = useState([]);
  const [starredBoards, setStarredBoards] = useState([]);
  // todo: rf & centralize CRUD operations later
  const [updateStarredBoardFlag, setUpdateStarredBoardFlag] = useState(true);
  const [openBoard, setOpenBoard] = useState(false);
  const [openWorkspace, setOpenWorkspace] = useState(false);

  useEffect(() => {
    // Get all user workspaces
    axios.get(GET_WORKSPACES_URL)
      .then(r => {
        let workspaces = r.data;
        setWorkspaces(workspaces);
      })
      .catch(e => {
        console.log(e);
      });
    // Get all user's starred boards
    axios.get(GET_STARRED_BOARDS_URL)
      .then(r => {
        setStarredBoards(r.data);
      })
      .catch(e => {
        console.log(e);
      });
  }, [updateStarredBoardFlag]);

  const removeStarredBoard = (bid, wid) => {
    const data = {
      starred: 'false',
      workspace: wid
    };
    axios.put(POST_REMOVE_STARRED_BOARDS + bid + '/', data)
      .then(() => {
        setUpdateStarredBoardFlag(!updateStarredBoardFlag);
      });
  };

  const handleBoardOpen = () => {
    setOpenBoard(true);
  };

  const handleBoardClose = () => {
    setOpenBoard(false);
  };

  const handleWorkspaceOpen = () => {
    setOpenWorkspace(true);
  };

  const handleWorkspaceClose = () => {
    setOpenWorkspace(false);
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
              <Card.Body>
                <Typography variant={'h6'} align={'center'}>Workspaces</Typography>
                <Divider className={'mt-2 mb-5'}/>
                <p className={'text-black-50 font-size-lg mb-1'}>Your workspaces</p>
                {
                  workspaces
                    .filter(w => w.members.filter(u => u.role === 'admin' && u.id === user.id).length > 0) //get user's workspace
                    .map((w, key) => (
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
                  workspaces
                    .filter(w => w.members.filter(u => u.role !== 'admin' && u.id === user.id).length > 0) //get user's guest workspace
                    .map((w, key) => (
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
            <Card style={{ width: '25rem' }}>
              <Card.Body>
                <Typography variant={'h6'} align={'center'}>Starred boards</Typography>
                <Divider className={'mt-2 mb-5'}/>
                <Card.Text>
                  {
                    starredBoards.map((b, key) => (
                      <Button
                        key={key}
                        fullWidth
                        style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
                        startIcon={<Avatar src={b.background} />}
                        className={'pl-2'}
                      >
                        <Link to={`/workspace/${b.id}`} className='navi-item cursor-pointer'>
                          <div className='text-dark font-size-lg cursor-pointer pl-1'>
                            {b.name}
                          </div>
                        </Link>
                        <Rating name='customized-10' defaultValue={1} max={1} className={'ml-auto mr-0 mb-0'}
                                onChange={(event, newValue) => {
                                  removeStarredBoard(b.id, b.workspace);
                                }}
                        />
                      </Button>
                    ))
                  }
                </Card.Text>
              </Card.Body>
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
            <AddIcon className='ml-2' htmlColor='#ffffff' />
          </Button>
          <div className='menu-submenu w-auto bg-light'>
            <Card style={{ width: '29rem' }}>
              <Card.Body>
                <Typography variant={'h6'} align={'center'}>Create</Typography>
                <Divider className={'mt-2 mb-4'}/>
                <Button
                  fullWidth
                  style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
                  className={'text-left'}
                  onClick={handleBoardOpen}
                >
                  <div>
                    <div className='text-dark font-size-lg cursor-pointer pl-0 ml-0 mr-auto'>
                      Create board
                    </div>
                    <div className={'text-dark-50 font-size-xs text-lowercase text-justify'}>
                      A board is made up of cards ordered on lists.
                      Use it to manage projects, track information, or organize anything
                    </div>
                  </div>
                </Button>
                <Button
                  fullWidth
                  style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
                  className={'text-left'}
                  onClick={handleWorkspaceOpen}
                >
                  <div>
                    <div className='text-dark font-size-lg cursor-pointer pl-0 ml-0 mr-auto'>
                      Create workspace
                    </div>
                    <div className={'text-dark-50 font-size-xs text-lowercase text-justify'}>
                      A Workspace is a group of boards and people.
                      Use it to organize your company, side hustle, family, or friends.
                    </div>
                  </div>
                </Button>
              </Card.Body>
            </Card>
          </div>
        </li>
        {/*end::level1*/}
      </ul>
      {/*end::Header Nav*/}

      {/*Modal to create board*/}
      <BoardCreateModal openBoard={openBoard} handleBoardModalClose={handleBoardClose} workspaces={workspaces} />
      {/*Modal to create workspace*/}
      <WorkspaceCreateModal openWorkspace={openWorkspace} handleWorkspaceModalClose={handleWorkspaceClose} />
    </div>
  );
}
