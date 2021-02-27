package com.programmers.todolist.configuration;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {
	

	@Value("${mail.mail}")
	private String mail;
	@Value("${mail.password}")
	private String password;
	@Bean
	public JavaMailSenderImpl mailSender() {
		String host = "smtp.gmail.com";
//		String host = "smtp.naver.com";
		int port = 587;
//		int port = 25;
		String username = mail;
		String password = this.password;
		Properties javaMailProperties = new Properties();
		javaMailProperties.setProperty("mail.transport.protocol", "smtp");
		javaMailProperties.setProperty("mail.smtp.auth","true");
		javaMailProperties.setProperty("mail.smtp.starttls.enable","true");
		javaMailProperties.setProperty("mail.debug","true");
		
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(host);
		mailSender.setPort(port);
		mailSender.setUsername(username);
		mailSender.setPassword(password);
		mailSender.setJavaMailProperties(javaMailProperties);
		return mailSender;
	}
}
