import React, { useEffect, useRef, useState } from 'react';
import { iconSize20, iconSize24, iconSize50, popoverDialogContainer } from '../../board/components/BoardStyles';
import { Button, Image, Overlay, Popover } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';

function CardMemberChip({ member, handleRemoveMember }) {

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log(member);
  }, [])

  // Open/close dialog board member
  const dialogMemberTarget = useRef(null);
  const [isDialogMemberOpen, setDialogMember] = useState(false);
  const onMemberClicked = () => {
    setDialogMember(!isDialogMemberOpen);
  };

  return (
    <>
      {/* Member's avatar */}
      <img
        className={'rounded-circle mr-3'}
        style={iconSize24}
        src={member.avatar}
        type='button'
        data-toggle='tooltip' data-placement='bottom'
        title={member.fullname}
        ref={dialogMemberTarget}
        onClick={onMemberClicked}
        alt={member.fullname}
      />

      {/* Dialog board member */}
      <Overlay target={dialogMemberTarget.current} show={isDialogMemberOpen} placement='bottom'>
        {(props) => (
          <Popover {...props}>
            <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer}>
              {/* Header */}
              <div className='d-flex justify-content-between align-items-center p-3'>
                <h6 className='m-0'>{`${member.fullname}`}</h6>
                <div className='btn p-0' onClick={() => {
                  setDialogMember(false);
                }}>
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
                  <h6 className='m-0'><strong>{member.fullname}</strong></h6>
                </div>
              </div>

              {/* Current user can leave board and remove others from board */}
              <Button variant='danger' className='mx-3 mt-0 mb-3 py-2'
                      onClick={() => handleRemoveMember(member)}>{member.id === user.id ? 'Leave card' : 'Remove from card'}</Button>

            </div>
          </Popover>
        )}
      </Overlay>
    </>
  );
}

export default CardMemberChip;