// In-memory data storage for development
let visitors = [
  { _id: '1', visitorId: 'V001', name: 'Ashish Kumar', email: 'ashish@example.com', phone: '1234567890', createdAt: new Date() },
  { _id: '2', visitorId: 'V002', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', createdAt: new Date() },
  { _id: '3', visitorId: 'V003', name: 'Rahul Singh', email: 'rahul@example.com', phone: '5556667777', createdAt: new Date() }
];

let checkins = [
  { _id: '1', visitorId: 'V001', bookId: 'B001', checkinTime: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'checked-out', checkoutTime: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { _id: '2', visitorId: 'V002', bookId: 'B002', checkinTime: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'checked-in' },
  { _id: '3', visitorId: 'V003', bookId: 'B003', checkinTime: new Date(Date.now() - 30 * 60 * 1000), status: 'checked-out', checkoutTime: new Date(Date.now() - 15 * 60 * 1000) },
  { _id: '4', visitorId: 'V001', bookId: 'B004', checkinTime: new Date(Date.now() - 10 * 60 * 1000), status: 'checked-in' }
];

let books = [
  { _id: '1', bookId: 'B001', title: 'Introduction to Algorithms', author: 'Cormen', isbn: '978-0-262-03384-8', status: 'available' },
  { _id: '2', bookId: 'B002', title: 'Clean Code', author: 'Robert Martin', isbn: '978-0-13-235088-4', status: 'checked-out' },
  { _id: '3', bookId: 'B003', title: 'The Pragmatic Programmer', author: 'Hunt', isbn: '978-0-201-61622-4', status: 'available' }
];

module.exports = { visitors, checkins, books };