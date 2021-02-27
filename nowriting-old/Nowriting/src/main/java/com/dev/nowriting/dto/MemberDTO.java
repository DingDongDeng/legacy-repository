package com.dev.nowriting.dto;

import java.sql.Timestamp;
import java.util.Map;


public class MemberDTO {
	
	
	private String mail;
	private String pw;
	private String name;	
	private String authkey;
	private int authstatus;
	private Timestamp signUpDate;
	
	
	public MemberDTO() {
		super();
	}
	public MemberDTO(String mail, String pw, String name, String authkey, int authstatus,Timestamp signUpDate) {
		super();
		this.mail = mail;
		this.pw = pw;
		this.name = name;
		this.authkey = authkey;
		this.authstatus = authstatus;
		this.signUpDate = signUpDate;
	}

	public String getPw() {
		return pw;
	}
	public void setPw(String pw) {
		this.pw = pw;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
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
	public void setAllbyMap(Map<String,Object> map) {//제너레이터를 더 유연하게 할 방법이 없을까
		for( String key :  map.keySet() ){
			if(key.equals("mail")) this.mail = (String) map.get(key);
            else if(key.equals("pw")) this.pw = (String) map.get(key);
            else if(key.equals("name")) this.name = (String) map.get(key);
        }

	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "MAIL : " + mail +
			   "PW : " + pw +
			   "NAME : " + name +
			   "AUTHKEY : " + authkey +
			   "AUTHSTATUS : " + authstatus;
	}
}
