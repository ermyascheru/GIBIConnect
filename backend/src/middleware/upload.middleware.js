const { errorResponse } = require('../utils/response');

const ALLOWED_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'epub',
  'mp4', 'webm', 'mov', 'mp3', 'wav', 'm4a', 'txt'
];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/epub+zip',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/x-m4a',
  'text/plain',
  'application/octet-stream'
];

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB

const parseMultipart = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return next();
  }

  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    return errorResponse(res, 400, 'Malformed multipart/form-data request: Missing boundary');
  }

  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const chunks = [];

  req.on('data', chunk => chunks.push(chunk));

  req.on('end', () => {
    try {
      const buffer = Buffer.concat(chunks);
      if (buffer.length > MAX_FILE_SIZE) {
        return errorResponse(res, 413, `File exceeds maximum permitted size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      const boundaryBuffer = Buffer.from(`--${boundary}`);
      const body = {};
      let uploadedFile = null;

      let start = 0;
      while (start < buffer.length) {
        const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
        if (boundaryIndex === -1) break;

        const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, boundaryIndex + boundaryBuffer.length);
        if (nextBoundaryIndex === -1) break;

        const part = buffer.slice(boundaryIndex + boundaryBuffer.length, nextBoundaryIndex);
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd !== -1) {
          const headerStr = part.slice(0, headerEnd).toString('utf8');
          const bodyBuffer = part.slice(headerEnd + 4, part.length - 2); // strip trailing CRLF

          const nameMatch = headerStr.match(/name="([^"]+)"/);
          const filenameMatch = headerStr.match(/filename="([^"]+)"/);
          const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n;]+)/i);

          if (filenameMatch && nameMatch) {
            const originalFilename = filenameMatch[1].replace(/[/\\?%*:|"<>]/g, '_');
            const fileExtension = (originalFilename.split('.').pop() || '').toLowerCase();
            const mimeType = mimeMatch ? mimeMatch[1].trim() : 'application/octet-stream';

            if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
              return errorResponse(res, 400, `Unsupported file extension: .${fileExtension}`);
            }

            uploadedFile = {
              fieldname: nameMatch[1],
              originalname: originalFilename,
              mimetype: mimeType,
              buffer: bodyBuffer,
              size: bodyBuffer.length,
              fileExtension
            };
          } else if (nameMatch) {
            body[nameMatch[1]] = bodyBuffer.toString('utf8').trim();
          }
        }

        start = nextBoundaryIndex;
      }

      req.body = { ...body, ...req.body };
      req.file = uploadedFile;
      next();
    } catch (err) {
      return errorResponse(res, 500, `Multipart parsing error: ${err.message}`);
    }
  });

  req.on('error', err => {
    return errorResponse(res, 500, `Upload stream error: ${err.message}`);
  });
};

module.exports = {
  parseMultipart,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES
};
