package com.programmers.todolist.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.programmers.todolist.dao.ListMapper;
import com.programmers.todolist.dto.ListDTO;

@Service
public class ListServiceImpl implements ListService{
	
	@Autowired
	SqlSession sqlSession;
	
	
	@Override
	public ArrayList<ListDTO> alertList(String mail) {
		ListMapper listMapper = sqlSession.getMapper(ListMapper.class);
		ArrayList<ListDTO> listDTOs =  listMapper.selectDeadlineOverList(mail);
		return listDTOs;
	}
	@Transactional
	@Override
	public Map listUp(String mail, int priority) {
		Map result = validatePriority(mail, priority);
		if("ERR".equals(result.get("STATE"))) {
			return result;
		}
		System.out.println(priority);
		
		if((priority-1)<0) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "CANT_MOVE");
			return result;
		}
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		listDAO.updatePriorityUpDown(mail, priority-1,-1);
		listDAO.updatePriorityUpDown(mail, priority,priority-1);
		listDAO.updatePriorityUpDown(mail, -1, priority);
		
		result.put("DETAIL", "SUCCESS_UPDATE_PRIORITY_UP_LIST");
		return result;
	}
	
	@Transactional
	@Override
	public Map listDown(String mail, int priority) {
		Map result = validatePriority(mail, priority);
		if("ERR".equals(result.get("STATE"))) {
			return result;
		}
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		int maxPriority = listDAO.selectMaxPriority(mail);
		if((priority+1)>maxPriority) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "CANT_MOVE");
			return result;
		}
		
		listDAO.updatePriorityUpDown(mail, priority+1,-1);
		listDAO.updatePriorityUpDown(mail, priority,priority+1);
		listDAO.updatePriorityUpDown(mail, -1, priority);
		
		
		
		
		result.put("DETAIL", "SUCCESS_UPDATE_PRIORITY_DOWN_LIST");
		return result;
	}
	
	@Override
	public Map listComplete(ListDTO listDTO) {
		Map result = validatePriority(listDTO.getMail(), listDTO.getPriority());
		if("ERR".equals(result.get("STATE"))) {
			return result;
		}
		//업데이트를 시도한다 STATE -> C (메일, 우선순위)
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		String flag = listDTO.getState();
		//사용자가 리스트를 처리완료하려는 것인지 해제를 하려는 것인지 판단
		if(flag.equals("R")) {
			listDAO.updateState(listDTO.getMail(), listDTO.getPriority(), "C");
		}
		if(flag.equals("C")) {
			listDAO.updateState(listDTO.getMail(), listDTO.getPriority(), "R");
		}
		result.put("DETAIL", "SUCCESS_UPDATE_STATE_LIST");
		
		return result;
	}
	
	@Override
	public Map listUpdate(ListDTO listDTO) {
		Map result = validateListDTO(listDTO);
		if("ERR".equals(result.get("STATE"))) {
			return result;
		}
		result = validatePriority(listDTO.getMail(), listDTO.getPriority());
		if("ERR".equals(result.get("STATE"))) {
			return result;
		}
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		
		String rebuild = listDTO.getContent().replaceAll("\n", "</br>");
		listDTO.setContent(rebuild);
		if(listDTO.getDeadline()==null) {//기한을 입력하지 않음
			
			listDAO.updateList(listDTO);
		}
		else {//기한을 입력
			listDAO.updateListWithDate(listDTO);
		}
		
		result.put("DETAIL", "SUCCESS_MODIFY_LIST");
		return result;
	}
	@Transactional
	@Override
	public Map listDelete(String mail,int priority) {
		Map result = validatePriority(mail,priority);
		if("ERR".equals(result.get("STATE"))) {
			return result;
		}
		
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		
		listDAO.deleteList(mail, priority);
		listDAO.updatePriorityAfterDelete(mail, priority);//priority값의 연속성을 지키기위한 코드 
		result.put("DETAIL", "SUCCESS_DELETE_LIST");
		return result;
	}
	@Override
	public ArrayList<ListDTO> showList(String mail) {
		
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		return listDAO.selectList(mail);
	}
	
	@Override
	public Map listAdd(ListDTO listDTO) {
		Map result = validateListDTO(listDTO);
		if(result.get("STATE").equals("ERR")) {
			return result;
		}
		
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		
		String mail = listDTO.getMail();
		Timestamp deadline = listDTO.getDeadline();
		int priority = listDAO.cntList(mail);
		String state = "R"; 
		/*
		 * R : Running 진행중
		 * C : Completed 완료
		 */
		listDTO.setPriority(priority);
		listDTO.setState(state);
		
		// textarea 의 \n를 div의 </br> 로 변경  
		String rebuild = listDTO.getContent().replaceAll("\n", "</br>");
		listDTO.setContent(rebuild);
		
		if(deadline==null) {
			listDAO.insertList(listDTO); //마감기한이 없는경우
		}
		else {
			listDAO.insertListWithDate(listDTO);//마감기한이 있는 경우
		}
		result.put("DETAIL", "SUCCESS_ADD_LIST");
		result.put("ListDTO", listDTO);
		return result;
	}
	
	public Map validateListDTO(ListDTO listDTO) {
		Map result = new HashMap<String, Object>();
		
		result.put("STATE", "SUCCESS");

		String title = listDTO.getTitle();
		Timestamp deadline = listDTO.getDeadline();
		String content = listDTO.getContent();
		
		if(title.equals("")||title==null) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "EMPTY_TITLE");
			return result;
		}
		if(title.length()>20) {//제목 20글자 이하
			result.put("STATE", "ERR");
			result.put("DETAIL", "TOO_LONG_TITLE");
			return result;
		}

		if(content.equals("")||content==null) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "EMPTY_CONTENT");
			return result;
		}
		
		if(content.length()>300) {//내용 300글자 이하
			result.put("STATE", "ERR");
			result.put("DETAIL", "TOO_LONG_CONTENT");
			return result;
		}
		
		if(deadline!=null) {
			long sysTime =System.currentTimeMillis()+(1000*60*60*9);//서버시간 오차 고려
			long dead = deadline.getTime();
			if((dead-sysTime)<0) {
				result.put("STATE", "ERR");
				result.put("DETAIL", "OVER_DEADLINE");
				return result;
			}
		}
		
		return result;
	}
	public Map validatePriority(String mail, int priority) {
		Map result = new HashMap<String,Object>();
		result.put("STATE", "SUCCESS");
		
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		int max = listDAO.selectMaxPriority(mail);
		/*
		 * 만에 하나 악성사용자가 priority 값을 변조할경우
		 * 시스템에 치명적이므로 유효한 priority값인지 확인
		 * priority는 0~최대개수 사이의 정수여야함
		 */
		if(!(max>=priority&&0<=priority)) { //priority 오류발생하지 않는 범위로 제어
			result.put("STATE", "ERR");		
			result.put("DETAIL", "NOT_CORRECT_PRIORITY");
			return result;
		}
		return result;
	}
	
}
