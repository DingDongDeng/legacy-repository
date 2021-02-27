package com.dev.nowriting.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidateForm {
	private String regexName; 
	private String regexMail; 
	private String regexID;
	private String regexPW;
	private String regexNumber;

	public boolean validateForm(String type, String str) {
		String regex=null;
		if(type.equals("name"))
			regex = regexName;
		else if(type.equals("mail"))
			regex = regexMail;
		else if(type.equals("id"))
			regex = regexID;
		else if(type.equals("pw"))
			regex = regexPW;
		else if(type.equals("number"))
			regex = regexNumber;
		else {
			try {
				throw new Exception();
			}
			catch (Exception e) {
				e.printStackTrace();
				System.out.println("regex type err");
			}	
		}

		boolean err = false;
		   
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher(str);
		if(m.matches()) {
			err = true; 
		}
		return err;
	}
	public String getRegexName() {
		return regexName;
	}
	public void setRegexName(String regexName) {
		this.regexName = regexName;
	}
	public String getRegexMail() {
		return regexMail;
	}
	public void setRegexMail(String regexMail) {
		this.regexMail = regexMail;
	}
	public String getRegexID() {
		return regexID;
	}
	public void setRegexID(String regexID) {
		this.regexID = regexID;
	}
	public String getRegexPW() {
		return regexPW;
	}
	public void setRegexPW(String regexPW) {
		this.regexPW = regexPW;
	}
	public String getRegexNumber() {
		return regexNumber;
	}
	public void setRegexNumber(String regexNumber) {
		this.regexNumber = regexNumber;
	}
	
	
	
}
