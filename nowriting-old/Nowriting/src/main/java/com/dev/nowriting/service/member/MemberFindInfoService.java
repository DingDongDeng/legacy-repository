package com.dev.nowriting.service.member;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dto.MemberDTO;
import com.dev.nowriting.util.MailUtils;

@Service
public class MemberFindInfoService implements MemberService {
	
	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public void execute(Map result) {
		MemberDTO memberDTO = (MemberDTO) result.get("memberDTO");
		sendMail(memberDTO);
	}
	
	@Value("${mail.id}")
	private String id;
	
	public void sendMail(MemberDTO dto) {
		try {
			MailUtils sendMail = new MailUtils(mailSender);
			sendMail.setSubject("[NoWriting TEST] 회원가입 이메일 인증");
			sendMail.setText(new StringBuffer().append("<h1>[비밀번호 찾기]</h1>")
					.append("<p> 아이디 : "+dto.getMail()+"</p>")
					.append("<p> 비밀번호 : "+dto.getPw()+"</p>")
					.append("<p> 다음부턴 비밀번호를 분실하지 않도록 주의해주세요! </p>")
					.toString());
			sendMail.setFrom(id, "[NoWriting]");
			sendMail.setTo(dto.getMail());
			sendMail.send();
		}
		catch(Exception e) {
			e.printStackTrace();
			System.out.println("인증메일 발송중 오류발생");
		}
		
	}
}
