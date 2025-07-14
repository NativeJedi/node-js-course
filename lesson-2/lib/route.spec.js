import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as router from './loadRouter.js';

import { handleRoute } from './route.js';
import * as networkUtils from '../utils/network.js';


describe('handleRoute', () => {
  const POST = vi.fn().mockResolvedValue(undefined);
  const GET = vi.fn().mockResolvedValue(undefined);
  const sendResponse = vi.spyOn(networkUtils, 'sendResponse').mockReturnValue(undefined);
  const loadRouter = vi.spyOn(router, 'loadRouter').mockResolvedValue({
    router: {
      POST,
      GET,
    },
    routeParams: [],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('POST /users should create a new collection of users', async () => {
    const req = {
      method: 'POST',
      url: '/users',
    };

    const res = {
      writeHead: () => {},
      end: () => {},
    };

    await handleRoute(req, res);

    expect(loadRouter).toHaveBeenCalledWith('/users');
    expect(POST).toHaveBeenCalledWith(req, res, []);
    expect(sendResponse).not.toHaveBeenCalled();
  });

  test('GET /users should return all users', async () => {
    const req = {
      method: 'GET',
      url: '/users',
    };

    const res = {
      writeHead: () => {},
      end: () => {},
    };

    await handleRoute(req, res);

    expect(loadRouter).toHaveBeenCalledWith('/users');
    expect(GET).toHaveBeenCalledWith(req, res, []);
    expect(sendResponse).not.toHaveBeenCalled();
  });
});
