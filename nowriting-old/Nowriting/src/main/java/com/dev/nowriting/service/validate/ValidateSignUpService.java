package com.dev.nowriting.service.validate;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.util.ValidateObject;
import com.dev.nowriting.dao.jdbcTemplate.MemberDAO;
import com.dev.nowriting.dao.jdbcTemplate.MemberDAOImpl;
import com.dev.nowriting.util.ValidateForm;

@Service
public class ValidateSignUpService implements ValidateService {
	

	@Autowired
	ValidateObject validateObject;
	
	public Map validateSignUp(Map signUp) {
		
		String mail= (String) signUp.get("mail");
		String name = (String) signUp.get("name");
		String pw = (String) signUp.get("pw");
		String pwCheck = (String) signUp.get("pwCheck");
		boolean checkOnlyMail =  (Boolean) signUp.get("checkOnlyMail");//중복확인버튼으로 호출됬다면
		
		Map result = validateObject.initResultMap("signUp");

		if(checkOnlyMail) {
			boolean temp = validateObject.validateMail(mail, result);
			if(((String)result.get("STATE")).equals(validateObject.getInitState())&&((String)result.get("DETAIL")).equals(validateObject.getInitDetail("signUp")))
				result.put("DETAIL", validateObject.getInitDetail("mailCheck"));
				
			return result;
		}
		else if(!checkOnlyMail){
			if(!validateObject.validateName(name, result)) return result;
			if(!validateObject.validateMail(mail, result)) return result;
			if(!validateObject.validatePW(pw, pwCheck, result))return result;
		}
		else {
			try {
				throw new Exception();
			}
			catch(Exception e) {
				e.printStackTrace();
				System.out.println("checkOnlyID의 잘못된 값 발생");
			}
		}
		return result;
	}
	
	@Override
	public Map execute(Map signUp) {
		return validateSignUp(signUp);
	}

}
