import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('customer.created', (data) => {
  console.log('Customer created:', data);
});

socket.on('customer.updated', (data) => {
  console.log('Customer updated:', data);
});

socket.on('customer.deleted', (data) => {
  console.log('Customer deleted:', data);
});

socket.on('customers.bulk_deleted', (data) => {
  console.log('Bulk deleted:', data);
});
