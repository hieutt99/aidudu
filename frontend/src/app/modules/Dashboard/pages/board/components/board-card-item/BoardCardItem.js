import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { BsCheck2Square } from "react-icons/bs";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdAttachFile } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";

const BoardCardItem = (props) => {

    const iconSize24 = {
        width: "24px",
        height: "24px",
    };

    const iconSize20Grey = {
        width: "20px",
        height: "20px",
        color: "#b8b8b8",
    };

    const label = {
        flexWrap: "wrap",
        gap: "5px 5px",
    };

    const iconContainer = {
        flexWrap: "wrap",
        gap: "5px 10px",
    };

    return (
        <Draggable draggableId={1} index={0} key={1}>
            {(provided) => (
                <div
                    className='card-body rounded bg-white shadow-2 mb-2'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                >
                    {/* Label items */}
                    <div className='d-flex align-items-start justify-content-start mb-3' style={label}>
                        {/* Label */}
                        <div className='btn btn-primary text-white px-2 py-1'>
                            Henlo
                        </div>
                        <div className='btn btn-success text-white px-2 py-1'>
                            J label
                        </div>
                        <div className='btn btn-danger text-white px-2 py-1'>
                            Label cheems
                        </div>
                        <div className='btn btn-info text-white px-2 py-1'>
                            cate
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        Do something
                    </div>

                    {/* Icon items */}
                    <div className='d-flex align-items-center justify-content-start mt-3' style={iconContainer}>
                        <BiMenuAltLeft style={iconSize20Grey} />
                        <MdAttachFile style={iconSize20Grey} />
                        <GoCommentDiscussion style={iconSize20Grey} />
                        <BsCheck2Square style={iconSize20Grey} />
                    </div>

                    {/* Members */}
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