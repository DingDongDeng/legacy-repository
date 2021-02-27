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
		if(cnt==1) {//������ ������ �����ϴ� ���
			mainDAO.updateContent(pId, page, _content);
		}
		else if(cnt==0) {//�������� ���� �Է��ϴ� ���
			mainDAO.insertContent(pId, page, _content);
		}
		else {
			try {
				throw new Exception();
			}
			catch (Exception e) {
				e.printStackTrace();
				System.out.println("�����߻� : content���̺� �ߺ������� ����");
			}
		}
		
		
		
	}

}
