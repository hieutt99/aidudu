import React, { useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Container, Popover, Row, Overlay } from 'react-bootstrap';
import { FiStar } from "react-icons/fi";
import { BsPeople, BsPersonPlus, BsTags, BsInboxes } from "react-icons/bs";
import { BiArrowToLeft, BiWorld } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdOutlineDashboard, MdLockOutline, MdCorporateFare } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import BoardList from './board-list/BoardList';

const lightGreyColor = {
  color: "#b8b8b8",
};

const lightGreyBackground = {
  backgroundColor: "#e3e4e8",
};

const iconSize24 = {
  width: "24px",
  height: "24px",
};

const iconSize20 = {
  width: "20px",
  height: "20px",
};

const iconSize34 = {
  width: "34px",
  height: "34px",
};

const contentBackgroundImage = {
  backgroundImage: "url('https://i.pinimg.com/originals/ef/7f/b1/ef7fb1b37078b6a2aef8e40710446bfa.jpg')",
  height: "100vh",
};

const contentBackgroundMask = {
  backgroundColor: "rgba(0,0,0,0.5)",
  width: "100%",
  height: "100%",
  position: "relative",
};

const menuContainer = {
  width: "0px",
  height: "100%",
  backgroundColor: "white",
  position: "fixed",
  zIndex: "1",
  top: "0",
  right: "0",
  overflowX: "hidden",
  transition: "0.5s",
};

const menuDescription = {
  resize: "none",
  backgroundColor: "#e3e4e8",
};

const listContainer = {
  minWidth: "300px",
  maxWidth: "300px",
  height: "auto",
  backgroundColor: "#0000001a",
};

const backgroundAddNewList = {
  backgroundColor: "#c7886dcc",
};

const popoverDialogContainer = {
  width: "400px",
  height: "auto",
};

