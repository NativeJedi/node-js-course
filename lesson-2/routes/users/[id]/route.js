import {
  addUserById,
  deleteUserById,
  getUsersById,
  replaceUserById,
  updateUserFieldsById,
} from '../../../services/users.service.js';
import { getRequestData, sendResponse } from '../../../utils/network.js';


async function GET(req, res, params) {
  const user = await getUsersById(params[0]);

  sendResponse(res, 200, { data: user });
}

async function POST(req, res, params) {
  const user = await getRequestData(req);

  const updatedUser = await addUserById(params[0], user);

  sendResponse(res, 200, { data: updatedUser });
}

async function PUT(req, res, params) {
  const user = await getRequestData(req);

  await replaceUserById(params[0], user);

  sendResponse(res, 200, { data: user });
}

async function PATCH(req, res, params) {
  const user = await getRequestData(req);

  await updateUserFieldsById(params[0], user);

  sendResponse(res, 200, { data: user });
}

async function DELETE(req, res, params) {
  const removed = await deleteUserById(params[0]);

  await sendResponse(res, 200, { data: removed });
}

export { GET, POST, PUT, PATCH, DELETE };
