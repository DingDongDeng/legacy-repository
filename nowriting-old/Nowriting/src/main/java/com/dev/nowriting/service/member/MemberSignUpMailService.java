package com.dev.nowriting.service.member;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MemberMapper;
import com.dev.nowriting.dao.jdbcTemplate.MemberDAOImpl;
@Service
public class MemberSignUpMailService implements MemberService {
	
//	@Autowired
//	MemberDAOImpl memberDAO;
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map map) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		// TODO Auto-generated method stub
		String mail = (String) map.get("mail");
		String authKey = (String) map.get("authKey");
		memberDAO.updateAuthStatus(mail, authKey);
		
	}

}
