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
		//������Ʈ�� �õ��Ѵ� STATE -> C (����, �켱����)
		ListMapper listDAO = sqlSession.getMapper(ListMapper.class);
		String flag = listDTO.getState();
		//����ڰ� ����Ʈ�� ó���Ϸ��Ϸ��� ������ ������ �Ϸ��� ������ �Ǵ�
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
		if(listDTO.getDeadline()==null) {//������ �Է����� ����
			
			listDAO.updateList(listDTO);
		}
		else {//������ �Է�
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
		listDAO.updatePriorityAfterDelete(mail, priority);//priority���� ���Ӽ��� ��Ű������ �ڵ� 
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
		 * R : Running ������
		 * C : Completed �Ϸ�
		 */
		listDTO.setPriority(priority);
		listDTO.setState(state);
		
		// textarea �� \n�� div�� </br> �� ����  
		String rebuild = listDTO.getContent().replaceAll("\n", "</br>");
		listDTO.setContent(rebuild);
		
		if(deadline==null) {
			listDAO.insertList(listDTO); //���������� ���°��
		}
		else {
			listDAO.insertListWithDate(listDTO);//���������� �ִ� ���
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
		if(title.length()>20) {//���� 20���� ����
			result.put("STATE", "ERR");
			result.put("DETAIL", "TOO_LONG_TITLE");
			return result;
		}

		if(content.equals("")||content==null) {
			result.put("STATE", "ERR");
			result.put("DETAIL", "EMPTY_CONTENT");
			return result;
		}
		
		if(content.length()>300) {//���� 300���� ����
			result.put("STATE", "ERR");
			result.put("DETAIL", "TOO_LONG_CONTENT");
			return result;
		}
		
		if(deadline!=null) {
			long sysTime =System.currentTimeMillis()+(1000*60*60*9);//�����ð� ���� ���
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
		 * ���� �ϳ� �Ǽ�����ڰ� priority ���� �����Ұ��
		 * �ý��ۿ� ġ�����̹Ƿ� ��ȿ�� priority������ Ȯ��
		 * priority�� 0~�ִ밳�� ������ ����������
		 */
		if(!(max>=priority&&0<=priority)) { //priority �����߻����� �ʴ� ������ ����
			result.put("STATE", "ERR");		
			result.put("DETAIL", "NOT_CORRECT_PRIORITY");
			return result;
		}
		return result;
	}
	
}
