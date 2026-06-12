/* ws://localhost:8082/api/ws/ridesharing/101/driversession/websocket 
ws://localhost:8082/api/ws/ridesharing/103/passengersession/websocket */

export const WS_URL = 'http://localhost:8082/api/ws/ridesharing';

export const STOMP_SHARED_CONFIG = {
    reconnectDelay: 0,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
};

