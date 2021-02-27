package com.dev.nowriting.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;

import com.dev.nowriting.dao.MainMapper;
import com.dev.nowriting.dao.MemberMapper;
import com.dev.nowriting.dao.jdbcTemplate.MemberDAO;
import com.dev.nowriting.dto.MemberDTO;
import com.dev.nowriting.dto.ProjectDTO;

public class ValidateObject {
	/*
	 * 사용법:
	 * 결과를 담음 Map result 객체를 생성
	 * result를 getInit 관련 메소드를 통해 초기화
	 * 이후 사용하고자 하는 메소드의 결과에 따라
	 * result 객체 안에 STATE, DETAIL 의 값이 변경됨
	 * 검증결과가 이상이 없다면 result안의 값은
	 * 처음 초기화한 값 그대로 있을 것임
	 * 
	 */
	@Autowired
	SqlSession sqlSession;

	@Autowired
	private ValidateForm validateForm;
	
	public boolean validateName(String name, Map result) {
		if(name.equals("")|| name==null) {
			result.put("STATE", "ERR_NAME");
			result.put("DETAIL", "NULL" );
			return false;
		}
		if(!validateForm.validateForm("name", name)) {
			result.put("STATE", "ERR_NAME");
			result.put("DETAIL", "NOT_CORRECT_FORM" );
			return false;
		}
		return true;
	}
	public boolean checkOverlapMail(String mail) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		if(memberDAO.findMail(mail).size()==0) //아이디가 중복되지 않으면
			return false;
		return true;
	}
	public boolean validateMail(String mail, Map result) {
		if(mail.equals("")|| mail==null) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL", "NULL" );
			return false;
		}
		
		if(!validateForm.validateForm("mail", mail)) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL", "NOT_CORRECT_FORM" );
			return false;
		}
		if(checkOverlapMail(mail)) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL", "OVERLAP" );
			return false;
		}
		return true;
	}
	public boolean validateMailforFind(String mail, Map result) {
		if(mail.equals("")|| mail==null) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL", "NULL" );
			return false;
		}
		
		if(!validateForm.validateForm("mail", mail)) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL", "NOT_CORRECT_FORM" );
			return false;
		}
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		ArrayList<MemberDTO> dtos = memberDAO.findMail(mail);
		int size = dtos.size();
		if(size==0) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL", "NOT_EXIST_MAIL");
			return false;
		}
		
		MemberDTO dto = dtos.get(0);
		result.put("memberDTO", dto);
		return true;
	}
//	public boolean checkOverlapID(String id) {
//		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
//		if(memberDAO.findID(id).size()==0) //아이디가 중복되지 않으면
//			return false;
//		return true;
//	}

