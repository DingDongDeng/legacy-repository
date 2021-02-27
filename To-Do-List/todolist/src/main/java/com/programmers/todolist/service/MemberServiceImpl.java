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
		/*����üũ*/
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
		/*���� üũ*/
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
		/*��й�ȣ Ȯ��*/
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
		
		/*ù ȸ�� ���̵� �޼��� �ۼ�*/
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		ListDTO listDTO = new ListDTO();
		listDTO.setMail(mail);
		listDTO.setPriority(0);
		listDTO.setState("R");
		listDTO.setTitle("���� ����");
		String msg = "����� �۾��� �������� ���� �� �׸��� �ۼ��� �� �ֽ��ϴ�.</br>"
				   + "���� �׸���� ������ üũ �ڽ��� ���� �����մϴ�.</br>"
				   + "����(PC) �Ǵ� ���(Mobile) ���̵� ���� </br>"
				   + "�� �������� ���� ������ ���� �׸��� �ǽð����� Ȯ�� �Ҽ� �ֽ��ϴ�.</br>"
				   + "�Ϸ��� �׸� ���ؼ��� üũ�ڽ��� ���� ������ �����մϴ�.";
		listDTO.setContent(msg);
		listDAO.insertList(listDTO);
		
		msg ="�̸�: ������ </br>"
			+"�������б� 4�г�1�б� ���� �� </br>"
			+"�� ��� : Java </br>"
			+"���� ��� : Spring </br>"
			+"���߰��� : </br>"
			+"2018 ������ ICT AWS ê���ֹ����� �ý���(4�� ��������Ʈ) </br>"
			+"�ð������ ����Ÿ���� �����ڸ� ���� ��(����������Ʈ) </br>"
			+"�ڰ��� : DaSP ���� </br>";
		listDTO.setPriority(1);
		listDTO.setTitle("������ �Ұ�");
		listDTO.setContent(msg);
		listDAO.insertList(listDTO);
		
		
		sendMail(memberDTO);//���� ���Ϲ��
		
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
			MemberDTO _memberDTO = memberDTOs.get(0);//db ���̵��� ��й�ȣ
			
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
			sendMail.setSubject("[Programmers Todo List] ȸ������ �̸��� ����");
			sendMail.setText(new StringBuffer().append("<h1>[�̸��� ����]</h1>")
					.append("<p>�Ʒ� ��ũ�� Ŭ���Ͻø� �̸��� ������ �Ϸ�˴ϴ�.</p>")
					.append("<p>�����������Ͻ� �̸��Ϸ� �α����� ���ּ���!������</p>")
					.append("<a href='"+domain+"/checkAuth?")
					.append("mail=")
					.append(dto.getMail())
					.append("&authKey=")
					.append(dto.getAuthkey())
					.append("' target='_blenk'>�̸��� ���� Ȯ��</a>")
					.toString());
			sendMail.setFrom(id, "[������]");
			sendMail.setTo(dto.getMail());
			sendMail.send();
		}
		catch(Exception e) {
			e.printStackTrace();
			System.out.println("�������� �߼��� �����߻�");
		}
		
	}
	public void sendMailForFindPW(MemberDTO dto) {
		try {
			MailUtils sendMail = new MailUtils(mailSender);
			sendMail.setSubject("[Programmers Todo List] ��й�ȣ ã��");
			sendMail.setText(new StringBuffer().append("<h1>[��й�ȣ ã��]</h1>")
					.append("<p>��й�ȣ�� �н����� �ʵ��� �������ּ���!!!</p>")
					.append("���̵� : " + dto.getMail())
					.append("��й�ȣ : " + dto.getPassword())
					.toString());
			sendMail.setFrom(id, "[������]");
			sendMail.setTo(dto.getMail());
			sendMail.send();
		}
		catch(Exception e) {
			e.printStackTrace();
			System.out.println("�������� �߼��� �����߻�");
		}
		
	}

}
