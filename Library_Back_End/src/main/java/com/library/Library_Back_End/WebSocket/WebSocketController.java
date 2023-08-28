package com.library.Library_Back_End.WebSocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/chat") // This endpoint handles messages with the "/app/chat" prefix
    @SendTo("/topic/messages") // Sends the response to the "/topic/messages" destination
    public String processMessage(String message) {
        return "Server says: " + message;
    }
}
