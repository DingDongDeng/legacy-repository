package com.programmers.todolist.configuration;

import java.util.Date;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.programmers.todolist.dao.MemberMapper;

@Configuration
@EnableScheduling
public class SchedulConfig {
	
	@Autowired
	SqlSession sqlSession;
	
	@Scheduled(fixedRate = 1000*60*60*24)//�Ϸ��ѹ� �������� �Ϸ��������� ȸ�� ����
	public void scheduleFixedRateTask() {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		memberDAO.deleteNotAuthMail();
	    System.out.println(new Date()+" - �������� �̿Ϸ� ȸ�� ����");
	}

}
