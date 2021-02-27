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
		text += "����(Enter)�� hwp ,docx ���� �������� ��Ȯ�� �νĵ˴ϴ�.";
		text += "��Ȯ�� ���� ������ ���ؼ��� ������ �����͸� ������ּ���";
		text += "txt������ ��� ����(Enter)�� ��Ȯ�� �νĵ��� �ʽ��ϴ�.";
		for(ContentDTO dto : dtos) {
			text += "\r\n\r\n" + dto.getPage()+"page ------------------------------\r\n\r\n";
			text += dto.getContent();
		}
		result.put("text", text);
		/*
		 * �ð�����μ��Ϳ��� �䱸�ϴ� ���� ����� ����������
		 * String���� �޼ҵ� �̿��Ͽ� ������ ��ȯ�ϱ�. 
		 * 
		 */
		
	}

}
