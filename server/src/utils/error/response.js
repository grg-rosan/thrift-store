export function sendSuccess(res, { data, meta = null, nextCursor = null, statusCode = 200 }) {
  return res.status(statusCode).json({
    data,
    meta,
    nextCursor,
    requestId: res.locals.requestId,
  });
}

export function sendPaginated(res, { data, count, hasMore, nextCursor }) {
  return sendSuccess(res, {
    data,
    meta: { count, hasMore },
    nextCursor,
  });
}