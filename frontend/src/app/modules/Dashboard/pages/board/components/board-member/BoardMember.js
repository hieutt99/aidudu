import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Popover, Overlay, Image } from 'react-bootstrap';
import { MdClose } from "react-icons/md";
import axios from 'axios';
import { iconSize24, iconSize20, iconSize50, popoverDialogContainer } from '../BoardStyles';
import { BACKEND_ORIGIN } from '../../../../../../../config';

const BoardMember = (props) => {

    const member = props.member;
    const user = useSelector((state) => state.auth.user);

    // Open/close dialog board member 
    const dialogMemberTarget = useRef(null);
    const [isDialogMemberOpen, setDialogMember] = useState(false);
    const onMemberClicked = () => {
        if (isDialogMemberOpen) {
            setDialogMember(false);
        } else {
            setDialogMember(true);
        }
    };

    // const removeMember = () => {
    //     axios.post(`${BACKEND_ORIGIN}api/v1/boards/${board.id}/leave/`)
    // }

    return (
        <>
            {/* Member's avatar */}
            <img
                className={"rounded-circle"} style={iconSize24} src={member.avatar} type='button'
                data-toggle="tooltip" data-placement="bottom" title={member.username}
                ref={dialogMemberTarget} onClick={onMemberClicked}
            />

            {/* Dialog board member */}
            <Overlay target={dialogMemberTarget.current} show={isDialogMemberOpen} placement="bottom">
                {(props) => (
                    <Popover {...props}>
                        <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                            {/* Header */}
                            <div className='d-flex justify-content-between align-items-center p-3'>
                                <div className='btn p-0' onClick={() => { setDialogMember() }}>
                                    <MdClose style={iconSize20} />
                                </div>
                                <h6 className='m-0'>{member.username}</h6>
                                <div className='btn p-0' onClick={() => { setDialogMember() }}>
                                    <MdClose style={iconSize20} />
                                </div>
                            </div>

                            <hr className='m-0' />

                            {/* User's info */}
                            <div className='d-flex p-3 align-items-center'>
                                <div>
                                    <Image roundedCircle style={iconSize50} src={member.avatar} />
                                </div>
                                <div className='d-flex flex-column mx-3'>
                                    <h6 className='m-0'><strong>{member.username}</strong></h6>
                                </div>
                            </div>

                            {/* Current user can leave board and remove others from board */}
                            {member.id === user.id
                                ? <Button variant='danger' className='mx-3 mt-0 mb-3 py-2'>Leave board</Button>
                                : <Button variant='danger' className='mx-3 mt-0 mb-3 py-2'>Remove from board</Button>
                            }

                        </div>
                    </Popover>
                )}
            </Overlay>
        </>
    )
};

export default BoardMember;