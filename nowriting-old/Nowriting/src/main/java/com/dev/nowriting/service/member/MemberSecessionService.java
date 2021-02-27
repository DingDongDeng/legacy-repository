package com.dev.nowriting.service.member;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MemberMapper;

import java.util.Map;

@Service
public class MemberSecessionService implements MemberService {
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map info) {
		String mail = (String) info.get("mail");
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		memberDAO.deleteMember(mail);
		
		
	}

}
