package com.dev.nowriting.service.main;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MainMapper;
import com.dev.nowriting.dao.jdbcTemplate.MainDAOImpl;

@Service
public class MainProjectDeleteService implements MainService{
	
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map map) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		
		String mail = (String) map.get("mail");
		String pId = (String) map.get("pId");
		String pName = (String) map.get("pName");
		
		mainDAO.deleteProject(mail, pId, pName);
		
		
		
	}

}
