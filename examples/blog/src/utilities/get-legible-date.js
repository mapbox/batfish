export default function getLegibleDate(machineDate) {
  const splitString = new Date(machineDate).toString().split(' ');
  return splitString.slice(1, 3).join(' ') + ', ' + splitString[3];
}
