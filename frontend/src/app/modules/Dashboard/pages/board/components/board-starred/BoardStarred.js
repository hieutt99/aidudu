import React, { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { BACKEND_ORIGIN } from "../../../../../../../config";
import { iconSize20 } from "../BoardStyles";
import axios from "axios";

export const UPDATE_STARRED_BOARD = BACKEND_ORIGIN + 'api/v1/boards/';

const BoardStarred = (props) => {

    const boardId = props.boardId;
    const boardStarred = props.boardStarred;

    // Board starred
    const [isBoardStarred, setBoardStarred] = useState(false);

    useEffect(() => {
        setBoardStarred(boardStarred)
    }, [boardStarred])

    const updateBoardStarred = () => {
        const value = !isBoardStarred;
        const data = {
            starred: value,
        };
        axios.patch(UPDATE_STARRED_BOARD + boardId + '/starred/', data)
            .then((response) => {
                setBoardStarred(value);
                console.log("Successfully update board starred");
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    return (
        <>
            <div className={"btn btn-secondary mx-3 p-3 rounded"} onClick={updateBoardStarred}>
                {isBoardStarred
                    ? <BsStarFill style={iconSize20} className='text-warning'/>
                    : <BsStar style={iconSize20} />
                }
            </div>
        </>
    );
}

export default BoardStarred;