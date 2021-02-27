package com.dev.nowriting.dao.jdbcTemplate;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.dev.nowriting.dto.MemberDTO;

public interface MemberDAO {
	
	public ArrayList<MemberDTO> findID(String id);
	public ArrayList<MemberDTO> findMail(String mail);
	public void insertMember(MemberDTO memberDTO);
	public void updateAuthStatus(String mail, String authKey);
	
}
