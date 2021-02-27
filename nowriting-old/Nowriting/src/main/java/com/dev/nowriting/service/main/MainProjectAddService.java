package com.dev.nowriting.service.main;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MainMapper;
@Service
public class MainProjectAddService implements MainService{
	
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map project) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		String projectName =(String) project.get("projectName");
		String mail = (String) project.get("mail");
		mainDAO.insertProject(projectName, mail);
	}

}
