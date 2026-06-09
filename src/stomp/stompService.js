import { Client } from '@stomp/stompjs';
import { WEBSOCKET_URLS, STOMP_SHARED_CONFIG } from './stompConfig';

// This variable will hold our active STOMP connection instance. 
// It starts as null because we aren't connected yet.
let stompClient = null;

export const connectStomp = (role,token) => {
    const url = WEBSOCKET_URLS(role);

    if (!url) {
        console.error("Cannot connect : Invalid role");
        return;
    }

    stompClient = new Client({
        brokerURL: url,
        reconnectDelay: STOMP_SHARED_CONFIG.reconnectDelay,
        heartbeatIncoming: STOMP_SHARED_CONFIG.heartbeatIncoming,
        heartbeatOutgoing: STOMP_SHARED_CONFIG.heartbeatOutgoing,
    })
}