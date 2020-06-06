import os from 'os';

// get all host network interfaces
const interfaces = os.networkInterfaces();

// exclude loopback interface and get first one
const ifaceName = Object.keys(interfaces).filter(iface => iface !== 'lo')[0];

// get first object with ipv4 protocol, our address is here
const ipv4Config = interfaces[ifaceName]?.filter(
  configs => configs.family === 'IPv4'
)[0];

export default {
  addr: ipv4Config?.address,
  port: 3333
};
