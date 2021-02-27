package com.board.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

//참고: https://www.baeldung.com/spring-email
@Configuration
public class EmailConfig {

    @Value("${spring.mail.host}")
    String host;
    @Value("${spring.mail.port}")
    Integer port;
    @Value("${spring.mail.username}")
    String usersname;
    @Value("${spring.mail.password}")
    String password;
    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    boolean starttlsEnable;
    @Value("${spring.mail.properties.mail.smtp.auth}")
    boolean smtpAuth;


    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);

        mailSender.setUsername(usersname);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", smtpAuth);
        props.put("mail.smtp.starttls.enable", starttlsEnable);
        props.put("mail.debug", "true");

        return mailSender;
    }
}
