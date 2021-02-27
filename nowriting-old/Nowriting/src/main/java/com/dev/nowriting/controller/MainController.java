package com.dev.nowriting.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.dev.nowriting.service.main.MainContentCameraMobileService;
import com.dev.nowriting.service.main.MainContentDeleteService;
import com.dev.nowriting.service.main.MainContentDownLoadService;
import com.dev.nowriting.service.main.MainContentMoveService;
import com.dev.nowriting.service.main.MainContentSaveSerivce;
import com.dev.nowriting.service.main.MainContentShowService;
import com.dev.nowriting.service.main.MainProjectAddService;
import com.dev.nowriting.service.main.MainProjectDeleteService;
import com.dev.nowriting.service.main.MainProjectListService;
import com.dev.nowriting.service.validate.ValidateContentPageService;
import com.dev.nowriting.service.validate.ValidateProjectAddService;
import com.dev.nowriting.util.ValidateObject;

//@SessionAttributes({"id","task"})
@Controller
public class MainController {
	
	@Autowired
	ValidateObject validateObject;
	
	
	@Autowired
	MainProjectAddService mainProjectAddService;
	@Autowired
	MainProjectListService mainProjectListService; 
	@Autowired
	MainProjectDeleteService mainProjectDeleteService;
	@Autowired
	MainContentSaveSerivce mainContentSaveSerivce; 
	@Autowired
	MainContentShowService mainContentShowService;
	@Autowired
	MainContentMoveService mainContentMoveService; 
	@Autowired
	MainContentDeleteService mainContentDeleteService;
	@Autowired
	MainContentCameraMobileService mainContentCameraMobileService;
	@Autowired
	MainContentDownLoadService mainContentDownLoadService; 
	@Autowired
	ValidateContentPageService validateContentPageService;
	@Autowired
	ValidateProjectAddService validateProjectAddService; 
	
	@RequestMapping(value="/project", method=RequestMethod.GET)
	public ModelAndView project(ModelAndView mv, HttpSession session) {
		if(!sessionCheck("mail",session)) {
			mv.setViewName("redirect:/login");
			return mv;
		}
		
		
		String mail = (String) session.getAttribute("mail");
		Map result = new HashMap<String, Object>();
		result.put("mail",mail);
		mainProjectListService.execute(result);
		mv.setViewName("mainForm");
		mv.addObject("viewName","project");
		mv.addObject("projectList", result.get("projectList"));
		
		return mv;
	}
	@ResponseBody
	@RequestMapping(value="/projectAdd.check", method=RequestMethod.POST)
	public Map projectAdd(HttpSession session, @RequestBody Map<String,Object> project) {
		Map result = validateObject.initResultMap("addProject");
		if(!validateObject.checkSessionMail(session, result)) return result;
		result = validateProjectAddService.execute(project);
		String state = (String) result.get("STATE");
		String detail = (String) result.get("DETAIL");
		
		if(state.equals(validateObject.getInitState())&&
				detail.equals(validateObject.getInitDetail("addProject"))) {
			String mail = (String) session.getAttribute("mail");
			project.put("mail", mail);
			mainProjectAddService.execute(project);
		}
		 
		
		return result;
	}
	@ResponseBody
	@RequestMapping(value="/projectListRefresh", method=RequestMethod.POST)
	public Map projectRefresh(HttpSession session){
		Map result = validateObject.initResultMap("refreshProjectList");
		if(!validateObject.checkSessionMail(session, result)) return result;
		
		String mail = (String) session.getAttribute("mail");
				
		result.put("mail",mail);
		mainProjectListService.execute(result);		
		
		return result; 
	}
	
	@ResponseBody
	@RequestMapping(value="/projectDelete", method=RequestMethod.POST)
	public Map projectDelete(HttpSession session, @RequestBody Map<String,Object> project) {

		Map result = validateObject.initResultMap("deleteProject");
		if(!validateObject.checkSessionMail(session, result)) return result;
		String mail = (String) session.getAttribute("mail");
		String pId = (String) project.get("pId");
		if(!validateObject.checkPid(pId, mail, result)) return result;
		
		
		project.put("mail", mail);
		mainProjectDeleteService.execute(project);
		return result;
	}
	
