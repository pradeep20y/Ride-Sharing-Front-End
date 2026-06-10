import { Client } from '@stomp/stompjs';
import { WEBSOCKET_URLS, STOMP_SHARED_CONFIG } from './stompConfig';

// This variable will hold our active STOMP connection instance. 
// It starts as null because we aren't connected yet.
let stompClient = null;

export const connectStomp = (role,token) => {
    const url = WEBSOCKET_URLS[role];

    if (!url) {
        console.error("Cannot connect : Invalid role");
        return;
    }

    stompClient = new Client({
        brokerURL: url,
        reconnectDelay: STOMP_SHARED_CONFIG.reconnectDelay,
        debug: (str) => console.log(str),
        heartbeatIncoming: STOMP_SHARED_CONFIG.heartbeatIncoming,
        heartbeatOutgoing: STOMP_SHARED_CONFIG.heartbeatOutgoing,

        onConnect : (frame) => {
            console.log(`Successfully connected to STOMP websocket for role: ${role}`);
        },

        onStompError : (frame) => {
            console.error('STOMP protocol error occurred:', frame.headers['message']);
            console.error('Additional details:', frame.body);            
        }
    });

    stompClient.activate();
}

export const disconnectStomp = () => {
    if (stompClient !== null) {
        stompClient.deactivate();
        stompClient = null;
        console.log('STOMP WebSocket disconnected successfully.');
    }
}

export const subscribeStomp = (destination, callback) => {

    if (!stompClient || !stompClient.connected) {
        console.error('Cannot subscribe: STOMP client is not connected.');
        return null;
    }

    const subscription = stompClient.subscribe(destination,(message)=>{
        
        if (message.body) {
            try {
                // Server messages are almost always text/JSON strings. 
                // We parse it into a JavaScript object so your React components can use it easily.
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                // If the backend sent plain text instead of JSON, just pass the raw text
                callback(message.body);
            }
        }
    });

    return subscription;
}

export const stompPublish = (destination, body) => {
     if (!stompClient || !stompClient.connected) {
        console.error('Cannot publish: STOMP client is not connected.');
        return;
    }

    
    stompClient.publish({
        destination: destination,
        body: JSON.stringify(body) // Convert our object/data to a clean text string
    });

    console.log(`Message successfully published to ${destination}`);
};