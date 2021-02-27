package com.dev.nowriting.service.main;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MainMapper;
@Service
public class MainContentSaveSerivce implements MainService {
	
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map content) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		String pId = (String) content.get("pId");
		String page = (String) content.get("page");
		String _content =(String) content.get("content"); 
		int cnt = mainDAO.contentCnt(pId, page);
		if(cnt==1) {//페이지 내용을 수정하는 경우
			mainDAO.updateContent(pId, page, _content);
		}
		else if(cnt==0) {//페이지를 새로 입력하는 경우
			mainDAO.insertContent(pId, page, _content);
		}
		else {
			try {
				throw new Exception();
			}
			catch (Exception e) {
				e.printStackTrace();
				System.out.println("오류발생 : content테이블 중복페이지 존재");
			}
		}
		
		
		
	}

}
