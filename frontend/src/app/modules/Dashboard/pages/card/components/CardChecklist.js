import React, { useRef, useState } from 'react';
import { Button, Modal, Overlay, Popover, Row } from 'react-bootstrap';
import { AiFillEdit, MdDelete, MdOutlineChecklist } from 'react-icons/all';
import { iconSize20 } from '../../board/components/BoardStyles';
import { MdClose } from 'react-icons/md';
import {
  addItemToChecklist,
  deleteChecklist,
  deleteChecklistItem,
  updateChecklistItem
} from '../../../_redux/card/checklistCrud';
import { Checkbox, IconButton, TextField } from '@material-ui/core';

function CardChecklist({ checklists, setChecklists }) {

  // CHECKLIST ITEM STATEs
  const [isAddChecklistItem, setIsAddChecklistItem] = useState(false);
  const [currentChecklistId, setCurrentChecklistId] = useState(null);
  const [currentEditItem, setCurrentEditItem] = useState(0);
  const itemCreateContentRef = useRef();
  const itemEditContentRef = useRef();

  // CHECKLIST DELETE BUTTON
  const DeleteDialogTarget = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const onDeleteButtonClicked = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  const handleDeleteChecklist = id => {
    deleteChecklist(id)
      .then(res => {
        console.log(res);
        setIsDeleteDialogOpen(false);
        setChecklists(checklists.filter((cl) => cl.id !== id)); // update checklists after delete
      })
      .catch(e => console.log(e));
  };

  const OnAddItemClick = (checklistId) => {
    setIsAddChecklistItem(true);
    setCurrentChecklistId(checklistId);
  };

  const handleModalClose = () => {
    setIsAddChecklistItem(false);
    setCurrentChecklistId(null);
  };

  const handleCreateChecklistItem = (checklistId) => {
    if (itemCreateContentRef.current.value) {
      addItemToChecklist(checklistId, itemCreateContentRef.current.value)
        .then(res => {
          setIsAddChecklistItem(false);
          if (res.status === 201 && res.data) {
            // add item into checklists
            const newChecklists = [...checklists]
            newChecklists.forEach((cl) => {
              if (cl.id === res.data.checklist) {
                cl.items = [...cl.items, res.data];
              }
            })
            setChecklists(newChecklists);
          }
        })
        .catch(e => console.log(e));
    }
  };

  const handleCheckBoxChange = (item) => {
    updateChecklistItem(item.id, {
      checked: !item.checked
    })
      .then(res => {
        console.log(res);
        if (res.status === 200 && res.data) {
          // update item from checklists
          const newChecklists = [...checklists]
          newChecklists.forEach((cl) => {
            if (cl.id === res.data.checklist) {
              cl.items.splice(cl.items.findIndex(o => o.id === res.data.id), 1, res.data);
            }
          })
          setChecklists(newChecklists);
        }
      })
      .catch(e => console.log(e));
  };

  const handleItemDelete = item => {
    deleteChecklistItem(item.id)
      .then(res => {
        if (res.status === 204) {
          // delete item from checklists
          const newChecklists = [...checklists]
          newChecklists.forEach((cl) => {
            if (cl.id === item.checklist) {
              cl.items.splice(cl.items.findIndex(o => o.id === item.id), 1);
            }
          })
          setChecklists(newChecklists);
        }
      })
      .catch(e => console.log(e))
  }

  const handleItemEditSave = item => {
    if (itemEditContentRef && itemEditContentRef.current.value !== item.content) {
      updateChecklistItem(item.id, {
        content: itemEditContentRef.current.value
      })
        .then(res => {
          setCurrentEditItem(0);
          if (res.status === 200 && res.data) {
            // update item from checklists
            const newChecklists = [...checklists]
            newChecklists.forEach((cl) => {
              if (cl.id === res.data.checklist) {
                cl.items.splice(cl.items.findIndex(o => o.id === res.data.id), 1, res.data);
              }
            })
            setChecklists(newChecklists);
          }
        })
        .catch(e => console.log(e));
    }

  }

  return (
    checklists ?
      checklists.map((checklist, key) => {
        return (
          <div key={key}>
            <Row className='mt-5 align-items-center'>
              <MdOutlineChecklist style={iconSize20} className={'mr-5 '} />
              <h6 className='mb-0'>{`${checklist.title}`}</h6>
              <Button
                className={'mr-0 ml-auto'}
                variant={'secondary'}
                size={'sm'}
                onClick={() => OnAddItemClick(checklist.id)}
              >
                Add item
              </Button>
              <Button
                ref={DeleteDialogTarget}
                className={'mr-0 ml-3'}
                variant={'secondary'}
                size={'sm'}
                onClick={onDeleteButtonClicked}
              >
                Delete
              </Button>

              {/*DELETE POPUP DIALOG*/}
              <Overlay target={DeleteDialogTarget.current} show={isDeleteDialogOpen} placement='right'>
                {(props) => (
                  <Popover {...props}>
                    <div className='rounded bg-white p-0 d-flex flex-column'>
                      {/* Header */}
                      <div className='d-flex justify-content-between align-items-center p-3'>
                        <h6 className='m-0'>Delete Checklist?</h6>
                        <div className='btn p-0' onClick={() => {
                          setIsDeleteDialogOpen(false);
                        }}>
                          <MdClose style={iconSize20} />
                        </div>
                      </div>
                      <hr className='m-0' />
                      <div className='p-3'>
                        <p className='m-0'>Deleting a checklist is permanent and there is no way to get it
                          back.</p>
                      </div>
                      <Button variant='danger' className='mx-3 mb-3 mt-0'
                              onClick={() => handleDeleteChecklist(checklist.id)}>
                        Delete checklist
                      </Button>
                    </div>
                  </Popover>
                )}
              </Overlay>
              {/*END DELETE BUTTON SECTION*/}
            </Row>
            {
              checklist.items && checklist.items.length > 0 ?
                <>
                  {
                    checklist.items.map((item, key) => {
                      return (
                        <Row key={key} className={'mt-3 align-items-center'}>
                          {
                            currentEditItem !== 0 && currentEditItem === item.id ?
                              <>
                                <TextField
                                  inputRef={itemEditContentRef}
                                  multiline
                                  autoFocus
                                  variant='outlined'
                                  defaultValue={`${item.content}`}
                                  // InputProps={{ style: { fontSize: '1.60rem', color: '#3F4254' } }}
                                />
                                <Button
                                  variant={'link'} size={'sm'}
                                  className={'mr-0 ml-auto'}
                                  onClick={() => handleItemEditSave(item)}
                                >
                                  Save
                                </Button>
                              </>
                              :
                              <>
                                <Checkbox
                                  checked={item.checked}
                                  onChange={() => handleCheckBoxChange(item)}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                  className={'ml-0 pl-0 mr-3'}
                                />
                                <p
                                  className={'mt-auto mb-auto'}
                                  style={{ textDecoration: item.checked ? "line-through" : ""}}
                                >
                                  {`${item.content}`}
                                </p>
                                <IconButton
                                  className={'mr-0 ml-auto'} aria-label={'edit'} size="small"
                                  onClick={() => setCurrentEditItem(item.id)}
                                >
                                  <AiFillEdit />
                                </IconButton>
                                <IconButton
                                  className={'mr-0 ml-3'} aria-label={'edit'} size="small"
                                  onClick={() => handleItemDelete(item)}
                                >
                                  <MdDelete />
                                </IconButton>
                              </>
                          }
                        </Row>
                      );
                    })
                  }
                </>
                : '' // checklist.items ?
            }
            {
              isAddChecklistItem && currentChecklistId ?
                <Modal show={isAddChecklistItem} onHide={handleModalClose} centered size={'sm'}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add an item</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <TextField
                        fullWidth
                        inputRef={itemCreateContentRef}
                        className={'w-100 ml-2'}
                        multiline
                        placeholder={'item content'}
                        variant='standard'
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleModalClose}>
                      Close
                    </Button>
                    <Button variant='primary' onClick={() => {
                      handleCreateChecklistItem(currentChecklistId)
                    }}>
                      Saves
                    </Button>
                  </Modal.Footer>
                </Modal>
                : ''
            }
          </div>
        );
      })
      : '' // checklists ?
  );
}

export default CardChecklist;
