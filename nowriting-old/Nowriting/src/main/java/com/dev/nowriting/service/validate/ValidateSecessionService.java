package com.dev.nowriting.service.validate;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MemberMapper;
import com.dev.nowriting.util.ValidateObject;

@Service
public class ValidateSecessionService implements ValidateService {
	@Autowired
	SqlSession sqlSession;
	@Autowired
	ValidateObject validateObject;
	
	@Override
	public Map execute(Map result) {
		String mail = (String) result.get("mail");
		String pw = (String) result.get("pw");
		
		
		if(!validateObject.checkPW(mail, pw, result)) return result;
		
		
		
		return result;
	}
}
