/**
 * @file Provides `readableFileSizeString` method
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const readableFileSizeString = function(fileSizeInBytes) {
  /*
   * from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
   */
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024)
  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

