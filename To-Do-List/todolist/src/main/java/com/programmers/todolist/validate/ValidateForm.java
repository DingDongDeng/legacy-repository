package com.programmers.todolist.validate;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class ValidateForm {
	String regexName ="^[°¡-ÆR]{2,7}|[a-zA-Z]{2,10}\\s[a-zA-Z]{2,10}$"; 
	//ÇÑ±Û, ¿µ¹®(¶ç¾î¾²±â)
	String regexMail = "^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\\w+\\.)+\\w+$";
	//xxx@xxx.xxx 
	String regexID = "^[A-Za-z0-9]{4,12}$";
	//¿µ¹® ´ë,¼Ò¹®ÀÚ , ¼ýÀÚ 4 ~12 ÀÚ¸®
	String regexPW = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$";
	//¿µ¹®,¼ýÀÚ,Æ¯¹® Á¶ÇÕ 8ÀÚ¸®ÀÌ»ó
	String regexNumber = "^[0-9]+$";
	//0~9 ¼ýÀÚ

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
