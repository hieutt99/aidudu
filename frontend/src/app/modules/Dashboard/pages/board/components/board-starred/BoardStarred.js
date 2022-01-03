import React, { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { BACKEND_ORIGIN } from "../../../../../../../config";
import { iconSize20 } from "../BoardStyles";
import axios from "axios";

export const UPDATE_STARRED_BOARD = BACKEND_ORIGIN + 'api/v1/boards/';

const BoardStarred = (props) => {

    const board = props.board;
    const workSpaceId = board["workspace"];
    const boardId = board["id"];

    // Board starred
    const [isBoardStarred, setBoardStarred] = useState('false');

    useEffect(() => {
        setBoardStarred(String(board["starred"]))
        console.log("BoardStarred: " + String(board["starred"]) + " - workspace: " + workSpaceId + " board: " + boardId);
    }, [])

    const updateBoardStarred = (boardId, workspaceId) => {
        let value;
        if (isBoardStarred == 'true') {
            value = 'false';
        } else {
            value = 'true';
        }
        const data = {
            starred: value,
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
            <div className={"btn btn-secondary mx-3 p-3 rounded"} onClick={() => updateBoardStarred(boardId, workSpaceId)}>
                {isBoardStarred == 'true'
                    ? <BsStarFill style={{ color: "#e0d71b", height: "20px", width: "20px" }} />
                    : <BsStar style={iconSize20} />
                }
            </div>
        </>
    );
}

export default BoardStarred;