//	public boolean validateID(String id, Map result) {
//		if(id.equals("")|| id==null) {
//			result.put("STATE", "ERR_ID");
//			result.put("DETAIL", "NULL" );
//			return false;
//		}
//		if(checkOverlapID(id)) {
//			result.put("STATE", "ERR_ID");
//			result.put("DETAIL", "OVERLAP" );
//			return false;
//		}
//		if(!validateForm.validateForm("id", id)) {
//			result.put("STATE", "ERR_ID");
//			result.put("DETAIL", "NOT_CORRECT_FORM" );
//			return false;
//		}
//		
//		return true;
//
//	}
	
	public boolean validatePW(String pw,String pwCheck, Map result) {
		if(pw.equals("")|| pw==null) {
			result.put("STATE", "ERR_PW");
			result.put("DETAIL", "NULL" );
			return false;
		}
		if(pwCheck.equals("")|| pwCheck==null) {
			result.put("STATE", "ERR_PWCHECK");
			result.put("DETAIL", "NULL" );
			return false;
		}
		if(!validateForm.validateForm("pw", pw)) { //입력된 비밀번호 형식을 검증한뒤 , 아래에서 pwCheck가 되어야함
			result.put("STATE", "ERR_PW");
			result.put("DETAIL", "NOT_CORRECT_FORM" );
			return false;
		}
		if(!pw.equals(pwCheck)) { 
			result.put("STATE", "ERR_PW");
			result.put("DETAIL", "NOT_SAME" );
			return false;
		}
		
		return true;
	}
	public boolean checkPW(String mail, String pw, Map result) {
		if(pw.equals("") || pw==null) {
			result.put("STATE", "ERR_NOWPW");
			result.put("DETAIL","NULL");
		}
		
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		String db_pw = memberDAO.findOnlyPW(mail);
		
		if(!pw.equals(db_pw)) { 
			result.put("STATE", "ERR_NOWPW");
			result.put("DETAIL", "NOT_SAME" );
			return false;
		}
		
		
		return true;
	}
	
	public Map checkLogIn(String mail, String pw) {
		MemberMapper memberDAO = sqlSession.getMapper(MemberMapper.class);
		ArrayList dtos = memberDAO.findMail(mail);//
		Map result = new HashMap<String, Object>();

		int amount = dtos.size();//검색된 아이디 개수 0, 1 (이외의 숫자는 치명적 오류)
		if(mail.equals("")||mail==null) {
			result.put("STATE", "ERR_MAIL");
			result.put("DETAIL","NULL");
			return result;
		}
		if(pw.equals("")||pw==null) {
			result.put("STATE", "ERR_PW");
			result.put("DETAIL","NULL");
			return result;
		}
		switch (amount) {
			case 0:
				result.put("STATE", "ERR_MAIL");
				result.put("DETAIL","NO_SEARCH_MAIL");
				break;
			case 1:
				MemberDTO memberDTO = (MemberDTO) dtos.get(0);
				if(pw.equals(memberDTO.getPw())){
					if(memberDTO.getAuthstatus()==1) {
						result.put("STATE", "SUCCESS");
						result.put("DETAIL", "SUCCESS_LOGIN");
					}
					else {
						result.put("STATE", "ERR_AUTHSTATUS");
						result.put("DETAIL", "NOT_AUTHENTICATION");
					}
				}
				else {
					result.put("STATE", "ERR_PW");
					result.put("DETAIL", "NOT_CORRECT_PW");
				}
				break;
	
			default:
				try {
					throw new Exception();
				}
				catch(Exception e) {
					e.printStackTrace();
					System.out.println("치명적 오류 발생 복수아이디가 존재");
				}
				break;
		}
		
		
		return result;
	}
	
	public boolean checkPid(String pId, String mail, Map result) {
		
		if(pId.equals("")||pId==null) {
			result.put("STATE","ERR_PID");
			result.put("DETAIL","NULL");
			return false;
		}
		//--------------------------
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		ArrayList<ProjectDTO> dtos = mainDAO.getProjectList(mail);
		for(ProjectDTO dto : dtos) {
			if(pId.equals(dto.getpId())){
				return true;
			}
		}
		result.put("STATE","ERR_PID");
		result.put("DETAIL","NOT_USERS_PID");
		
		return false;
	}
	public boolean checkPid(String pId,String mail) {
		MainMapper mainDAO = sqlSession.getMapper(MainMapper.class);
		ArrayList<ProjectDTO> dtos = mainDAO.getProjectList(mail);
		for(ProjectDTO dto : dtos) {
			if(pId.equals(dto.getpId())){
				return true;
			}
		}
		return false;
	}
	
	public boolean checkPage(String page, Map result) {
		
		if(!validateForm.validateForm("number", page)) {
			result.put("STATE", "ERR_PAGE");
			result.put("DETAIL", "NOT_CORRECT_FORM");
			return false;
		}
		int _page = Integer.parseInt(page);
		if(_page<=0) {
			result.put("STATE", "ERR_PAGE");
			result.put("DETAIL", "NOT_CORRECT_FORM");
			return false;
		}
		return true;
	}
	public boolean checkSessionMail(HttpSession session,Map result) {
		if(session.getAttribute("mail")==null) {
			result.put("STATE","ERR_LOGIN");
			result.put("DETAIL","NO_LOGIN");
			return  false;
		}
		return true;
	}
	public boolean sessionCheck(String key, HttpSession session) {
		System.out.println("로그인 중인 아이디(session) : " + session.getAttribute(key));
		if(session.getAttribute(key)==null)
			return false;
		
		return true;
	}
	
	public void checkProjectName(String pName, Map result) {
		if(pName.equals("")||pName==null) {
			result.put("STATE", "ERR_PROJECT_NAME");
			result.put("DETAIL", "NULL");
		}
	}
	
	public Map initResultMap(String processName) {
		
		
		Map result = new HashMap<String, Object>();
		result.put("STATE", getInitState());
		result.put("DETAIL", getInitDetail(processName));
		
		return result;

	}
	public String getInitState() {
		String initSTATE = "SUCCESS";
		return initSTATE;
	}
	public String getInitDetail(String processName) {
		String initDETAIL=null; 
		if(processName.equals("login")) {
			initDETAIL = "SUCCESS_LOGIN";
		}
		else if(processName.equals("signUp")) {
			initDETAIL = "SUCCESS_SIGN_UP";
		}
		else if(processName.equals("mailCheck")) {
			initDETAIL = "SUCCESS_MAIL_CHECK";
		}
		else if(processName.equals("addProject")) {
			initDETAIL = "SUCCESS_ADD_PROJECT";
		}
		else if(processName.equals("refreshProjectList")){
			initDETAIL = "SUCCESS_REFRESH_PROJECT_LIST";
		}
		else if(processName.equals("deleteProject")){
			initDETAIL = "SUCCESS_DELETE_PROJECT";
		}
		else if(processName.equals("contentSave")) {
			initDETAIL = "SUCCESS_SAVE_CONTENT";
		}
		else if(processName.equals("contentPageMove")) {
			initDETAIL = "SUCCESS_MOVE_CONTENT_PAGE";
		}
		else if(processName.equals("contentPageDelete")) {
			initDETAIL = "SUCCESS_DELETE_CONTENT_PAGE";
		}
		else if(processName.equals("contentCamera")) {
			initDETAIL = "SUCCESS_CONTENT_CAMERA";
		}
		else if(processName.equals("contentDownLoad")) {
			initDETAIL = "SUCCESS_CONTENT_DOWNLOAD";
		}
		else if(processName.equals("changeMyInfo")) {
			initDETAIL = "SUCCESS_CHANGE_MYINFO";
		}
		else if(processName.equals("secession")) {
			initDETAIL = "SUCCESS_SECESSION";
		}
		else if(processName.equals("findInfo")) {
			initDETAIL = "SUCCESS_FIND_INFO";
		}
		else {
			try {
				throw new Exception();
			}
			catch (Exception e) {
				e.printStackTrace();
				System.out.println("의도하지않은 processName");
			}
		}
		
		return initDETAIL;
	}
	
}