	@RequestMapping(value = "/content", method = RequestMethod.POST)//@Requestbody 쓰고 싶었는데....
	public ModelAndView content(ModelAndView mv,HttpSession session,String pName, String pId) {
		if(!sessionCheck("mail",session)) {
			mv.setViewName("redirect:/login");
			return mv;
		}
		String mail = (String) session.getAttribute("mail");
		if(!validateObject.checkPid(pId, mail)) { //사용자가 pId를 변조했는지 확인
			mv.setViewName("redirect:/project");
			return mv;
		}
		
//		String content = new GoogleCloudVisionApi().detectText("sample.jpg");
		Map result = new HashMap<String, Object>();
		result.put("pId", pId);
		result.put("pName",pName);
		mainContentShowService.execute(result);
		
		mv.setViewName("mainForm");
		mv.addObject("viewName","content");
		mv.addObject("content", result);
		
		return mv;
	}
	@ResponseBody
	@RequestMapping(value = "/contentSave.check", method = RequestMethod.POST)//@Requestbody 쓰고 싶었는데....
	public Map contentSave(HttpSession session,@RequestBody Map<String, Object> content) {
		Map result = validateObject.initResultMap("contentSave");
		if(!validateObject.checkSessionMail(session, result)) return result;
		String mail = (String) session.getAttribute("mail");
		String pId = (String) content.get("pId");
		String page = (String) content.get("page");

		if(!validateObject.checkPid(pId, mail, result)) return result;
		if(!validateObject.checkPage(page, result)) return result;
		
		

		
		mainContentSaveSerivce.execute(content);
		
		return result;
	}

	@ResponseBody
	@RequestMapping(value = "/contentPageMove", method = RequestMethod.POST)//@Requestbody 쓰고 싶었는데....
	public Map contentPageMove(HttpSession session,@RequestBody Map<String, Object> content) {
		Map result = validateObject.initResultMap("contentPageMove");
		if(!validateObject.checkSessionMail(session, result)) return result;
		String mail = (String) session.getAttribute("mail");
		String pId = (String) content.get("pId");
		if(!validateObject.checkPid(pId, mail, result)) return result;

		
		String _pId = (String) content.get("pId");
		String page = (String) content.get("page");
		result.put("pId",_pId);
		result.put("page",page);
		result = validateContentPageService.execute(result);
		mainContentMoveService.execute(result);

		return result;
	}
	
	@ResponseBody
	@RequestMapping(value="/contentPageDelete", method = RequestMethod.POST)
	public Map contentPageDelete(HttpSession session, @RequestBody Map<String,Object> content) {
		
		Map result = validateObject.initResultMap("contentPageDelete");
		if(!validateObject.checkSessionMail(session, result)) return result;
		String mail = (String) session.getAttribute("mail");
		String pId = (String) content.get("pId");
		if(!validateObject.checkPid(pId, mail, result)) return result;
		
		String page=(String) content.get("page");
		result.put("pId", pId);
		result.put("page", page);
		
		result = validateContentPageService.execute(result);
		mainContentDeleteService.execute(result);
		
		return result;
	}
	@ResponseBody
	@RequestMapping(value="/contentCamera", method = RequestMethod.POST)
	public Map contentCamera(@RequestBody Map<String,Object> img,HttpSession session) {
		Map result = validateObject.initResultMap("contentCamera");
		String task="";
		
		if(sessionCheck("task",session)) {
			task = (String) session.getAttribute("task");
		}
		/*
		 * 아 생각해보니까
		 * pc, mobile 구분할 필요가 없네
		 * nomal, camera 정도로 구분해서 코드 정비하자
		 */
		result.put("file", img.get("file"));
		mainContentCameraMobileService.execute(result);		
		return result;
	}
	
	@ResponseBody
	@RequestMapping(value="/contentDownLoad", method = RequestMethod.POST)
	public Map contentDownLoad(@RequestBody Map<String,Object> content,HttpSession session) {
		Map result = validateObject.initResultMap("contentDownLoad");
		if(!validateObject.checkSessionMail(session, result)) return result;
		String mail = (String) session.getAttribute("mail");
		String pId = (String) content.get("pId");
		if(!validateObject.checkPid(pId, mail, result)) return result;
		String state = (String) result.get("STATE");
		String detail = (String) result.get("DETAIL");
		
		result.put("pId", pId);
		if(state.equals(validateObject.getInitState())&&detail.equals(validateObject.getInitDetail("contentDownLoad"))) {
			mainContentDownLoadService.execute(result);
		}
		
		return result;
	}
	
	@RequestMapping(value="/camera", method = RequestMethod.GET)
	public ModelAndView camera(HttpSession session,ModelAndView mv) {
		String task = (String)session.getAttribute("task");
		if(!sessionCheck("mail",session)) {
			mv.setViewName("redirect:/login");
			return mv;
		}
		if(!task.equals("camera")) {//업무타입이 camera가 아니면 리턴
			mv.setViewName("redirect:/login");
			return mv;
		}
		
		mv.setViewName("mainForm");
		mv.addObject("viewName", "camera");
		
		return mv;
	}


	
	public boolean sessionCheck(String key, HttpSession session) {
		if(session.getAttribute(key)==null)
			return false;
		
		return true;
	}
	
	
	
	
	

}
