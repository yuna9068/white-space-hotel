import axios from 'axios';

const token = 'V8AmnnzkrsFuXarQiVFv8ZAr5RXl6JgBnjn1GweP9wb7vbyxiRkWJGjPq4ut';

const instance = axios.create({
  baseURL: 'https://challenge.thef2e.com/api/thef2e2019/stage6/',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const apiGetRooms = () => instance.get('rooms');
const apiGetRoomDetail = (roomId) => instance.get(`room/${roomId}`);
const apiPostReserveRoom = (roomId, params) => instance.post(`room/${roomId}`, params);
const apiDeleteAllReservations = () => instance.delete('rooms');

export {
  apiGetRooms,
  apiGetRoomDetail,
  apiPostReserveRoom,
  apiDeleteAllReservations,
};
