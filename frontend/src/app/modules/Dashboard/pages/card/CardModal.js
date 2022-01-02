import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
  addCommentToCard, archiveCard,
  deleteCommentInCard,
  getCardDetails,
  updateCardDetails, updateCommentInCard
} from '../../_redux/card/cardCrud';
import { iconSize20, iconSize34 } from '../board/components/BoardStyles';
import { BsFillCreditCardFill, BsPeople, BsPersonCircle } from 'react-icons/bs';
import { Avatar, Input, TextField } from '@material-ui/core';
import {
  BiCommentDetail,
  FiArchive,
  HiArrowRight, ImAttachment,
  ImParagraphJustify,
  MdChecklistRtl,
  MdOutlineLabel
} from 'react-icons/all';
import DatePicker from 'react-datepicker';
import { toIsoString } from '../../../../utils/dateUtils';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import CardComment from './components/CardComment';
import { BACKEND_ORIGIN } from '../../../../../config';
import CardMove from './components/CardMove';

const CardModal = ({ open, onClose, lists }) => {
  //
  const { cardId } = useParams();
  const { id: userId, username, avatar } = useSelector((state) => state.auth.user);
  const userAvatar = BACKEND_ORIGIN + '' + avatar.substring(1); //remove first slash in avatar
  //
  const [cardData, setCardData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isCardTitleFocus, setIsCardTitleFocus] = useState(false);
  //
  const commentRef = useRef();

  useEffect(() => {
    getCardDetails(cardId)
      .then(response => {
        console.log(response.data);
        setCardData(response.data);
        if (response.data.start !== null) setStartDate(new Date(response.data.start));
        if (response.data.due !== null) setDueDate(new Date(response.data.due));
      })
      .catch(error => {
        console.log('Error get card details: ' + error);
      });
  }, []);

  const handleCardTextFieldChange = async (event, field) => {
    let newData = { ...cardData };
    newData[field] = event.target.value;
    console.log(newData);
    if (newData[field] !== cardData[field]) {
      await setCardData(newData);
      updateCardDetails(cardId, newData)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log('Error patch card details: ' + error);
        });
    }
  };

  const handleStartDateChange = date => {
    setStartDate(date);
    updateCardDetails(cardId, {
      start: toIsoString(date)
    }).then(r => {
      // ignore
    });
  };

  const handleDueDateChange = date => {
    if (date < startDate) {
      toast.error('Cannot set due date < start date', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true
      });
    } else {
      setDueDate(date);
      updateCardDetails(cardId, {
        due: toIsoString(date)
      }).then(r => {
        // ignore
      });
    }
  };

  const handleCommentEdit = (cmtId, content) => {
    updateCommentInCard(cmtId, content)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err))
  }

  const handleCommentDelete = (cmtId) => {
    deleteCommentInCard(cmtId)
      .then(res => {
        setCardData({
          ...cardData,
          comments: cardData.comments.filter(cmt => cmt.id !== cmtId)
        })
      })
      .catch(err => console.log(err))
  }

  const handleCommentSave = () => {
    if (commentRef.current.value) {
      addCommentToCard(cardId, userId, commentRef.current.value)
        .then(res => {
          console.log(res);
          commentRef.current.value = '';
          const comment = {
            ...res.data,
            user: {
              id: res.data.user,
              username: username,
              avatar: userAvatar
            }
          }
          console.log(comment);
          setCardData({
            ...cardData,
            comments: [...cardData.comments, comment]
          })
        })
        .catch(err => console.log(err));
    }
  };

  const onCardArchiveClicked = () => {
    archiveCard(cardId)
      .then(r => {
        console.log(r);
        toast.success(`Card archived OK`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true
        });
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <Modal size={'lg'} show={open} onHide={() => onClose()} centered>
        <Modal.Body>
          <Container>
            <Row>
              <Col lg={9} style={{ paddingRight: '5rem' }}>
                <Row className={'mb-2'}>
                  <BsFillCreditCardFill style={iconSize20} className={'mr-5 align-self-center'} />
                  {
                    isCardTitleFocus ?
                      <TextField
                        multiline
                        autoFocus
                        variant='outlined'
                        defaultValue={`${cardData.title}`}
                        InputProps={{style: {fontSize: '1.60rem', color: '#3F4254'}}}
                        onBlur={(event) => {
                          handleCardTextFieldChange(event, 'title').then(r => {});
                          setIsCardTitleFocus(false);
                        }}
                      />
                      :
                      <h2
                        className={'font-weight-bolder mb-0'}
                        onClick={() => setIsCardTitleFocus(true)}
                      >
                        {`${cardData.title}`}
                      </h2>
                  }
                </Row>
                <Row className={'mb-2'}>
                  <div className={'text-dark-50 font-size-lg text-justify'}>
                    {`In list ${cardData.list}`}
                  </div>
                </Row>

                <br />

                {/*BEGIN DUE DATE SECTION*/}
                <Row>
                  <Col lg={6}>
                    <Row className='align-items-center'>
                      <h6 className='mb-0'>Start Date</h6>
                    </Row>
                    <Row className={'mt-2'}>
                      <div>
                        <style>
                          {`.date-picker input {
                                width: 100%
                             }
                          `}
                        </style>
                        <DatePicker
                          // wrapperClassName="date-picker"
                          selected={startDate}
                          onChange={(date) => handleStartDateChange(date)}
                          timeInputLabel='Time:'
                          dateFormat='MM/dd/yyyy h:mm aa'
                          showTimeInput
                        />
                      </div>
                    </Row>
                  </Col>
                  <Col lg={6}>
                    <Row className='align-items-center'>
                      <h6 className='mb-0'>Due Date</h6>
                    </Row>
                    <Row className={'mt-2'}>
                      <DatePicker
                        wrapperClassName='date-picker'
                        selected={dueDate}
                        onChange={(date) => handleDueDateChange(date)}
                        timeInputLabel='Time:'
                        dateFormat='MM/dd/yyyy h:mm aa'
                        showTimeInput
                      />
                    </Row>
                  </Col>
                </Row>
                {/*END DUE DATE SECTION*/}

                <br />

                {/*BEGIN DESCRIPTION SECTION*/}
                <Row className='mt-5 align-items-center'>
                  <ImParagraphJustify style={iconSize20} className={'mr-5 '} />
                  <h6 className='mb-0'>Description</h6>
                </Row>
                <Row>
                  <TextField
                    fullWidth
                    className={'mr-0'}
                    margin='normal'
                    multiline
                    variant='filled'
                    defaultValue={cardData.description}
                    InputProps={{ disableUnderline: true, style: {fontSize: '1.1rem'}}}
                    onBlur={(event) => handleCardTextFieldChange(event, 'description')}
                  />
                </Row>
                {/*END DESCRIPTION SECTION*/}

                {/*  TODO: add checklist*/}
                <br />

                {/* BEGIN COMMENTS SECTION*/}
                <Row className='align-items-center'>
                  <BiCommentDetail style={iconSize20} className={'mr-5'} />
                  <h6 className='mb-0'>Comments</h6>
                </Row>

                {/* COMMENT INPUT*/}
                <Row className={'mt-5'}>
                  <Col lg={1}>
                    <Row className='align-items-center'>
                      {/*<BsPersonCircle style={iconSize34} className={'mr-5 justify-content-center'} />*/}
                      <Avatar alt={`${username}`} src={`${userAvatar}`} style={iconSize34}/>
                    </Row>
                  </Col>
                  <Col lg={9}>
                    <Row>
                      <TextField
                        fullWidth
                        inputRef={commentRef}
                        className={'w-100 ml-2'}
                        multiline
                        placeholder={'leave a comment'}
                        variant='standard'
                      />
                    </Row>
                  </Col>
                  <Col lg={2}>
                    <Button className={'ml-5'} onClick={handleCommentSave} size="sm">Save</Button>
                  </Col>
                </Row>
                <br/>
                {/* END COMMENT INPUT */}

                {/* COMMENT LIST */}
                {
                  cardData.comments && cardData.comments.map((cmt, key) => {
                    return (
                      <div key={key}>
                        <br/>
                        <CardComment cardId={cardId} userId={userId} cmt={cmt} onDelete={handleCommentDelete} onEdit={handleCommentEdit}/>
                      </div>
                    );
                  })
                }
                {/* END COMMENT LIST */}
                {/* END COMMENTS SECTION */}
              </Col>

              {/*===============================================================================================*/}

              {/*RIGHT SIDE BAR FUNCTIONALITIES*/}
              <Col lg={3} className={'mt-3 pl-3'}>
                <Row className={'mb-2'}>
                  <h6>Add to card</h6>
                </Row>
                <Row>
                  <Button
                    variant='secondary'
                    style={{ justifyContent: 'flex-start' }}
                    className={'text-left w-100 mb-3'}
                    onClick={() => {
                    }}
                  >
                    <BsPeople className={'mr-3'} style={iconSize20} />
                    Members
                  </Button>
                  <Button
                    variant='secondary'
                    style={{ justifyContent: 'flex-start' }}
                    className={'text-left w-100 mb-3'}
                    onClick={() => {
                    }}
                  >
                    <MdOutlineLabel className={'mr-3'} style={iconSize20} />
                    Labels
                  </Button>
                  <Button
                    variant='secondary'
                    style={{ justifyContent: 'flex-start' }}
                    className={'text-left w-100 mb-3'}
                    onClick={() => {
                    }}
                  >
                    <MdChecklistRtl className={'mr-3'} style={iconSize20} />
                    Checklist
                  </Button>
                </Row>
                <br />
                <Row className={'mt-4 mb-2'}>
                  <h6>Action</h6>
                </Row>
                <Row>
                  <CardMove cardId={cardId} currentListId={cardData.list} currentPosition={cardData.position} lists={lists} closeCard={onClose}/>
                  {/*TODO: list is object*/}
                  <Button
                    variant='secondary'
                    style={{ justifyContent: 'flex-start' }}
                    className={'text-left w-100 mb-3'}
                    onClick={onCardArchiveClicked}
                  >
                    <FiArchive className={'mr-3'} style={iconSize20} />
                    Archive
                  </Button>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CardModal;