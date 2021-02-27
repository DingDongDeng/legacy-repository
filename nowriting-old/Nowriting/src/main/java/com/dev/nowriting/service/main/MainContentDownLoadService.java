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
public class MainContentDownLoadService implements MainService {
	
	@Autowired
	SqlSession sqlSession;
	
	@Override
	public void execute(Map result) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		
		String pId = (String) result.get("pId");
		ArrayList<ContentDTO> dtos = mainDAO.getContentList(pId);
		String text = "";
		text += "개행(Enter)은 hwp ,docx 등의 문서에서 정확히 인식됩니다.";
		text += "정확한 문서 편집을 위해서는 적절한 에디터를 사용해주세요";
		text += "txt파일의 경우 개행(Enter)이 정확히 인식되지 않습니다.";
		for(ContentDTO dto : dtos) {
			text += "\r\n\r\n" + dto.getPage()+"page ------------------------------\r\n\r\n";
			text += dto.getContent();
		}
		result.put("text", text);
		/*
		 * 시각장애인센터에서 요구하는 워드 양식이 존재함으로
		 * String관련 메소드 이용하여 적절히 변환하기. 
		 * 
		 */
		
	}

}
