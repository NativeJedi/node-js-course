function getUrlParams(path) {
  const routeParams = [];
  const routePath = path.replace(/(\/[^/]+)\/(\d+)/g, (match, pathSlice, id) => {
    routeParams.push(id);
    return `${pathSlice}/[id]`;
  });
  return { routePath, routeParams };
}

async function loadRouter(url) {
  const { routePath, routeParams } = getUrlParams(url);

  const router = await import(`../routes${routePath}/route.js`);

  return { router, routeParams };
}

export { loadRouter };
