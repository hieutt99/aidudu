import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { HiArrowRight } from 'react-icons/all';
import { iconSize20 } from '../../board/components/BoardStyles';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { updateCardDetails } from '../../../_redux/card/cardCrud';

function CardMove({ cardId, currentListId, currentPosition, lists, closeCard }) {

  const [destination, setDestination] = useState(currentListId || '');
  const [position, setPosition] = useState(currentPosition || 0);

  useEffect(() => {
    setPosition(currentPosition);
    setDestination(currentListId);
  }, [currentListId, currentPosition, lists]);

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const handleOpen = () => {
    setIsMoveDialogOpen(!isMoveDialogOpen);
  };

  function handleClose() {
    setIsMoveDialogOpen(false);
  }

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const getMaxPositionFromList = (listId) => {
    const destinationList = lists.find((item) => item.id === listId);
    return destinationList ? lists.find((item) => item.id === listId).cards.length : 0;
  };

  const handleCardMove = () => {
    updateCardDetails(cardId, {
      list: destination,
      position: position
    })
      .then(r => {
        console.log(r);
        setIsMoveDialogOpen(false);
        closeCard();
      })
      .catch(e => console.log(e))
  }

  return (
    <>
      <Button
        variant='secondary'
        style={{ justifyContent: 'flex-start' }}
        className={'text-left w-100 mb-3'}
        onClick={handleOpen}
      >
        <HiArrowRight className={'mr-3'} style={iconSize20} />
        Move
      </Button>
      <Modal show={isMoveDialogOpen} onHide={handleClose} centered size={'sm'}>
        <Modal.Header closeButton>
          <Modal.Title>Move this card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Select Destination</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={destination ?? 0}
                label='Destination'
                onChange={handleDestinationChange}
              >
                {
                  lists.map((list, key) => (
                    <MenuItem key={key} value={list.id}>{`${list.name}`}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <br />
            <FormControl className={'mt-5'} fullWidth>
              <InputLabel id='demo-simple-select-label'>Select position</InputLabel>
              <Select
                labelId='demo-simple-select-label2'
                id='demo-simple-select2'
                value={position ?? 0}
                label='Position'
                onChange={handlePositionChange}
              >
                {
                  destination === currentListId ?
                    Array.from(Array(getMaxPositionFromList(destination)).keys())
                      .map((pos, key) => (
                        <MenuItem key={key} value={pos}>{`${pos}`}</MenuItem>
                      )) :
                    Array.from(Array(getMaxPositionFromList(destination) + 1).keys())
                      .map((pos, key) => (
                        <MenuItem key={key} value={pos}>{`${pos}`}</MenuItem>
                      ))
                }
              </Select>
            </FormControl>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleCardMove}>
            Save change
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CardMove;