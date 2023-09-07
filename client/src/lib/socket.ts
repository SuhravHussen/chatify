import { PUBLIC_BASE_URL } from '$env/static/public';
import ioClient from 'socket.io-client';

const socket = ioClient(PUBLIC_BASE_URL);

export const io = socket;
