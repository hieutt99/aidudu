import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { BiMove } from "react-icons/bi";
import { BsSortAlphaDown, BsSortAlphaDownAlt, BsSortDown, BsSortNumericDown, BsSortNumericDownAlt } from "react-icons/bs";
import BoardCardItem from '../board-card-item/BoardCardItem';
import { Button, Overlay, Popover } from 'react-bootstrap';
import axios from 'axios';
import { BACKEND_ORIGIN } from '../../../../../../../config';
import { iconSize20, iconSize24, listContainer, primaryBackground, backgroundAddNewCard, popoverDialogContainer } from '../BoardStyles';

// APIs
export const CREATE_A_CARD = BACKEND_ORIGIN + 'api/v1/cards/';
export const DELETE_A_LIST = BACKEND_ORIGIN + 'api/v1/lists/';
export const COPY_A_LIST = BACKEND_ORIGIN + 'api/v1/lists/';

export const SortCard = {
    POSITION_ASC: 1,
    POSITION_DES: 2,
    NAME_ASC: 3,
    NAME_DES: 4,
};

const BoardList = (props) => {

    const getBoardDetails = props.getBoardDetails;

    const [list, setList] = useState({});
    const [cards, setCards] = useState([]);
    const [sortBy, setSortBy] = useState(SortCard.POSITION_ASC);
    const [onTextChangedNewCardTitle, setTextChangedNewCardTitle] = useState('');

    useEffect(() => {
        setList(props.list);
        setCards(props.list["cards"]);
        setSortBy(SortCard.POSITION_ASC);
    }, [props.list]);

    const addNewCard = () => {
        if (onTextChangedNewCardTitle !== '') {
            axios
                .post(CREATE_A_CARD, {
                    title: onTextChangedNewCardTitle,
                    description: 'Description',
                    list: list.id,
                    position: cards.length,
                })
                .then(response => {
                    console.log("Successfully create new card: " + response.data["title"]);
                    toggleAddNewCard();
                    getBoardDetails();
                })
        }
    }

    const deleteList = () => {
        axios
            .delete(DELETE_A_LIST + list["id"] + "/")
            .then(() => {
                console.log("Successfully deleted");
                onListActionsClicked();
                getBoardDetails();
            });
    }

    const copyList = () => {
        axios
            .post(COPY_A_LIST + list["id"] + '/copy-list/')
            .then(() => {
                console.log("Successfully copy list");
                onListActionsClicked();
                getBoardDetails();
            })
    }

    const compareCards = (card1, card2) => {
        switch (sortBy) {
            case SortCard.POSITION_ASC:
                if (card1.position < card2.position) {
                    return -1;
                }
                if (card1.position > card2.position) {
                    return 1;
                }
                return 0;
            case SortCard.POSITION_DES:
                if (card1.position > card2.position) {
                    return -1;
                }
                if (card1.position < card2.position) {
                    return 1;
                }
                return 0;
            case SortCard.NAME_ASC:
                if (card1.title < card2.title) {
                    return -1;
                }
                if (card1.title > card2.title) {
                    return 1;
                }
                return 0;
            case SortCard.NAME_DES:
                if (card1.title > card2.title) {
                    return -1;
                }
                if (card1.title < card2.title) {
                    return 1;
                }
                return 0;
            default:
                if (card1.position < card2.position) {
                    return -1;
                }
                if (card1.position > card2.position) {
                    return 1;
                }
                return 0;
        }

    }

    const sordCards = (unit) => {
        setSortBy(unit);
        onListActionsClicked();
        onSortCardClicked();
    }

    // Toggle add new card
    const [isAddingNewCard, setAddingNewCard] = useState(false);
    const toggleAddNewCard = () => {
        if (isAddingNewCard) {
            setAddingNewCard(false);
        } else {
            setAddingNewCard(true);
        }
    };

    // Open/close dialog list actions
    const dialogListActionsTarget = useRef(null);
    const [isDialogListActionsOpen, setDialogListActions] = useState(false);
    const onListActionsClicked = () => {
        if (isDialogListActionsOpen) {
            setDialogListActions(false);
        } else {
            setDialogListActions(true);
        }
    };

    // Open/close dialog sort cards
    const dialogSortCardsTarget = useRef(null);
    const [isDialogSortCardsOpen, setDialogSortCardsShow] = useState(false);
    const onSortCardClicked = () => {
        if (isDialogSortCardsOpen) {
            setDialogSortCardsShow(false);
        } else {
            setDialogSortCardsShow(true);
        }
    }

    return (
        <div className='card mx-1 p-2 pb-0 border-0' style={listContainer} >

            {/* Title */}
            <div className='card-header d-flex justify-content-between align-items-center py-2 px-3 mb-3 border-0 rounded text-white' style={primaryBackground}>
                <p className='my-0 mx-2'>{list["name"]} - {list["id"]}</p>
                <div
                    className='btn btn-link text-reset m-0 py-0 px-0'
                    ref={dialogListActionsTarget} onClick={onListActionsClicked}
                >
                    <FiMoreHorizontal style={iconSize20} />
                </div>
            </div>

            {/* Card items */}
            <Droppable droppableId={'' + list["id"]} key={list["id"]}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ overflowY: "auto", maxHeight: "800px" }}
                    >
                        {/* Blank space for drag & drop cards */}
                        {cards.length === 0 &&
                            <div style={{ height: "5px" }}></div>
                        }

                        {/* Cards*/}
                        {
                            cards.sort(compareCards).map((card, index) => {
                                return <BoardCardItem card={card} key={card["id"]} index={index} />
                            })
                        }

                        {provided.placeholder}

                    </div>
                )}
            </Droppable>

            {/* Button add new card */}
            {!isAddingNewCard &&
                <div
                    className='btn btn-block text-reset d-flex justify-content-start align-items-center py-2 px-3 mt-1 mb-0 rounded'
                    style={backgroundAddNewCard}
                    onClick={toggleAddNewCard}
                >
                    <AiOutlinePlus className='text-white' style={iconSize20} />
                    <p className='mx-3 my-0 text-white'>Add new card</p>
                </div>
            }

            {/* Text area add new card */}
            {isAddingNewCard &&
                <div className='rounded bg-white mb-0 p-0 d-flex flex-column'>
                    <textarea
                        className='py-2 px-3 rounded w-100 form-control' placeholder='Enter card title...'
                        onChange={string => setTextChangedNewCardTitle(string.target.value)}
                    />
                    <div className='d-flex align-items-center p-2'>
                        <Button variant='primary' className='py-1' onClick={addNewCard}>Add card</Button>
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
                            <div className='d-flex justify-content-between align-items-center p-3'>
                                <div className='btn p-0' style={{ visibility: "hidden" }}>
                                    <MdClose style={iconSize20} />
                                </div>
                                <h6 className='m-0'>List actions</h6>
                                <div className='btn p-0' onClick={onListActionsClicked}>
                                    <MdClose style={iconSize20} />
                                </div>
                            </div>

                            <hr className='m-0' />

                            {/* Copy list */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                onClick={copyList}
                            >
                                <div >
                                    <MdContentCopy style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Copy list</h6>
                            </div>

                            {/* Move list */}
                            <div className='btn p-3 d-flex align-items-center'>
                                <div>
                                    <BiMove style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Move list</h6>
                            </div>

                            {/* Sort cards */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                ref={dialogSortCardsTarget}
                                onClick={onSortCardClicked}
                            >
                                <div>
                                    <BsSortDown style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Sort cards</h6>
                            </div>

                            {/* Delete list */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                onClick={deleteList}
                            >
                                <div>
                                    <MdDeleteOutline style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>Delete this list</h6>
                            </div>

                        </div>
                    </Popover>
                )}
            </Overlay>

            {/* Dialog sort cards */}
            <Overlay target={dialogSortCardsTarget.current} show={isDialogSortCardsOpen} placement="right">
                {(props) => (
                    <Popover {...props}>
                        <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                            {/* Header */}
                            <div className='d-flex justify-content-between align-items-center p-3'>
                                <div className='btn p-0' style={{ visibility: "hidden" }}>
                                    <MdClose style={iconSize20} />
                                </div>
                                <h6 className='m-0'>Sort cards</h6>
                                <div className='btn p-0' onClick={onSortCardClicked}>
                                    <MdClose style={iconSize20} />
                                </div>
                            </div>

                            <hr className='m-0' />

                            {/* Sort by POSITION ASCENDING */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                onClick={() => sordCards(SortCard.POSITION_ASC)}
                            >
                                <div >
                                    <BsSortNumericDown style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>By position ascending</h6>
                            </div>

                            {/* Sort by POSITION DESCENDING */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                onClick={() => sordCards(SortCard.POSITION_DES)}
                            >
                                <div>
                                    <BsSortNumericDownAlt style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>By position descending</h6>
                            </div>

                            {/* Sort by NAME ASCENDING */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                onClick={() => sordCards(SortCard.NAME_ASC)}
                            >
                                <div>
                                    <BsSortAlphaDown style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>By name ascending</h6>
                            </div>

                            {/* Sort by NAME DESCENDING */}
                            <div
                                className='btn p-3 d-flex align-items-center'
                                onClick={() => sordCards(SortCard.NAME_DES)}
                            >
                                <div>
                                    <BsSortAlphaDownAlt style={iconSize20} />
                                </div>
                                <h6 className='mx-3 my-0'>By name descending</h6>
                            </div>

                        </div>
                    </Popover>
                )}
            </Overlay>
        </div>
    );
}

export default BoardList;
