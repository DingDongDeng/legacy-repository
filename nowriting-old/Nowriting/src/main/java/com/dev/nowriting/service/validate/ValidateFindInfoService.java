package com.dev.nowriting.service.validate;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.util.ValidateObject;

@Service
public class ValidateFindInfoService implements ValidateService{
	
	@Autowired
	ValidateObject validateObject; 
	
	@Override
	public Map execute(Map result) {
		String mail = (String) result.get("mail");
		if(!validateObject.validateMailforFind(mail, result)) return result;
		
		return result;
	}

}
