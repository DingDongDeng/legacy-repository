package com.dev.nowriting.service.validate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.jdbcTemplate.MemberDAOImpl;
import com.dev.nowriting.dto.MemberDTO;
import com.dev.nowriting.util.ValidateObject;
@Service
public class ValidateLogInService implements ValidateService {
	
	@Autowired
	ValidateObject validateObject; 
	@Override
	public Map execute(Map user) {
		Map result;
		
		String mail = (String) user.get("mail");
		String pw = (String) user.get("pw");
		String task = (String) user.get("task");
		result = validateObject.initResultMap("login");
		result = validateObject.checkLogIn(mail, pw);
		
		return result;
	}
	
	
	

}
