package com.dev.nowriting.configuration;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.dev.nowriting.api.GoogleCloudVisionApi;
import com.dev.nowriting.util.ValidateForm;
import com.dev.nowriting.util.ValidateObject;

@Configuration
public class UtilConfig {
	
	@Bean
	public GoogleCloudVisionApi googleCloudVisionApi() {
		return new GoogleCloudVisionApi(); 
	}
	
	
	@Bean
	public ValidateForm validateForm() {
		
		String regexName ="^[°¡-ÆR]{2,7}|[a-zA-Z]{2,10}\\s[a-zA-Z]{2,10}$"; 
		//ÇÑ±Û, ¿µ¹®(¶ç¾î¾²±â)
		String regexMail = "^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\\w+\\.)+\\w+$";
		//xxx@xxx.xxx 
		String regexID = "^[A-Za-z0-9]{4,12}$";
		//¿µ¹®´ë,¼Ò¹®ÀÚ , ¼ýÀÚ 4 ~12 ÀÚ¸®
		String regexPW = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$";
		//¿µ¹®,¼ýÀÚ,Æ¯¹® Á¶ÇÕ 8ÀÚ¸®ÀÌ»ó
		String regexNumber = "^[0-9]+$";
		//0~9 ¼ýÀÚ
		ValidateForm validateForm = new ValidateForm();
		
		validateForm.setRegexID(regexID);
		validateForm.setRegexMail(regexMail);
		validateForm.setRegexName(regexName);
		validateForm.setRegexPW(regexPW);
		validateForm.setRegexNumber(regexNumber);
		
		return validateForm;
	}
	@Bean
	public ValidateObject validateObject() {
		ValidateObject validateObject= new ValidateObject();
//		validateContent.setMemberDAO(memberDAO);
//		validateContent.setValidateForm(validateForm());
		return validateObject;
	}
	
	
	@Value("${mail.mail}")
	private String mail;
	@Value("${mail.password}")
	private String password;
	@Bean
	public JavaMailSenderImpl mailSender() {
		String host = "smtp.gmail.com";
//		String host = "smtp.naver.com";
		int port = 587;
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
