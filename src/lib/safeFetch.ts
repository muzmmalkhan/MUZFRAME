export async function parseJsonResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(
        res.ok
          ? 'API returned HTML instead of JSON. Ensure the backend server or serverless /api function is deployed.'
          : `Server returned status ${res.status}`
      );
    }
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON response from server (status ${res.status})`);
  }
}
