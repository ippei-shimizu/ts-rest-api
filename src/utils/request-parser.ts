import http from 'http';

export function parseRequestBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const bodyChunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      bodyChunks.push(chunk);
    });

    req.on('end', () => {
      if (bodyChunks.length === 0) {
        reject(new Error('Request body is empty'));
        return;
      }

      try {
        const bodyString = Buffer.concat(bodyChunks).toString();
        const body = JSON.parse(bodyString);
        resolve(body);
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', (err) => {
      reject(err);
    })
  })
}
