const {
  DataParser,
  getBodyFromRequest,
  sendResponse,
  sendErrorResponse,
} = require('../helpers');
const { User } = require('../model/users');
const usersData = new DataParser('users.json');

async function getUsers(req, res) {
  try {
    const data = await usersData.read();

    sendResponse(res, 200, { users: data });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error while getting users');
  }
}

async function postUser(req, res) {
  try {
    const body = await getBodyFromRequest(req);

    const data = await usersData.read();

    const newUser = new User({ ...body, id: data.length });

    const newData = [...data, newUser];

    await usersData.write(newData);

    sendResponse(res, 201, { user: newUser });
  } catch (error) {
    sendErrorResponse(res, 400, 'Error while creating user');
  }
}

async function putUser(req, res) {
  try {
    const body = await getBodyFromRequest(req);

    const data = await usersData.read();

    const { id, data: updatedData } = body;

    const existedUser = data[id];

    if (!existedUser) {
      sendErrorResponse(res, 404, 'User not found');
      return;
    }

    const newUser = new User({ ...existedUser, ...updatedData });

    const newData = data.map((user) => user.id === newUser.id ? newUser : user);

    await usersData.write(newData);

    sendResponse(res, 200, { user: newUser });
  } catch (error) {
    sendErrorResponse(res, 400, 'Error while updating user');
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = await getBodyFromRequest(req);

    const data = await usersData.read();
  
    const existedUser = data[id];

    if (!existedUser) {
      sendErrorResponse(res, 404, 'User not found');
      return;
    }

    const newData = data.filter(user => user.id !== existedUser.id);

    await usersData.write(newData);

    sendResponse(res, 200, { message: 'User deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, 400, 'Error while deleting user');
  }
}

const userRoutes = {
  GET: getUsers,
  POST: postUser,
  PUT: putUser,
  DELETE: deleteUser,
};

const userRouter = (req, res) => {
  const { method } = req;

  const route = userRoutes[method];

  if (!route) {
    sendErrorResponse(res, 404, `Route with ${method} ${url} not found`);
    return;
  }
  
  route(req, res);
};

module.exports = {
  userRouter,
};
