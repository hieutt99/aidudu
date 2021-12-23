import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import BoardCardItem from '../board-card-item/BoardCardItem';

const BoardList = (props) => {

    const iconSize20 = {
        width: "20px",
        height: "20px",
    };

    const listContainer = {
        minWidth: "300px",
        maxWidth: "300px",
        height: "auto",
        backgroundColor: "#0000001a",
    };

    const listTitle = {
        backgroundColor: "#1976D2",
    };

    const backgroundAddNewCard = {
        backgroundColor: "#181c1480",
    };

    return (
        <div className='card mx-1 p-2 pb-0 border-0' style={listContainer} >
            {/* Title */}
            <div className='card-header d-flex justify-content-between align-items-center py-2 px-3 mb-3 border-0 rounded text-white' style={listTitle}>
                <p className='m-0'>List Title</p>
                <div className='btn btn-link text-reset m-0 py-0 px-0'>
                    <FiMoreHorizontal style={iconSize20} />
                </div>
            </div>

            {/* Card items */}
            <Droppable droppableId={1} key={1}>
                {(provided) => (
                    <div style={{ overflowY: "auto", maxHeight: "800px", }}
                        innerRef={provided.innerRef}
                        {...provided.droppableProps}>

                        {/* Card 1*/}
                        <BoardCardItem />

                        {provided.placeholder}

                    </div>
                )}

            </Droppable>

            {/* Button add new card */}
            <div className='btn btn-block text-reset d-flex justify-content-start align-items-center py-2 px-3 mt-1 mb-2 rounded' style={backgroundAddNewCard}>
                <AiOutlinePlus className='text-white' style={iconSize20} />
                <p className='mx-3 my-0 text-white'>Add new card</p>
            </div>
        </div>
    );
}

export default BoardList;
