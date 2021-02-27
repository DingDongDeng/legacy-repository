package com.programmers.todolist.dto;

import java.sql.Timestamp;

public class MemberDTO {
	private String mail;
	private String password;
	private String authkey;
	private int authstatus;
	private Timestamp signUpDate;
	public MemberDTO() {
		
	}

	public MemberDTO(String mail, String password, String authkey, int authstatus, Timestamp signUpDate) {
		super();
		this.mail = mail;
		this.password = password;
		this.authkey = authkey;
		this.authstatus = authstatus;
		this.signUpDate = signUpDate;
	}



	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getAuthkey() {
		return authkey;
	}
	public void setAuthkey(String authkey) {
		this.authkey = authkey;
	}
	public int getAuthstatus() {
		return authstatus;
	}
	public void setAuthstatus(int authstatus) {
		this.authstatus = authstatus;
	}
	public Timestamp getSignUpDate() {
		return signUpDate;
	}
	public void setSignUpDate(Timestamp signUpDate) {
		this.signUpDate = signUpDate;
	}
	
}
