package com.programmers.todolist.service;

import java.util.Map;

import com.programmers.todolist.dto.MemberDTO;

public interface MemberService {
	public Map signUpCheck(String mail, String password, String passwordCheck);
	public Map loginCheck(MemberDTO memberDTO);
	public void authCheck(String mail, String authKey);
	public Map findPW(String mail);
	
}
