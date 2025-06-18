import { getUsers, addUsers, deleteUsers, replaceUsers } from '../../services/users.service.js';
import { getRequestData, sendResponse } from '../../utils/network.js';

async function GET(req, res) {
  const users = await getUsers();

  sendResponse(res, 200, { data: users });
}

async function POST(req, res) {
  const users = await getRequestData(req);

  const savedUsers = await addUsers(users);

  sendResponse(res, 200, { data: savedUsers });
}

async function PUT(req, res) {
  const users = await getRequestData(req);

  const updatedUsers = await replaceUsers(users);

  sendResponse(res, 200, { data: updatedUsers });
}

async function DELETE(req, res) {
  await deleteUsers();

  sendResponse(res, 200, { data: [] });
}

export { GET, POST, PUT, DELETE };
