// READ
import { BACKEND_ORIGIN } from '../../../../../config';
import axios from 'axios';

export const createNewChecklist = (cardId, title) => {
  const POST_CHECKLIST_URL = BACKEND_ORIGIN + `api/v1/checklists/`;
  return axios.post(POST_CHECKLIST_URL, {
    card: cardId,
    title: title
  });
}

export const deleteChecklist = (checklistId) => {
  const DELETE_CHECKLIST_URL = BACKEND_ORIGIN + `api/v1/checklists/${checklistId}`;
  return axios.delete(DELETE_CHECKLIST_URL);
}

export const updateChecklistItem = (itemId, data) => {
  const PUT_CHECKLIST_ITEM_URL = BACKEND_ORIGIN + `api/v1/checklist_items/${itemId}/`;
  return axios.put(PUT_CHECKLIST_ITEM_URL, data);
}

export const addItemToChecklist = (checklistId, content) => {
  const POST_CHECKLIST_ITEM_URL = BACKEND_ORIGIN + `api/v1/checklist_items/`;
  const data = {
    "checklist": checklistId,
    "content": content,
    "checked": false
  }
  console.log(data);
  return axios.post(POST_CHECKLIST_ITEM_URL, data);
}

export const deleteChecklistItem = (itemId) => {
  const DELETE_CHECKLIST_ITEM_URL = BACKEND_ORIGIN + `api/v1/checklist_items/${itemId}/`;
  return axios.delete(DELETE_CHECKLIST_ITEM_URL);
}