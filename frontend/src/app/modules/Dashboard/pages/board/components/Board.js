import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Container, Row } from 'react-bootstrap';
import { FiStar } from "react-icons/fi";
import { BsPeople, BsPersonPlus, BsTags, BsInboxes } from "react-icons/bs";
import { BiArrowToLeft } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdOutlineDashboard } from "react-icons/md";
import BoardList from './board-list/BoardList';

function Board(props) {

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
    minWidth: "400px",
    maxWidth: "400px",
    height: "100%",
    backgroundColor: "white",
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

  const onDragEnd = (result) => {
    // TODO: 
  };

  return (
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
              <div className={"btn mx-2 p-2 rounded d-flex align-items-center"} style={lightGreyBackground}>
                <BsPeople style={iconSize20} />
                <h6 className='my-1 mx-2'>Workspace Visible</h6>
              </div>
              {/* List of members */}
              <div className={"mx-2 p-2 d-flex align-items-center"}>
                <img className={"rounded-circle bg-success"} style={iconSize24} />
                <img className={"rounded-circle bg-dark"} style={iconSize24} />
                <img className={"rounded-circle bg-warning"} style={iconSize24} />
              </div>
              {/* Invite member button */}
              <Button variant='primary' className='mx-2 align-items-center'>
                <div className='px-2 align-items-center d-flex flex-row justify-content-between'>
                  <BsPersonPlus style={iconSize20} />
                  <h6 className='my-1 mx-2'>Invite</h6>
                </div>
              </Button>
            </div>
            {/* Open menu button */}
            <div className={"btn mx-3"} >
              <BiArrowToLeft style={iconSize24} />
            </div>
          </div>
        </Row>

        {/* Main */}
        <Row>
          <div className='p-0 bg-image' style={contentBackgroundImage}>
            <div style={contentBackgroundMask}>
              <div className='px-5 pb-3 d-flex align-items-start h-100' style={{ overflowX: "auto" }}>

                {/* List */}
                <BoardList />

                {/* Add new list */}
                <div className='card mx-1 p-2 border-0' style={listContainer}>
                  <div className='btn btn-block text-reset d-flex justify-content-start align-items-center py-2 px-3 rounded' style={backgroundAddNewList}>
                    <AiOutlinePlus className='text-white' style={iconSize20} />
                    <p className='mx-3 my-0 text-white'>Add new list</p>
                  </div>
                </div>

                {/* Menu */}
                <div className='card p-0 border-0' style={menuContainer}>

                  {/* Menu header */}
                  <div className='d-flex justify-content-between bg-white align-items-center p-4'>
                    <div>
                      <MdClose style={iconSize24} className='opacity-0' />
                    </div>
                    <h5 className='m-0'>MENU</h5>
                    <div>
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
                    <textarea className='py-2 px-3 rounded border-0' style={lightGreyBackground}>This is description</textarea>
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


              </div>
            </div>
          </div>
        </Row>
      </Container >
    </DragDropContext >
  );
}

export default Board;