function Board(props) {

  const onDragEnd = (result) => {
    // TODO: 
  };

  // Open/close menu sidebar
  const openMenuSidebar = () => {
    document.getElementById("menuSidebar").style.width = "350px";
  };
  const closeMenuSidebar = () => {
    document.getElementById("menuSidebar").style.width = "0";
  };

  // Toggle add new list
  const [isAddingNewList, setAddingNewList] = useState(false);
  const toggleAddNewList = () => {
    if (isAddingNewList) {
      setAddingNewList(false);
    } else {
      setAddingNewList(true);
    }
  };

  // Popover dialog invite member
  const dialogInviteMemberTarget = useRef(null);
  const [isDialogInviteMemberOpen, setDialogInviteMember] = useState(false);
  const onInviteMemberButtonClicked = () => {
    if (isDialogInviteMemberOpen) {
      setDialogInviteMember(false);
    } else {
      setDialogInviteMember(true);
    }
  };

  // Popover dialog workspace visibility
  const dialogWorkspaceVisibilityTarget = useRef(null);
  const [isDialogWorkspaceVisibilityOpen, setDialogWorkspaceVisibility] = useState(false);
  const onWorkspaceVisibleButtonClicked = () => {
    if (isDialogWorkspaceVisibilityOpen) {
      setDialogWorkspaceVisibility(false);
    } else {
      setDialogWorkspaceVisibility(true);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container fluid className={"p-0"}>

          {/* Toolbar */}
          <Row>
            <div className={"d-flex justify-content-between align-items-center flex-row bg-white text-black"}>
              <div className={"d-flex justify-content-start align-items-center flex-row px-3 py-2"}>

                {/* Board name */}
                <h3 className={"my-0 mx-4 p-2"}>Board Name</h3>

                {/* Icon button star */}
                <div className={"btn mx-3 p-2 rounded"} style={lightGreyBackground}>
                  <FiStar style={iconSize20} />
                </div>

                {/* Workspace visible */}
                <div
                  className={"btn mx-2 p-2 rounded d-flex align-items-center"} style={lightGreyBackground}
                  ref={dialogWorkspaceVisibilityTarget} onClick={onWorkspaceVisibleButtonClicked}
                >
                  <BsPeople style={iconSize20} />
                  <h6 className='my-1 mx-2'>Workspace Visible</h6>
                </div>

                {/* List of members */}
                <div className={"mx-2 p-2 d-flex align-items-center"}>
                  <img className={"rounded-circle bg-success"} style={iconSize24} />
                  <img className={"rounded-circle bg-dark"} style={iconSize24} />
                  <img className={"rounded-circle bg-warning"} style={iconSize24} />
                </div>

                {/* Button invite member */}
                <Button
                  variant='primary' className='mx-2'
                  ref={dialogInviteMemberTarget} onClick={onInviteMemberButtonClicked}
                >
                  <div className='px-2 align-items-center d-flex'>
                    <BsPersonPlus style={iconSize20} className='mx-1' />
                    <h6 className='m-1'>Invite</h6>
                  </div>
                </Button>

              </div>

              {/* Open menu button */}
              <div className={"btn mx-3"} >
                <BiArrowToLeft style={iconSize24} onClick={openMenuSidebar} />
              </div>

            </div>
          </Row>

          {/* Main content */}
          <Row>
            <div className='p-0 bg-image' style={contentBackgroundImage}>
              <div style={contentBackgroundMask}>
                <div className='px-5 pb-3 d-flex align-items-start h-100' style={{ overflowX: "auto" }}>

                  {/* List */}
                  <BoardList />

                  {/* Add new list */}
                  <div className='card mx-1 p-2 border-0' style={listContainer} >
                    {/* Button add new list */}
                    {!isAddingNewList &&
                      <div
                        className='btn btn-block text-reset d-flex justify-content-start align-items-center py-2 px-3 rounded'
                        style={backgroundAddNewList}
                        onClick={toggleAddNewList}
                      >
                        <AiOutlinePlus className='text-white' style={iconSize20} />
                        <p className='mx-3 my-0 text-white'>Add new list</p>
                      </div>
                    }

                    {/* Text area add new list */}
                    {isAddingNewList &&
                      <div className='rounded bg-white p-0 d-flex flex-column'>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='Enter list title...' />
                        <div className='d-flex align-items-center p-2'>
                          <Button variant='primary'>Add list</Button>
                          <div className='btn p-0 mx-3' onClick={toggleAddNewList}>
                            <MdClose style={iconSize24} />
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                </div>
              </div>
            </div>
          </Row>

          {/* Menu */}
          <div className='card p-0 border-0' style={menuContainer} id='menuSidebar'>

            {/* Menu header */}
            <div className='d-flex justify-content-between bg-white align-items-center p-4'>
              <div>
                <MdClose style={iconSize24} className='opacity-0' />
              </div>
              <h5 className='m-0'>MENU</h5>
              <div className='btn p-0' onClick={closeMenuSidebar}>
                <MdClose style={iconSize24} />
              </div>
            </div>

            <hr className='mt-0 mb-2' />

            {/* About this board */}
            <div className='px-4 py-3 d-flex align-items-center'>
              <MdOutlineDashboard style={iconSize24} />
              <h6 className='my-0 mx-3'>About this board</h6>
            </div>

            {/* Admin info */}
            <div className='px-4 d-flex flex-column my-3'>
              <p className='mx-0 mb-3' style={lightGreyColor}>Admin</p>
              <div className='d-flex justify-content-start align-items-center mb-3'>
                <img className={"rounded-circle bg-success"} style={iconSize34} />
                <div className='d-flex flex-column mx-3'>
                  <h6 className='m-0'>Henlo Cheems</h6>
                  <p className='m-0' style={lightGreyColor}>henlocheems@gmail.com</p>
                </div>
              </div>
              <p className='mx-0 mb-3' style={lightGreyColor}>Description</p>
              <textarea className='py-2 px-3 rounded border-0 form-control' style={menuDescription} placeholder='Enter description of the board' />
            </div>

            <hr className='my-2' />

            {/* Change background */}
            <div className='px-4 py-3 d-flex align-items-center'>
              <img className={"rounded-circle bg-warning"} style={iconSize24} />
              <h6 className='my-0 mx-3'>Change background</h6>
            </div>

            {/* Labels */}
            <div className='px-4 py-3 d-flex align-items-center'>
              <BsTags style={iconSize24} />
              <h6 className='my-0 mx-3'>Labels</h6>
            </div>

            {/* Archived items */}
            <div className='px-4 py-3 d-flex align-items-center'>
              <BsInboxes style={iconSize24} />
              <h6 className='my-0 mx-3'>Archived items</h6>
            </div>

            {/* Leave board */}
            <div className='position-absolute fixed-bottom w-100 p-3'>
              <Button variant='danger' className='w-100'>
                <div className='d-flex align-items-center justify-content-center py-1'>
                  <h6 className='m-0'>Leave board</h6>
                </div>
              </Button>
            </div>
          </div>

          {/* Dialog invite member */}
          <Overlay target={dialogInviteMemberTarget.current} show={isDialogInviteMemberOpen} placement="right">
            {(props) => (
              <Popover {...props}>
                <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                  {/* Header */}
                  <div className='d-flex justify-content-between align-items-center p-2'>
                    <div>
                      <MdClose style={iconSize20} className='opacity-0' />
                    </div>
                    <h6 className='m-0'>Invite to board</h6>
                    <div className='btn p-0' onClick={() => { setDialogInviteMember(false) }}>
                      <MdClose style={iconSize20} />
                    </div>
                  </div>

                  <hr className='m-0' />

                  {/* Input field */}
                  <div className='p-3'>
                    <input type="text" className="form-control" placeholder='Email address or name...' />
                  </div>

                  {/* Button send invite */}
                  <Button variant='primary' className='mx-3 mb-3 mt-0'>
                    Send invitation
                  </Button>

                </div>
              </Popover>
            )}
          </Overlay>

          {/* Dialog workspace visibility */}
          <Overlay target={dialogWorkspaceVisibilityTarget.current} show={isDialogWorkspaceVisibilityOpen} placement="bottom">
            {(props) => (
              <Popover {...props}>
                <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                  {/* Header */}
                  <div className='d-flex justify-content-between align-items-center p-2'>
                    <div>
                      <MdClose style={iconSize20} className='opacity-0' />
                    </div>
                    <h6 className='m-0'>Workspace visibility</h6>
                    <div className='btn p-0' onClick={() => { setDialogWorkspaceVisibility(false) }}>
                      <MdClose style={iconSize20} />
                    </div>
                  </div>

                  <hr className='m-0' />

                  {/* Private */}
                  <div className='d-flex py-2 px-3'>
                    <div>
                      <MdLockOutline style={iconSize20} />
                    </div>
                    <div className='d-flex flex-column mx-3'>
                      <h6 className='m-0'><strong>Private</strong></h6>
                      <p className='m-0'>Only board member can see and edit this board.</p>
                    </div>
                  </div>

                  {/* Workspace */}
                  <div className='d-flex py-2 px-3'>
                    <div>
                      <GrGroup style={iconSize20} />
                    </div>
                    <div className='d-flex flex-column mx-3'>
                      <h6 className='m-0'><strong>Workspace</strong></h6>
                      <p className='m-0'>All members of the Workspace can see and edit this board. The board must be added to a Workspace to enable this.</p>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className='d-flex py-2 px-3'>
                    <div>
                      <MdCorporateFare style={iconSize20} />
                    </div>
                    <div className='d-flex flex-column mx-3'>
                      <h6 className='m-0'><strong>Organization</strong></h6>
                      <p className='m-0'>All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this.</p>
                    </div>
                  </div>

                  {/* Public */}
                  <div className='d-flex py-2 px-3'>
                    <div>
                      <BiWorld style={iconSize20} />
                    </div>
                    <div className='d-flex flex-column mx-3'>
                      <h6 className='m-0'><strong>Public</strong></h6>
                      <p className='m-0'>Anyone on the internet can see this board. Only board members can edit.</p>
                    </div>
                  </div>

                </div>
              </Popover>
            )}
          </Overlay>

        </Container >
      </DragDropContext >
    </>

  );
}

export default Board;