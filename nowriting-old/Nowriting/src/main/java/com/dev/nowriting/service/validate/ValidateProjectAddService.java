package com.dev.nowriting.service.validate;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.jdbcTemplate.MainDAOImpl;
import com.dev.nowriting.util.ValidateObject;

@Service
public class ValidateProjectAddService implements ValidateService{
	
	@Autowired
	ValidateObject validateObject; 
	
	@Override
	public Map execute(Map map) {
		String projectName = (String) map.get("projectName");
		
		Map result =validateObject.initResultMap("addProject"); 
		validateObject.checkProjectName(projectName, result);
		
		
		return result;
	}

}
