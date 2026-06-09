/* ws://localhost:8082/api/ws/ridesharing/101/driversession/websocket 
ws://localhost:8082/api/ws/ridesharing/103/passengersession/websocket */

export const WEBSOCKET_URLS = {
  DRIVER: 'ws://localhost:8082/api/ws/ridesharing/driversession',
  PASSENGER: 'ws://localhost:8082/api/ws/ridesharing/passengersession'
};

export const STOMP_SHARED_CONFIG = {
    reconnectDelay: 5000,
    heartbeatOutgoing: 10000,
};

