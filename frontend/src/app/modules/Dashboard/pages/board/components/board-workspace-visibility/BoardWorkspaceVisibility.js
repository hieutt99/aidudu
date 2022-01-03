import React, { useState, useRef } from 'react';
import { Popover, Overlay, Button } from 'react-bootstrap';
import { BsPeople } from "react-icons/bs";
import { BiWorld } from "react-icons/bi";
import { MdClose, MdLockOutline } from "react-icons/md";
import { iconSize20, popoverDialogContainer } from '../BoardStyles';

const BoardWorkspaceVisibility = (props) => {

    // Open/close dialog workspace visibility
    const dialogWorkspaceVisibilityTarget = useRef(null);
    const [isDialogWorkspaceVisibilityOpen, setDialogWorkspaceVisibility] = useState(false);
    const onWorkspaceVisibleButtonClicked = () => {
        if (isDialogWorkspaceVisibilityOpen) {
            setDialogWorkspaceVisibility(false);
        } else {
            setDialogWorkspaceVisibility(true);
        }
    };

    return (
        <>
            {/* Workspace visibility */}
            <Button
                variant='secondary' className={"mx-2 p-3 rounded d-flex align-items-center"}
                ref={dialogWorkspaceVisibilityTarget} onClick={onWorkspaceVisibleButtonClicked}
            >
                <div className='d-flex align-items-center'>
                    <BsPeople style={iconSize20} />
                    <h6 className='my-0 mx-2'>Workspace Visible</h6>
                </div>

            </Button>

            {/* Dialog workspace visibility */}
            <Overlay target={dialogWorkspaceVisibilityTarget.current} show={isDialogWorkspaceVisibilityOpen} placement="bottom">
                {(props) => (
                    <Popover {...props}>
                        <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                            {/* Header */}
                            <div className='d-flex justify-content-between align-items-center p-3'>
                                <div className='btn p-0' onClick={() => { setDialogWorkspaceVisibility(false) }}>
                                    <MdClose style={iconSize20} />
                                </div>
                                <h6 className='m-0'>Workspace visibility</h6>
                                <div className='btn p-0' onClick={() => { setDialogWorkspaceVisibility(false) }}>
                                    <MdClose style={iconSize20} />
                                </div>
                            </div>

                            <hr className='m-0' />

                            {/* Private */}
                            <div className='d-flex p-3'>
                                <div>
                                    <MdLockOutline style={iconSize20} />
                                </div>
                                <div className='d-flex flex-column mx-3'>
                                    <h6 className='m-0'><strong>Private</strong></h6>
                                    <p className='m-0'>Only board member can see and edit this board.</p>
                                </div>
                            </div>

                            {/* Workspace */}
                            <div className='d-flex p-3'>
                                <div>
                                    <BsPeople style={iconSize20} />
                                </div>
                                <div className='d-flex flex-column mx-3'>
                                    <h6 className='m-0'><strong>Workspace</strong></h6>
                                    <p className='m-0'>All members of the Workspace can see and edit this board. The board must be added to a Workspace to enable this.</p>
                                </div>
                            </div>

                            {/* Public */}
                            <div className='d-flex p-3'>
                                <div>
                                    <BiWorld style={iconSize20} />
                                </div>
                                <div className='d-flex flex-column mx-3'>
                                    <h6 className='m-0'><strong>Public</strong></h6>
                                    <p className='m-0'>Anyone on the internet can see this board. Only board members can edit.</p>
                                </div>
                            </div>


                        </div>
                    </Popover>
                )}
            </Overlay>

        </>
    );
}

export default BoardWorkspaceVisibility;