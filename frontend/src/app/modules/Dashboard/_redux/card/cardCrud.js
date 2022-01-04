import axios from "axios";
import { BACKEND_ORIGIN } from '../../../../../config';

// READ
export const getCardDetails = (cardId) => {
  const GET_CARD_DETAIL_URL = BACKEND_ORIGIN + `api/v1/cards/${cardId}/details`;
  return axios.get(GET_CARD_DETAIL_URL);
}

export const updateCardDetails = (cardId, cardData) => {
  const PATCH_CARD_URL = BACKEND_ORIGIN + `api/v1/cards/${cardId}/`;
  return axios.patch(PATCH_CARD_URL, cardData);
}

export const addCommentToCard = (cardId, userId, content) => {
  const POST_COMMENT_CARD_URL = BACKEND_ORIGIN + `api/v1/comments/`;
  const data = {
    card: cardId,
    user: userId,
    content: content
  }
  return axios.post(POST_COMMENT_CARD_URL, data);
}

export const deleteCommentInCard = (cmtId) => {
  const DELETE_COMMENT_URL = BACKEND_ORIGIN + `api/v1/comments/${cmtId}`;
  return axios.delete(DELETE_COMMENT_URL);
}

export const updateCommentInCard = (cmtId, content) => {
  const PATCH_COMMENT_URL = BACKEND_ORIGIN + `api/v1/comments/${cmtId}/`;
  return axios.patch(PATCH_COMMENT_URL, {
    content: content
  });
}

export const archiveCard = (cardId) => {
  const POST_ARCHIVE_CARD_URL = BACKEND_ORIGIN + `api/v1/cards/${cardId}/archive/`;
  return axios.post(POST_ARCHIVE_CARD_URL);
}

export const addMemberToCard = (cardId, memberId) => {
  const POST_ADD_MEMBER_TO_CARD = BACKEND_ORIGIN + `api/v1/cards/${cardId}/members/`;
  return axios.post(POST_ADD_MEMBER_TO_CARD, {
    id: memberId
  })
}

export const removeMemberToCard = (cardId, memberId) => {
  const DELETE_ADD_MEMBER_TO_CARD = BACKEND_ORIGIN + `api/v1/cards/${cardId}/members/`;
  return axios.delete(DELETE_ADD_MEMBER_TO_CARD, {
    data: {
      id: memberId
    }
  })
}
