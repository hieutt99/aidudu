import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { BsCheck2Square } from "react-icons/bs";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdAttachFile } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";
import { iconSize24, iconSize20Grey, label, memberAvatarContainer } from '../BoardStyles';

const BoardCardItem = (props) => {

    const card = props.card;

    return (
        <Draggable draggableId={'1'} index={0} key={1}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className='card-body rounded bg-white shadow-2 mb-2 p-3'
                >

                    {/* Labels */}
                    {card["labels"] !== undefined && card["labels"].length > 0 &&
                        <div className='d-flex align-items-start justify-content-start mb-3' style={label}>
                            {
                                card["labels"].map((label, index) => {
                                    return <div className='btn btn-primary text-white px-2 py-1'>{label["id"]}</div>
                                })
                            }
                        </div>
                    }

                    {/* Content */}
                    <div>{card["title"]}</div>

                    {/* Icon items */}
                    <div className='d-flex align-items-center justify-content-start mt-3' style={memberAvatarContainer}>
                        <BiMenuAltLeft style={iconSize20Grey} />
                        {card["attachments"] > 0 &&
                            <MdAttachFile style={iconSize20Grey} />
                        }
                        {card["comments"] > 0 &&
                            <GoCommentDiscussion style={iconSize20Grey} />
                        }
                        {/* <BsCheck2Square style={iconSize20Grey} /> */}
                    </div>

                    {/* Member's avatar */}
                    <div className='d-flex align-items-center justify-content-end mt-3'>
                        <img className={"rounded-circle bg-success"} style={iconSize24} />
                        <img className={"rounded-circle bg-dark"} style={iconSize24} />
                        <img className={"rounded-circle bg-warning"} style={iconSize24} />
                    </div>

                </div>
            )}

        </Draggable>
    );
}

export default BoardCardItem;