package com.library.Library_Back_End.WebSocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

@Configuration
//@EnableWebSocketSecurity
public class WebSocketSecurityConfig {

//    @Bean
//    AuthorizationManager<Message<?>> messageAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
//        messages
////                .simpMessageDestMatchers("/queue/**", "/topic/**").denyAll()
////                .simpSubscribeDestMatchers("/queue/**/*-user*", "/topic/**/*-user*").denyAll()
//                .anyMessage().permitAll();
//        return messages.build();
//    }
}
