package com.dev.nowriting.service.validate;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.util.ValidateObject;
@Service
public class ValidateContentPageService implements ValidateService{
	@Autowired
	ValidateObject validateObject; 
	@Override
	public Map execute(Map map) {
		Map result = map;
		String page = (String) map.get("page");
		if(!validateObject.checkPage(page, result)) return result;
		
		return result;
	}

}
