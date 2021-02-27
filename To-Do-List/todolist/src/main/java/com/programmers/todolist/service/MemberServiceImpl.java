package com.programmers.todolist.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.programmers.todolist.dao.ListMapper;
import com.programmers.todolist.dao.MemberMapper;
import com.programmers.todolist.dto.ListDTO;
import com.programmers.todolist.dto.MemberDTO;
import com.programmers.todolist.mail.MailUtils;
import com.programmers.todolist.mail.TempKey;
import com.programmers.todolist.validate.ValidateForm;

@Service
public class MemberServiceImpl implements MemberService {
	@Autowired
	SqlSession sqlSession;
	@Autowired
	ValidateForm validateForm; 
	@Autowired
	private JavaMailSender mailSender;
	
	
	@Override
	public Map findPW(String mail) {
		Map result = new HashMap<String, Object>();
		
		System.out.println(mail);
		if(!validateForm.validateForm("mail", mail)) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "NOT_ALLOW_FORMAT_MAIL");
			return result;
		}
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		ArrayList<MemberDTO> memberDTOs = memberDAO.findMail(mail);
		int acount = memberDTOs.size();
		if(acount==0) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "NOT_FOUND_MAIL");
			return result;
		}
		sendMailForFindPW(memberDTOs.get(0));
		
		result.put("STATE", "SUCCESS");
		result.put("DETAIL", "SUCCESS_SEND_MAIL_FOR_FIND_PASSWORD");
		
		
		
		return result;
	}
	
	@Override
	public void authCheck(String mail, String authKey) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		memberDAO.updateAuth(mail, authKey);
		
	}
	
	
	@Transactional
	@Override
	public Map signUpCheck(String mail, String password, String passwordCheck) {
		Map result = new HashMap<String, Object>();
		/*공백체크*/
		if(mail==""||mail==null) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "EMPTY_MAIL");
			return result;
		}
		if(password==""||password==null) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "EMPTY_PASSWORD");
			return result;
		}
		if(passwordCheck==""||passwordCheck==null) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "EMPTY_PASSWORD_CHECK");
			return result;
		}
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		if(memberDAO.findMail(mail).size()==1) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "ALREADY_EXIST_MAIL");
			return result;
		}
		/*패턴 체크*/
		if(!validateForm.validateForm("mail", mail)) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "NOT_ALLOW_FORMAT_MAIL");
			return result;
		}
		if(!validateForm.validateForm("pw", password)) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "NOT_ALLOW_FORMAT_PASSWORD");
			return result;
		}
		/*비밀번호 확인*/
		if(!password.equals(passwordCheck)) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "NOT_SAME_PASSWORD_AND_PASSWORD_CHECK");
			return result;
		}
		
		MemberDTO memberDTO = new MemberDTO();
		memberDTO.setMail(mail);
		memberDTO.setPassword(password);
		memberDTO.setAuthkey(new TempKey().getKey(50, false));
		memberDTO.setAuthstatus(0);
		memberDTO.setSignUpDate(new Timestamp(System.currentTimeMillis()));
		memberDAO.insertMember(memberDTO);
		
		/*첫 회원 가이드 메세지 작성*/
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		ListDTO listDTO = new ListDTO();
		listDTO.setMail(mail);
		listDTO.setPriority(0);
		listDTO.setState("R");
		listDTO.setTitle("간단 사용법");
		String msg = "상단의 글쓰기 아이콘을 통해 새 항목을 작성할 수 있습니다.</br>"
				   + "이후 항목들의 관리는 체크 박스를 통해 가능합니다.</br>"
				   + "좌측(PC) 또는 상단(Mobile) 가이드 바의 </br>"
				   + "벨 아이콘을 통해 기한이 지난 항목을 실시간으로 확인 할수 있습니다.</br>"
				   + "완료한 항목에 대해서는 체크박스를 통해 관리가 가능합니다.";
		listDTO.setContent(msg);
		listDAO.insertList(listDTO);
		
		msg ="이름: 전태준 </br>"
			+"삼육대학교 4학년1학기 재학 중 </br>"
			+"주 언어 : Java </br>"
			+"관심 기술 : Spring </br>"
			+"개발경험 : </br>"
			+"2018 한이음 ICT AWS 챗봇주문개발 시스템(4인 팀프로젝트) </br>"
			+"시각장애인 워드타이핑 봉사자를 위한 웹(개인프로젝트) </br>"
			+"자격증 : DaSP 보유 </br>";
		listDTO.setPriority(1);
		listDTO.setTitle("만든이 소개");
		listDTO.setContent(msg);
		listDAO.insertList(listDTO);
		
		
		sendMail(memberDTO);//인증 메일방송
		
		result.put("STATE", "SUCCESS");
		result.put("DETAIL", "SUCCESS_SIGN_UP");
		return result;
	}
	@Override
	public Map loginCheck(MemberDTO memberDTO) {
		String mail = memberDTO.getMail();
		String password = memberDTO.getPassword();

		
		Map result = new HashMap<String, Object>();
		result.put("STATE", "SUCCESS");
		result.put("DETAIL", "SUCCESS_LOGIN");
		
		if(mail==null || mail.equals("")) {
			result.put("STATE","ERR");
			result.put("DETAIL","EMPTY_MAIL");
			return result;
		}
		
		if(password==null || password.equals("")) {
			result.put("STATE","ERR");
			result.put("DETAIL","EMPTY_PASSWORD");
			return result;
		}
		
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		ArrayList<MemberDTO> memberDTOs = memberDAO.findMail(mail);
		int acount=memberDTOs.size();
		switch (acount) {
		case 0:
			result.put("STATE","ERR");
			result.put("DETAIL","NOT_FOUND_MAIL");
			break;
		case 1:
			MemberDTO _memberDTO = memberDTOs.get(0);//db 아이디의 비밀번호
			
			if(_memberDTO.getPassword().equals(password)) {
				break;
			}
			else {
				result.put("STATE","ERR");
				result.put("DETAIL","NOT_CORRECT_PASSWORD");
				break;
			}
		}
		if(result.get("STATE").equals("SUCCESS")) {
			MemberDTO __memberDTO = memberDTOs.get(0);
			System.out.println(__memberDTO.getAuthstatus());
			if(__memberDTO.getAuthstatus()!=1) {
				result.put("STATE","ERR");
				result.put("DETAIL","NOT_EXECUTE_MAIL_AUTH_CHECK");
				return result;
			}
		}
		
		
		
		return result;
	}
	
	
	
	
	
	@Value("${mail.id}")
	private String id;
	@Value("${domain.domain}")
	private String domain;

	public void sendMail(MemberDTO dto) {
		try {
			MailUtils sendMail = new MailUtils(mailSender);
			sendMail.setSubject("[Programmers Todo List] 회원가입 이메일 인증");
			sendMail.setText(new StringBuffer().append("<h1>[이메일 인증]</h1>")
					.append("<p>아래 링크를 클릭하시면 이메일 인증이 완료됩니다.</p>")
					.append("<p>♥♥♥가입하신 이메일로 로그인을 해주세요!♥♥♥</p>")
					.append("<a href='"+domain+"/checkAuth?")
					.append("mail=")
					.append(dto.getMail())
					.append("&authKey=")
					.append(dto.getAuthkey())
					.append("' target='_blenk'>이메일 인증 확인</a>")
					.toString());
			sendMail.setFrom(id, "[관리자]");
			sendMail.setTo(dto.getMail());
			sendMail.send();
		}
		catch(Exception e) {
			e.printStackTrace();
			System.out.println("인증메일 발송중 오류발생");
		}
		
	}
	public void sendMailForFindPW(MemberDTO dto) {
		try {
			MailUtils sendMail = new MailUtils(mailSender);
			sendMail.setSubject("[Programmers Todo List] 비밀번호 찾기");
			sendMail.setText(new StringBuffer().append("<h1>[비밀번호 찾기]</h1>")
					.append("<p>비밀번호를 분실하지 않도록 조심해주세요!!!</p>")
					.append("아이디 : " + dto.getMail())
					.append("비밀번호 : " + dto.getPassword())
					.toString());
			sendMail.setFrom(id, "[관리자]");
			sendMail.setTo(dto.getMail());
			sendMail.send();
		}
		catch(Exception e) {
			e.printStackTrace();
			System.out.println("인증메일 발송중 오류발생");
		}
		
	}

}
