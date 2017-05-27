import crypto from 'crypto';

export const getSHA1 = bytes => {
  var shasum = crypto.createHash('sha1');
  shasum.end(bytes);
  return shasum.read();
}