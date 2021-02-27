package com.dev.nowriting.service.member;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MemberMapper;
import com.dev.nowriting.dto.MemberDTO;

@Service
public class MemberMyInfoService implements MemberService{

	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map result) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		
		String mail = (String) result.get("mail");
		ArrayList<MemberDTO> dtos = memberDAO.findMail(mail) ;
		MemberDTO dto = dtos.get(0);
		dto.setPw(""); //민감한 개인정보 제거
		
		result.put("memberDTO", dto);
	}

}
