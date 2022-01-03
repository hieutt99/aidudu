import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Container, Popover, Overlay } from 'react-bootstrap';
import { FiStar } from "react-icons/fi";
import { BsPersonPlus, BsTags, BsInboxes } from "react-icons/bs";
import { BiArrowToLeft } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdOutlineDashboard } from "react-icons/md";
import BoardList from './board-list/BoardList';
import axios from 'axios';
import {
  lightGreyColor, lightGreyBackground, iconSize24, iconSize20, iconSize34,
  contentBackgroundMask, menuContainer, menuDescription, listContainer, backgroundAddNewList, popoverDialogContainer
} from './BoardStyles';
import BoardMember from './board-member/BoardMember';
import BoardWorkspaceVisibility from './board-workspace-visibility/BoardWorkspaceVisibility';
import { BACKEND_ORIGIN } from '../../../../../../config';

// APIs
export const WORK_API = 'api/v1';
export const GET_BOARD_DETAILS = BACKEND_ORIGIN + WORK_API + '/boards/2/details';
export const CREATE_A_LIST = BACKEND_ORIGIN + WORK_API + '/lists/';
export const CARD_DETAIL = BACKEND_ORIGIN + WORK_API + '/cards/';

function Board(props) {

  const INCREMENT_CARD_POSITION = 1;
  const DECREMENT_CARD_POSITION = -1;

  const [board, setBoard] = useState({});
  const [lists, setLists] = useState([]);
  const [onTextChangedNewListTitle, setTextChangedNewListTitle] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [inviteQuery, setInviteQuery] = useState('');

  const [members, setMembers] = useState([]);

  useEffect(() => {
    getBoardDetails();
  }, []);

  const getBoardDetails = () => {
    axios.get(GET_BOARD_DETAILS).then(response => {
      console.log("Board details: ", response.data);
      setBoard(response.data);
      setLists(response.data["lists"]);
      setMembers(response.data['members']);
    })
      .catch(error => {
        console.log("Error get board details: " + error);
      })
  };

  const addNewList = () => {
    if (onTextChangedNewListTitle !== '') {
      axios.post(CREATE_A_LIST, {
        name: onTextChangedNewListTitle,
        board: board.id,
      })
        .then(response => {
          console.log("Successfully create new list: " + response.data["name"]);
          toggleAddNewList();
          getBoardDetails();
        });
    }
  }

  const updateDraggableCardPosition = (draggableId, newPosition, newListId) => {
    axios
      .put(CARD_DETAIL + draggableId + '/', {
        position: newPosition,
        list: newListId,
      })
      .then(response => {
        console.log("Successfully update draggable: " + response.data["title"] + " - position: " + response.data["position"]);
        // TODO: get board details
      })
  }

  const moveCardPosition = (listId, card, updateUnit) => {
    axios
      .put(CARD_DETAIL + card["id"] + '/', {
        list: listId,
        position: card["position"] + updateUnit,
      })
      .then(response => {
        console.log("Successfully move card: "
          + "id: " + response.data["id"] + " - "
          + "title: " + response.data["title"] + " - "
          + "new position: " + response.data["position"]
        );
      });
  }

  const moveCardsPositionInNewDestinationList = (oldListId, newListId, oldCardIndex, newCardIndex) => {
    try {
      // Update position of cards in the new list
      const destinationList = lists.find((list) => list["id"] == newListId);
      const cardsInDestinationList = destinationList["cards"];
      const destinationmMovedCards = cardsInDestinationList.filter((card) => card["position"] >= newCardIndex)
      for (let i = 0; i < destinationmMovedCards.length; i++) {
        moveCardPosition(newListId, destinationmMovedCards[i], INCREMENT_CARD_POSITION);
      }

      // Update position of cards in the old list
      const sourceList = lists.find((list) => list["id"] == oldListId);
      const cardsInSourceList = sourceList["cards"];
      const sourceMovedCards = cardsInSourceList.filter((card) => card["position"] > oldCardIndex);
      for (let j = 0; j < sourceMovedCards.length; j++) {
        moveCardPosition(oldListId, sourceMovedCards[j], DECREMENT_CARD_POSITION);
      }
    } catch (exception) {
      console.log(exception);
    }
  }

  const moveCardsPositionInOldDestinationList = (listId, oldCardIndex, newCardIndex) => {
    try {
      const destinationList = lists.find((list) => list["id"] == listId);
      const cardsInDestinationList = destinationList["cards"];

      if (oldCardIndex < newCardIndex) {
        // Update position of cards after being moved up
        const movedCards = cardsInDestinationList.filter((card) => card["position"] > oldCardIndex && card["position"] <= newCardIndex);
        for (let i = 0; i < movedCards.length; i++) {
          moveCardPosition(listId, movedCards[i], DECREMENT_CARD_POSITION);
        }
      } else {
        // Update position of cards after being moved down
        const movedCards = cardsInDestinationList.filter((card) => card["position"] < oldCardIndex && card["position"] >= newCardIndex);
        for (let i = 0; i < movedCards.length; i++) {
          moveCardPosition(listId, movedCards[i], INCREMENT_CARD_POSITION);
        }
      }
    } catch (exception) {
      console.log(exception);
    }
  }

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const oldListId = parseInt(source.droppableId);
    const newListId = parseInt(destination.droppableId);
    const oldCardIndex = source.index;
    const newCardIndex = destination.index;

    if (oldListId === newListId && oldCardIndex === newCardIndex) {
      return;
    }

    if (oldListId !== newListId) {
      moveCardsPositionInNewDestinationList(oldListId, newListId, oldCardIndex, newCardIndex);
    } else {
      moveCardsPositionInOldDestinationList(newListId, oldCardIndex, newCardIndex);
    }

    updateDraggableCardPosition(draggableId, newCardIndex, newListId);

    // TODO: await for cards update first
    getBoardDetails();
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

  // Open/close menu sidebar
  const openMenuSidebar = () => {
    document.getElementById("menuSidebar").style.width = "350px";
  };
  const closeMenuSidebar = () => {
    document.getElementById("menuSidebar").style.width = "0";
  };

  // Open/close dialog invite member
  const dialogInviteMemberTarget = useRef(null);
  const [isDialogInviteMemberOpen, setDialogInviteMember] = useState(false);
  const onInviteMemberButtonClicked = () => {
    if (isDialogInviteMemberOpen) {
      setDialogInviteMember(false);
    } else {
      setDialogInviteMember(true);
    }
  };

  const handleInviteInputOnChange = e => {
    setInviteQuery(e.target.value);
  }

  useEffect(() => {
    if (inviteQuery) {
      // call API to search for candidates
      axios.get(`${BACKEND_ORIGIN}api/v1/users/`, { params: { query: inviteQuery } }).then(res => {
        if (res.data.count) {
          const resCandidates = res.data.results;
          let temp = [];
          for (let i = 0; i < resCandidates.length; i++) {
            let found = false;
            for (let j = 0; j < members.length; j++) {
              if (members[j].id === resCandidates[i].id) {
                found = true; break;
              }
            }
            if (found) continue;
            found = false;
            for (let j = 0; j < selectedCandidates.length; j++) {
              if (selectedCandidates[j].id === resCandidates[i].id) {
                found = true; break;
              }
            }
            if (!found) temp.push(resCandidates[i]);
          }
          setCandidates(temp);
        }
        else setCandidates([]);
      })
    }
    else {
      setCandidates([]);
    }
  }, [inviteQuery])

  const handleSelectCandidate = candidate => {
    setInviteQuery('');
    setCandidates([]);
    setSelectedCandidates([...selectedCandidates, candidate]);
  }

  const removeSelectedCandidate = candidate => {
    if (!selectedCandidates) return;

    const temp = [...selectedCandidates];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id === candidate.id) {
        temp.splice(i, 1);
        setSelectedCandidates(temp);
        return;
      }
    }

  }

  const inviteMembers = e => {
    let idList = [];
    for (let i = 0; i < selectedCandidates.length; i++) idList.push(selectedCandidates[i].id);

    axios.post(`${BACKEND_ORIGIN}api/v1/boards/${board.id}/members/`, { id: idList }).then(res => {
      setMembers([...members, selectedCandidates]);
    }).catch(e => {
      alert("Có lỗi xảy ra khi mời thành viên mới");
    })

    setInviteQuery('');
    setCandidates([]);
    setSelectedCandidates([]);
    setDialogInviteMember(false);
  }

  return (
    <Container fluid className='p-0 m-0'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container fluid className='p-0 m-0'>

          {/* Toolbar */}
          <div className={"d-flex justify-content-between align-items-center bg-white text-black"}>
            <div className={"d-flex justify-content-start align-items-center flex-wrap px-3 py-3"}>

              {/* Board name */}
              <h3 className={"my-0 mx-4 p-2"}>{board["name"]}</h3>

              {/* Icon button star */}
              <div className={"btn mx-3 p-3 rounded"} style={lightGreyBackground}>
                <FiStar style={iconSize20} />
              </div>

              {/* Workspace visibility */}
              <BoardWorkspaceVisibility />

              {/* List of members */}
              {members !== undefined && members.length > 0 &&
                <div className={"mx-2 p-2 d-flex align-items-center"}>
                  {
                    members.map((member, i) => {
                      return <BoardMember key={member.id} member={member} />
                    })
                  }
                </div>
              }

              {/* Button invite member */}
              <Button
                variant='primary' className='mx-2'
                ref={dialogInviteMemberTarget} onClick={onInviteMemberButtonClicked}
              >
                <div className='px-2 py-0 align-items-center d-flex'>
                  <BsPersonPlus style={iconSize20} className='mx-1' />
                  <h6 className='mx-2 my-0'>Invite</h6>
                </div>
              </Button>

            </div>

            {/* Open menu button */}
            <div className={"btn mx-3"} >
              <BiArrowToLeft style={iconSize24} onClick={openMenuSidebar} />
            </div>

          </div>

          {/* Main content */}
          <div className='p-0 bg-image' style={{ height: "100vh", backgroundImage: "url('" + board.background + "')" }}>
            <div style={contentBackgroundMask}>
              <div className='px-5 pb-3 d-flex align-items-start h-100' style={{ overflowX: "auto" }}>

                {/* Lists */}
                {
                  lists.map((list, index) => {
                    return <BoardList
                      key={list["id"]}
                      list={list}
                      getBoardDetails={getBoardDetails}
                    />
                  })
                }

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
                      <input
                        type="text" className="form-control" placeholder='Enter list title...'
                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                        onChange={string => setTextChangedNewListTitle(string.target.value)}
                      />
                      <div className='d-flex align-items-center p-2'>
                        <Button variant='primary' className='py-1' onClick={addNewList}>Add list</Button>
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
            <div className='p-4 d-flex align-items-center'>
              <img className={"rounded-circle bg-warning"} style={iconSize24} />
              <h6 className='my-0 mx-3'>Change background</h6>
            </div>

            {/* Labels */}
            <div className='p-4 d-flex align-items-center'>
              <BsTags style={iconSize24} />
              <h6 className='my-0 mx-3'>Labels</h6>
            </div>

            {/* Archived items */}
            <div className='p-4 d-flex align-items-center'>
              <BsInboxes style={iconSize24} />
              <h6 className='my-0 mx-3'>Archived items</h6>
            </div>

            {/* Leave board */}
            <div className='position-absolute fixed-bottom w-100 p-3'>
              <Button variant='danger' className='w-100 py-2'>
                <div className='d-flex align-items-center justify-content-center py-1'>
                  <h6 className='m-0'>Leave board</h6>
                </div>
              </Button>
            </div>
          </div>

          {/* Dialog invite member */}
          <Overlay target={dialogInviteMemberTarget.current} show={isDialogInviteMemberOpen} placement="bottom">
            {(props) => (
              <Popover {...props}>
                <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                  {/* Header */}
                  <div className='d-flex justify-content-between align-items-center p-3'>
                    <div className='btn p-0' onClick={() => { setDialogInviteMember(false) }}>
                      <MdClose style={iconSize20} />
                    </div>
                    <h6 className='m-0'>Invite to board</h6>
                    <div className='btn p-0' onClick={() => { setDialogInviteMember(false) }}>
                      <MdClose style={iconSize20} />
                    </div>
                  </div>

                  <hr className='m-0' />

                  {/* Input field */}
                  <div className='p-3 d-flex flex-column'>
                    {/* Input field */}
                    <input type="text" className="form-control" placeholder='Email address or name...' onChange={handleInviteInputOnChange} value={inviteQuery} />

                    {/* Candidates card item */}
                    <div className="mt-3 d-flex flex-column" >
                      {candidates && candidates.map(candidate =>
                        <button className="d-flex align-items-center p-3 mb-2 border-0 rounded" style={lightGreyBackground} onClick={() => handleSelectCandidate(candidate)} key={candidate.id}>
                          <img src={candidate.avatar} className="rounded-circle" style={iconSize24}></img>
                          <p className="ml-5 mb-0" style={{ fontSize: '12px' }}>{candidate.first_name} {candidate.last_name}</p>
                        </button>
                      )}
                    </div>

                    {/* Selected candidates chip item */}
                    <div style={{ minHeight: '150px' }}>
                      <div className="d-flex mt-2 flex-row flex-wrap">
                        {selectedCandidates && selectedCandidates.map(candidate =>
                          <span className="badge badge-pill badge-light py-2 px-4 mr-2 mb-2 align-items-center" style={{ fontSize: '12px' }} key={candidate.id}>
                            {candidate.first_name} {candidate.last_name}
                            <div className='btn p-0 ml-2' onClick={() => removeSelectedCandidate(candidate)}>
                              <MdClose style={iconSize20} />
                            </div>
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Button send invite */}
                  <Button variant='primary' className='mx-3 mb-3 mt-0' disabled={selectedCandidates.length === 0} onClick={inviteMembers}>
                    Send invitation
                  </Button>

                </div>
              </Popover>
            )}
          </Overlay>

        </Container>
      </DragDropContext >
    </Container >

  );
}

export default Board;