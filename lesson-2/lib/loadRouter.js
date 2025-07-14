import {
  findEntryInFolder,
  getFullFilePath,
  isFileExists,
  isFolderExists,
} from '../utils/path.js';
import { RouteNotFoundError } from '../utils/error.js';

const routesFolderPath = getFullFilePath('../routes');

const getDynamicParam = async (path) => {
  const entry = await findEntryInFolder(path, /^\[(\w+)\]$/g);

  if (!entry) return null;

  const name = entry.slice(1, -1);

  return {
    name,
    path: entry,
  };
};

const parseRouteUrl = async (url) => {
  const routeSegments = url.split('/').filter(Boolean);

  return routeSegments.reduce(async (segmentData, segment) => {
    const { params, folderPath } = await segmentData;

    const segmentPath = `${folderPath}/${segment}`;

    const isFolder = await isFolderExists(segmentPath);

    if (isFolder) {
      return {
        params,
        folderPath: segmentPath,
      };
    }

    const dynamicParam = await getDynamicParam(folderPath);

    if (!dynamicParam) {
      // We don't need to go further if folder or dynamic path of segment is not exists
      throw new RouteNotFoundError(url);
    }

    params[dynamicParam.name] = segment;

    return {
      params,
      folderPath: `${folderPath}/${dynamicParam.path}`,
    };
  }, {
    params: {},
    folderPath: routesFolderPath,
  });
};

async function loadRouter(url) {
  const { params, folderPath } = await parseRouteUrl(url);

  const routeFilePath = `${folderPath}/route.js`;

  if (!await isFileExists(routeFilePath)) {
    throw new RouteNotFoundError(url);
  }

  const router = await import(routeFilePath);

  return {
    router,
    routeParams: params,
  };
}

export { loadRouter };
