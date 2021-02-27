package com.dev.nowriting.service.member;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MemberMapper;

@Service
public class MemberChangeMyInfoService implements MemberService{
	
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map info) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		int header = (Integer) info.get("header");
		
		String mail = (String) info.get("mail");
		if(header == 1) {//name �� ������Ʈ�ϸ��
			String name = (String) info.get("name");
			memberDAO.updateName(mail, name);
		}
		else if(header ==2) {//��й�ȣ ����
			String pw = (String) info.get("newPW");
			memberDAO.updatePW(mail, pw);
		}
		else {
			try {
				throw new Exception();
			}catch (Exception e) {
				e.printStackTrace();
				System.out.println("ó������ ���ϴ� header �� ����");
			}
			
		}
		
		
		
	}

}
