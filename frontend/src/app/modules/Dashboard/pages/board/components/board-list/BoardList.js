import { React, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdContentCopy } from "react-icons/md";
import { BiMove } from "react-icons/bi";
import { BsSortDown } from "react-icons/bs";
import BoardCardItem from '../board-card-item/BoardCardItem';
import { Button, Overlay, Popover } from 'react-bootstrap';

const iconSize20 = {
    width: "20px",
    height: "20px",
};

const iconSize24 = {
    width: "24px",
    height: "24px",
};

const listContainer = {
    minWidth: "300px",
    maxWidth: "300px",
    height: "auto",
    backgroundColor: "#0000001a",
};

const primaryBackground = {
    backgroundColor: "#1976D2",
};

const backgroundAddNewCard = {
    backgroundColor: "#181c1480",
};

const popoverDialogContainer = {
    width: "400px",
    height: "auto",
};

const BoardList = (props) => {

    // Toggle add new card
    const [isAddingNewCard, setAddingNewCard] = useState(false);
    const toggleAddNewCard = () => {
        if (isAddingNewCard) {
            setAddingNewCard(false);
        } else {
            setAddingNewCard(true);
        }
    };

    // Popover dialog list actions
    const dialogListActionsTarget = useRef(null);
    const [isDialogListActionsOpen, setDialogListActions] = useState(false);
    const onListActionsClicked = () => {
        if (isDialogListActionsOpen) {
            setDialogListActions(false);
        } else {
            setDialogListActions(true);
        }
    };

    return (
        <div className='card mx-1 p-2 pb-0 border-0' style={listContainer} >

            {/* Title */}
            <div className='card-header d-flex justify-content-between align-items-center py-2 px-3 mb-3 border-0 rounded text-white' style={primaryBackground}>
                <p className='m-0'>List Title</p>
                <div
                    className='btn btn-link text-reset m-0 py-0 px-0'
                    ref={dialogListActionsTarget} onClick={onListActionsClicked}
                >
                    <FiMoreHorizontal style={iconSize20} />
                </div>
            </div>

            {/* Card items */}
            <Droppable droppableId={'1'} key={1}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ overflowY: "auto", maxHeight: "800px", }}
                    >

                        {/* Card 1*/}
                        <BoardCardItem />

                        {provided.placeholder}

                    </div>
                )}
            </Droppable>

            {/* Button add new card */}
            {!isAddingNewCard &&
                <div
                    className='btn btn-block text-reset d-flex justify-content-start align-items-center py-2 px-3 mt-1 mb-2 rounded'
                    style={backgroundAddNewCard}
                    onClick={toggleAddNewCard}
                >
                    <AiOutlinePlus className='text-white' style={iconSize20} />
                    <p className='mx-3 my-0 text-white'>Add new card</p>
                </div>
            }

            {/* Text area add new card */}
            {isAddingNewCard &&
                <div className='rounded bg-white mb-2 p-0 d-flex flex-column'>
                    <textarea className='py-2 px-3 rounded w-100 form-control' placeholder='Enter card title...' />
                    <div className='d-flex align-items-center p-2'>
                        <Button variant='primary'>Add card</Button>
                        <div className='btn p-0 mx-3' onClick={toggleAddNewCard}>
                            <MdClose style={iconSize24} />
                        </div>
                    </div>
                </div>
            }

            {/* Dialog list actions */}
            <Overlay target={dialogListActionsTarget.current} show={isDialogListActionsOpen} placement="bottom">
                {(props) => (
                    <Popover {...props}>
                        <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                            {/* Header */}
                            <div className='d-flex justify-content-between align-items-center p-2'>
                                <div>
                                    <MdClose style={iconSize20} className='opacity-0' />
                                </div>
                                <h6 className='m-0'>List actions</h6>
                                <div className='btn p-0' onClick={() => { setDialogListActions(false) }}>
                                    <MdClose style={iconSize20} />
                                </div>
                            </div>

                            <hr className='m-0' />

                            {/* Copy list */}
                            <div className='py-2 px-3 d-flex align-items-center'>
                                <div >
                                    <MdContentCopy style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Copy list</h6>
                            </div>

                            {/* Move list */}
                            <div className='py-2 px-3 d-flex align-items-center'>
                                <div>
                                    <BiMove style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Move list</h6>
                            </div>

                            {/* Sort by */}
                            <div className='py-2 px-3 d-flex align-items-center'>
                                <div>
                                    <BsSortDown style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Sort by</h6>
                            </div>

                        </div>
                    </Popover>
                )}
            </Overlay>


        </div>
    );
}

export default BoardList;
