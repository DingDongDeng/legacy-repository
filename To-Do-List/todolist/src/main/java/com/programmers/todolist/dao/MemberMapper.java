package com.programmers.todolist.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.programmers.todolist.dto.MemberDTO;

public interface MemberMapper {
	public ArrayList<MemberDTO> findMail(@Param("mail") String mail);
	public void insertMember(@Param("memberDTO") MemberDTO memberDTO);
	public void updateAuth(@Param("mail") String mail, @Param("authkey") String authkey);
	public void deleteNotAuthMail();
}
