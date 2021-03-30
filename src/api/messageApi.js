import {callApi} from "./callApi";
import {messageCenterUrl, messageCenterWSUrl} from "./apiConfig";
import * as StompJs from "@stomp/stompjs";
import {authManager} from "./authManager";


export function getMessageStats() {
    return callApi({
        silent: true,
        url: `${messageCenterUrl}/message_stats/seller`,
    });
}


export function getMessages(params) {
    return callApi({
        url: `${messageCenterUrl}/messages`,
        params: {
            pageSize: 20,
            ...params
        }
    });
}


export function setMessagesAllRead(params) {
    return callApi({
        method: 'post',
        url: `${messageCenterUrl}/messages/all_read`,
        data: new URLSearchParams(params)
    });
}

export function messageClient(params = {onMessage: () => {}}) {
    console.info("###start websocket for message");
    const stompClient = new StompJs.Client({
        webSocketFactory () {
            const token = authManager.auth.accessToken.substring(7);
            const url = `${messageCenterWSUrl}/message_center?access_token=${token}`;
            return new WebSocket(url);
        },
        // connectHeaders: {
        //     login: session.user.id,
        //     passcode: '',
        // },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // debug(str) {
        //     console.log(str);
        // },
        onConnect(frame) {
            console.info("###connected websocket for message");
            stompClient.subscribe('/user/queue/message', function (res) {
                params.onMessage(JSON.parse(res.body));
            });
        },
        onStompError(frame) {
            console.log(frame);
        },
        onWebSocketClose(event) {
            console.info("###onWebSocketClose");
        },
        onWebSocketError(event) {
            console.info("###onWebSocketError");
        },
        onDisconnect(e) {
            console.info("###disconnected websocket for message" + e);
        }
    });

    stompClient.activate();
    return stompClient;
}