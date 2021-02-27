package com.dev.nowriting.service.main;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.dao.MainMapper;
import com.dev.nowriting.dao.jdbcTemplate.MainDAOImpl;
import com.dev.nowriting.dto.ContentDTO;
@Service
public class MainContentShowService implements MainService{

	@Autowired
	SqlSession sqlSession;
	@Override
	public void execute(Map content) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);

		String pId = (String) content.get("pId");
		ArrayList<ContentDTO> dtos = mainDAO.findContentMaxPage(pId);
		int size= dtos.size();
		if(size==1) {
			content.put("contentDTO", dtos.get(0));
			System.out.println("TEST 페이지 : " + dtos.get(0).getPage());
		}
		else if(size==0) {
			ContentDTO contentDTO = new ContentDTO();
			contentDTO.setContent(null);
			contentDTO.setPage("1");
			contentDTO.setpId(pId);
			content.put("contentDTO", contentDTO);
		}
		else {
			try {
				throw new Exception();
			}
			catch (Exception e) {
				e.printStackTrace();
				System.out.println("오류 발생 : content테이블 복수페이지 존재");
			}
			
		}
	}

}
