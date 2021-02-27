package com.programmers.todolist.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.programmers.todolist.dto.ListDTO;
import com.programmers.todolist.service.ListServiceImpl;

/**
 * Handles requests for the application home page.
 */
@Controller
public class ListController {
	
	@Autowired
	ListServiceImpl listService;
	
	@RequestMapping(value = {"/list"}, method = RequestMethod.GET)
	public ModelAndView list(HttpSession session, ModelAndView mv) {
		
		
		
		mv.setViewName("mainTemplate");
		mv.addObject("pageName", "list");
		String mail = (String) session.getAttribute("mail");
		mv.addObject("listDTOs", listService.showList(mail));
		return mv;
	}

	@ResponseBody
	@RequestMapping(value = {"/listEdit"},method = RequestMethod.POST)//
	public Map listEdit2(@RequestBody ListDTO listDTO,	HttpSession session) {
		
		System.out.println(listDTO.getTitle());
		System.out.println(listDTO.getContent());
		System.out.println(listDTO.getDeadline());
		
		Map result = new HashMap<String, Object>();
		listDTO.setMail((String)session.getAttribute("mail"));
		result.put("STATE","SUCCESS");
		result.put("DETAIL","SUCCESS_SET_MODIFY_PAGE");
		result.put("ListDTO",listDTO);
		
		return result;
	}
	
//	@ResponseBody
//	@RequestMapping(value = {"/listEdit"},method = RequestMethod.POST)//
//	public Map listEdit2(ListDTO listDTO,@RequestParam("date") String deadline,
//								HttpSession session) {
//		
//		listDTO.setMail((String)session.getAttribute("mail"));
//		
//		if(!deadline.equals("NaN")) {
//			listDTO.setDeadline(deadline);
//		}
//		mv.addObject("listDTO",listDTO);
//
//	
//		mv.setViewName("mainTemplate");
//		mv.addObject("pageName", "listEdit");
//		return mv;
//	}

	
	@ResponseBody
	@RequestMapping(value = {"/listEdit/{process}"}, method = RequestMethod.POST)
	public Map listEditProcess(@PathVariable("process") String path,
								  @RequestBody ListDTO listDTO,
								  HttpSession session) {
		Map result = null;
		
		if(path.equals("add")) {//리스트 추가요청
			listDTO.setMail((String)session.getAttribute("mail"));
			result = listService.listAdd(listDTO);
		}
		if(path.equals("delete")) {//리스트 삭제요청
			String mail = (String)session.getAttribute("mail");
			int priority = listDTO.getPriority();
			result = listService.listDelete(mail,priority);
		}
		if(path.equals("modify")) {//리스트 수정요청
			listDTO.setMail((String)session.getAttribute("mail"));
			result = listService.listUpdate(listDTO);
			result.put("ListDTO",listDTO);
		}
		if(path.equals("complete")) {//리스트 완료 및 해제 요청
			listDTO.setMail((String)session.getAttribute("mail"));
			result = listService.listComplete(listDTO);
			
		}
		if(path.equals("up")) {
			String mail = (String)session.getAttribute("mail");
			int priority = listDTO.getPriority();
			result = listService.listUp(mail,priority);
		}
		if(path.equals("down")) {
			String mail = (String)session.getAttribute("mail");
			int priority = listDTO.getPriority();
			result = listService.listDown(mail,priority);
		}

		return result;
	}
	
	
	@ResponseBody
	@RequestMapping(value = {"/alert"}, method = RequestMethod.POST)
	public Map listEditProcess(HttpSession session) {
		
		Map result = new HashMap<String, Object>();
		String mail = (String) session.getAttribute("mail");
		ArrayList<ListDTO> listDTOs =listService.alertList(mail); 
		result.put("listDTOs", listDTOs);
		result.put("STATE","SUCCESS");
		result.put("DETAIL","SUCCESS_ALERT_LIST");
		
		return result;
	}
	
	
	
}
