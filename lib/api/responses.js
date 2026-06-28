export function successResponse(data, status = 200) {
  return Response.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(error, code = "ERROR", status = 500) {
  return Response.json(
    {
      success: false,
      error,
      code,
    },
    { status }
  );
}