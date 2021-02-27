package com.dev.nowriting.service.main;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MainMapper;

@Service
public class MainProjectListService implements MainService{
	
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map result) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		
		String mail = (String) result.get("mail");
		result.put("projectList",mainDAO.getProjectList(mail) );
		// TODO Auto-generated method stub
	}

}
