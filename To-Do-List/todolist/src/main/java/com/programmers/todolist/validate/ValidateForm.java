package com.programmers.todolist.validate;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class ValidateForm {
	String regexName ="^[��-�R]{2,7}|[a-zA-Z]{2,10}\\s[a-zA-Z]{2,10}$"; 
	//�ѱ�, ����(����)
	String regexMail = "^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\\w+\\.)+\\w+$";
	//xxx@xxx.xxx 
	String regexID = "^[A-Za-z0-9]{4,12}$";
	//���� ��,�ҹ��� , ���� 4 ~12 �ڸ�
	String regexPW = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$";
	//����,����,Ư�� ���� 8�ڸ��̻�
	String regexNumber = "^[0-9]+$";
	//0~9 ����

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
