package com.dev.nowriting.configuration;

import java.util.Date;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.dev.nowriting.dao.MemberMapper;

@Configuration
@EnableScheduling
public class SchedulConfig {
	
	@Autowired
	SqlSession sqlSession;
	
	@Scheduled(fixedRate = 1000*60*60*24)//하루한번 메일인증 완료하지않은 회원 삭제
	public void scheduleFixedRateTask() {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		memberDAO.deleteNotAuthMember();
		
	    System.out.println(new Date()+" - 메일인증 미완료 회원 삭제");
	}

}
