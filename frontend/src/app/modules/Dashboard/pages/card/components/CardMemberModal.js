import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { TextField } from '@material-ui/core';
import { iconSize20, iconSize24, lightGreyBackground } from '../../board/components/BoardStyles';
import { addMemberToCard, removeMemberToCard } from '../../../_redux/card/cardCrud';
import { FcCheckmark } from 'react-icons/all';

function CardMemberModal({ cardId, boardMembers, cardMembers, setCardMembers, isOpen, handleCloseButtonClick }) {

  const [displayedMembers, setDisplayedMembers] = useState([]); // used with search query
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // add `isCardMember` field to all obj in boardMembers arr
    const tempCandidates = boardMembers.map(obj => ({
        ...obj,
        isCardMember: cardMembers ? Boolean(cardMembers.find(mem => mem.id === obj.id)) : false
      })
    );
    console.log(tempCandidates);
    setDisplayedMembers(tempCandidates);
  }, [boardMembers, cardMembers]);

  // filter displayedMembers by search Query
  useEffect(() => {
    if (searchQuery) {
      setDisplayedMembers([...displayedMembers].filter((c) => c.username.includes(searchQuery) ||
        c.first_name.includes(searchQuery) || c.last_name.includes(searchQuery)));
    }
  }, [searchQuery]);

  const handleSelectCandidate = candidate => {
    console.log(candidate);
    if (candidate.isCardMember) {
      console.log('remove candidate', candidate.id);
      removeMemberToCard(cardId, candidate.id)
        .then(res => {
          console.log(res);
          setCardMembers([...cardMembers].filter(mem => mem.id !== candidate.id));
        })
        .catch(e => console.log(e));
    } else {
      console.log('add candidate', candidate.id);
      console.log(candidate);
      addMemberToCard(cardId, candidate.id)
        .then(res => {
          console.log(res);
          setCardMembers([...cardMembers, candidate]);
        })
        .catch(e => console.log(e));
    }
  };

  return (
    <React.Fragment>
      <Modal show={isOpen} onHide={handleCloseButtonClick} centered size={'sm'}>
        <Modal.Header closeButton>
          <Modal.Title>Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <TextField
              fullWidth
              onChange={(e) => setSearchQuery(e.target.value)}
              className={'w-100 ml-2'}
              multiline
              placeholder={'Search members...'}
              variant='standard'
            />
            <div style={{ minHeight: '150px' }}>
              <div className='mt-3 d-flex flex-column'>
                {
                  displayedMembers && displayedMembers.map(candidate => {
                    return (
                      <button className='d-flex align-items-center p-3 mb-2 border-0 rounded'
                              style={lightGreyBackground}
                              key={candidate.id}
                              onClick={() => handleSelectCandidate(candidate)}
                      >
                        <img src={candidate.avatar} className='rounded-circle' style={iconSize24} />
                        <p className='ml-5 mb-0' style={{ fontSize: '12px' }}>
                          {candidate.first_name} {candidate.last_name}
                        </p>
                        {
                          candidate.isCardMember ?
                            <FcCheckmark className={'mr-0 ml-auto'} style={iconSize20} /> : ''
                        }
                      </button>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseButtonClick}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default CardMemberModal;