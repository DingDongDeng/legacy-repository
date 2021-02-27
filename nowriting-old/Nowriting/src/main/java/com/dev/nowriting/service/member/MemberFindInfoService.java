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
			sendMail.setSubject("[NoWriting TEST] ȸ������ �̸��� ����");
			sendMail.setText(new StringBuffer().append("<h1>[��й�ȣ ã��]</h1>")
					.append("<p> ���̵� : "+dto.getMail()+"</p>")
					.append("<p> ��й�ȣ : "+dto.getPw()+"</p>")
					.append("<p> �������� ��й�ȣ�� �н����� �ʵ��� �������ּ���! </p>")
					.toString());
			sendMail.setFrom(id, "[NoWriting]");
			sendMail.setTo(dto.getMail());
			sendMail.send();
		}
		catch(Exception e) {
			e.printStackTrace();
			System.out.println("�������� �߼��� �����߻�");
		}
		
	}
}
