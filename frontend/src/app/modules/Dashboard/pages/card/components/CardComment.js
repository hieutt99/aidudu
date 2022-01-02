import React, { useRef, useState } from 'react';
import { Button, Col, Image, Overlay, Popover, Row } from 'react-bootstrap';
import { BsPersonCircle } from 'react-icons/bs';
import { iconSize20, iconSize34, popoverDialogContainer } from '../../board/components/BoardStyles';
import { Avatar, Input, TextField } from '@material-ui/core';
import { MdClose } from 'react-icons/md';
import { timeSince } from '../../../../../utils/dateUtils';

function CardComment(
  {
    cardId,
    userId,
    cmt,
    onDelete: handleCommentDelete,
    onEdit: handleCommentEdit
  }) {

  // EDIT BUTTON
  const editInputRef = useRef();
  const [isEditable, setIsEditable] = useState(false);

  const onEditButtonClicked = () => {
    setIsEditable(true);
  };

  const onSaveButtonClicked = () => {
    setIsEditable(false);
    handleCommentEdit(cmt.id, editInputRef.current.value);
  };

  // DELETE BUTTON
  const commentDeleteDialogTarget = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const onDeleteButtonClicked = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  const onDeleteConfirmClicked = () => {
    handleCommentDelete(cmt.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Row>
        <Col lg={1}>
          <Row className='align-items-center'>
            <Avatar alt={`${cmt.user.username}`} src={`${cmt.user.avatar}`} style={iconSize34}/>
          </Row>
        </Col>
        <Col lg={11} className={'pl-5'}>
          <Row>
            <h6>{`${cmt.user.username}`}</h6>
            <p className={'ml-auto mr-0'}>{timeSince(new Date(cmt.updated))}</p>
          </Row>
          <Row>
            <Input
              fullWidth
              className={'w-100'}
              multiline
              inputRef={editInputRef}
              disabled={!isEditable}
              defaultValue={cmt.content}
              variant='outlined'
              inputProps={{ style: { color: '#3F4254' } }}
            />
          </Row>
          { isEditable ?
            <Row>
              <Button variant='link'
                      size={'sm'}
                      onClick={onSaveButtonClicked}>
                Save
              </Button>
            </Row> : ''
          }
          {
            cmt.user.id === userId && !isEditable ?
              <Row>
                {/*EDIT BUTTON SECTION===========================================*/}
                <Button
                  style={{ color: '#5e6c84' }}
                  variant='link'
                  size={'sm'}
                  onClick={onEditButtonClicked}
                >
                  Edit
                </Button>
                {/*END EDIT BUTTON SECTION*/}

                {/*DELETE BUTTON SECTION===========================================*/}
                <Button
                  ref={commentDeleteDialogTarget}
                  style={{ color: '#5e6c84' }}
                  variant='link'
                  size={'sm'}
                  onClick={onDeleteButtonClicked}
                >
                  Delete
                </Button>
                {/*DELETE POPUP DIALOG*/}
                <Overlay target={commentDeleteDialogTarget.current} show={isDeleteDialogOpen} placement='right'>
                  {(props) => (
                    <Popover {...props}>
                      <div className='rounded bg-white p-0 d-flex flex-column'>
                        {/* Header */}
                        <div className='d-flex justify-content-between align-items-center p-3'>
                          <h6 className='m-0'>Delete comment?</h6>
                          <div className='btn p-0' onClick={() => {
                            setIsDeleteDialogOpen(false);
                          }}>
                            <MdClose style={iconSize20} />
                          </div>
                        </div>
                        <hr className='m-0' />
                        <div className='p-3'>
                          <p className='m-0'>Deleting a comment is forever. There is no undo.</p>
                        </div>
                        <Button variant='danger' className='mx-3 mb-3 mt-0' onClick={onDeleteConfirmClicked}>
                          Delete comment
                        </Button>
                      </div>
                    </Popover>
                  )}
                </Overlay>
                {/*END DELETE BUTTON SECTION*/}
              </Row> : ''
          }
        </Col>
      </Row>
    </>
  );
}

export default CardComment;