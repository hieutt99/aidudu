import React, { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { BACKEND_ORIGIN } from "../../../../../../../config";
import { lightGreyBackground, iconSize20 } from "../BoardStyles";
import axios from "axios";

export const UPDATE_STARRED_BOARD = BACKEND_ORIGIN + 'api/v1/boards/';

const BoardStarred = (props) => {

    const board = props.board;
    const workSpaceId = board["workspace"];
    const boardId = board["id"];

    // Board starred
    const [isBoardStarred, setBoardStarred] = useState(board["starred"]);
    console.log("BoardStarred: " + isBoardStarred + " - workspace: " + workSpaceId + " board: " + boardId);

    const updateBoardStarred = (value, boardId, workspaceId) => {
        const data = {
            starred: `${value}`,
            workspace: workspaceId
        };
        axios.put(UPDATE_STARRED_BOARD + boardId + '/', data)
            .then((response) => {
                setBoardStarred(value);
                console.log("Successfully update board starred: " + response.data["name"]);
            });
    };

    return (
        <>
            <div className={"btn mx-3 p-3 rounded"} style={lightGreyBackground} onClick={() => updateBoardStarred(!isBoardStarred, boardId, workSpaceId)}>
                {isBoardStarred
                    ? <BsStarFill style={{ color: "#e0d71b", height: "20px", width: "20px" }} />
                    : <BsStar style={iconSize20} />
                }
            </div>
        </>
    );
}

export default BoardStarred;