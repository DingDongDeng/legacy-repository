package com.dev.nowriting.service.member;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MemberMapper;
import com.dev.nowriting.dto.MemberDTO;
import com.dev.nowriting.util.MailUtils;
import com.dev.nowriting.util.TempKey;
@Service
public class MemberSignUpService implements MemberService{
	@Autowired
	SqlSession sqlSession;
	@Autowired
	private JavaMailSender mailSender;
	
	
	@Override
	public void execute(Map signUp) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		
		MemberDTO memberDTO = new MemberDTO();
		memberDTO.setAllbyMap(signUp);
		memberDTO.setAuthkey(new TempKey().getKey(50, false));
		memberDTO.setAuthstatus(0);//메일인증 받았는지의 여부  , 1인증상태 , 0미인증상태
		memberDTO.setSignUpDate(new Timestamp(System.currentTimeMillis()));
		
		
		memberDAO.insertMember(memberDTO);
		sendMail(memberDTO); //인증메일 발송		
	}
	
	
	
	@Value("${mail.id}")
	private String id;
	@Value("${domain.domain}")
	private String domain;
	
	public void sendMail(MemberDTO dto) {
		try {
			MailUtils sendMail = new MailUtils(mailSender);
			sendMail.setSubject("[NoWriting TEST] 회원가입 이메일 인증");
			sendMail.setText(new StringBuffer().append("<h1>[이메일 인증]</h1>")
					.append("<p>아래 링크를 클릭하시면 이메일 인증이 완료됩니다.</p>")
					.append("<a href='"+domain+"/signupThird?")
					.append("mail=")
					.append(dto.getMail())
					.append("&authKey=")
					.append(dto.getAuthkey())
					.append("' target='_blenk'>이메일 인증 확인</a>")
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
