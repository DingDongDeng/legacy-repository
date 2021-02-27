package com.dev.nowriting.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import com.dev.nowriting.util.ImgTextSocketHandler;

@Configuration
@EnableWebSocket
public class SocketConfig implements WebSocketConfigurer{
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(ImgTextSocketHandler(), "/requestText")
        .addInterceptors(new HttpSessionHandshakeInterceptor());
		
	}
	@Bean
	public WebSocketHandler ImgTextSocketHandler() {
		return new ImgTextSocketHandler();
	}

}
