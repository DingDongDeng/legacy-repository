package com.dev.nowriting.service.main;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MainMapper;

@Service
public class MainContentDeleteService implements MainService{

	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map result) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class); 
		
		String pId = (String) result.get("pId");
		String page = (String) result.get("page");
		mainDAO.deleteContentPage(pId, page);
		
	}

}
