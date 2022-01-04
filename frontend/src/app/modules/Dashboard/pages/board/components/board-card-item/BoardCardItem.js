import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { BsCheck2Square } from "react-icons/bs";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdAttachFile } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";
import { iconSize24, iconSize20Grey, label, memberAvatarContainer } from '../BoardStyles';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

const BoardCardItem = (props) => {

    const card = props.card;
    const index = props.index;

    const history = useHistory();
    const path  = useLocation();

    const handleCardClick = (cardId) => {
        history.push({
         pathname: `${path.pathname}/card/${cardId}`
        });
    };

    return (
        <Draggable draggableId={'' + card["id"]} index={index} key={card["id"]}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className='card-body rounded bg-white shadow-2 mb-2 p-3' type='button'
                    onClick={() => handleCardClick(card["id"])}
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
                    <div>{card["title"]} - {card["id"]}</div>

                    {/* Icon items */}
                    <div className='d-flex align-items-center justify-content-start mt-3' style={memberAvatarContainer}>
                        <BiMenuAltLeft style={iconSize20Grey} />
                        {card["attachments"] > 0 &&
                            <MdAttachFile style={iconSize20Grey} />
                        }
                        {card["comments"] > 0 &&
                            <GoCommentDiscussion style={iconSize20Grey} />
                        }
                        {card["checklists"].length > 0 &&
                            <BsCheck2Square style={iconSize20Grey} />
                        }
                    </div>

                    {/* Member's avatar */}
                    {card["members"] !== undefined && card["members"].length > 0 &&
                        <div className='d-flex align-items-center justify-content-end mt-3'>
                            {
                                card["members"].map((member, index) => {
                                    return <img key={member.id} className={"rounded-circle"} style={iconSize24} src={member.avatar}/>
                                })
                            }
                        </div>
                    }

                </div>
            )}

        </Draggable>
    );
}

export default BoardCardItem;