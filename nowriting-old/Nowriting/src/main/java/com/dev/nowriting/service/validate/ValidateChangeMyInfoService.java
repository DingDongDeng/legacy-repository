package com.dev.nowriting.service.validate;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.util.ValidateObject;

@Service
public class ValidateChangeMyInfoService implements ValidateService{
	@Autowired
	ValidateObject validateObject;
	@Override
	public Map execute(Map result) {
		
		Map info = (Map<String,Object>) result.get("info");
		int header = (Integer) info.get("header");
		
		if(header == 1) { //개인정보 수정요청
			String name = (String) info.get("name");
			if(validateObject.validateName(name, result)) return result;
		}
		else if(header == 2) {
			String mail = (String) info.get("mail");
			String pw = (String) info.get("pw");
			String newPW = (String) info.get("newPW");
			String newPwCheck = (String) info.get("newPwCheck");
			
			if(!validateObject.checkPW(mail, pw, result)) return result;
			if(!validateObject.validatePW(newPW, newPwCheck, result)) return result;
			
		}
		
		
		
		return result;
	}
}
