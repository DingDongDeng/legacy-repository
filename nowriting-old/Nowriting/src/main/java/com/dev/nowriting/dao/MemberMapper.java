package com.dev.nowriting.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.dev.nowriting.dto.MemberDTO;

public interface MemberMapper {
	public ArrayList<MemberDTO> findMail(@Param("mail") String mail);
	public void insertMember(@Param("memberDTO") MemberDTO memberDTO);
	public void updateAuthStatus(@Param("mail") String mail, @Param("authKey") String authKey);
	public void updateMemberWithOutMail(@Param("memberDTO") MemberDTO memberDTO);//¾È¾µµí
	public String findOnlyPW(@Param("mail") String mail);
	public void updateName(@Param("mail") String mail, @Param("name") String name);
	public void updatePW(@Param("mail") String mail, @Param("pw") String pw);
	public void deleteMember(@Param("mail") String mail);
	public void deleteNotAuthMember();
}
